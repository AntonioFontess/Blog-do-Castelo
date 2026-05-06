import { supabase } from './supabase';
import { uploadFile, deleteFromStorage } from './storage';
import { getCached, setCached, invalidateCache } from './cache';

// ----- LEITURA --------------------------------------------------------------

// Lista posts (todos para admin; públicos para anon — RLS já filtra).
// Aceita filtro opcional por categoria.
// `publishedOnly`: garante que só publicados sejam retornados (para uso público,
// mesmo quando um admin estiver logado).
export async function listPosts({ category, limit, offset = 0, publishedOnly = false } = {}) {
  const cacheKey = `posts:list:${publishedOnly ? 'pub' : 'all'}:${category ?? '*'}:${limit ?? 'all'}:${offset}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('posts')
    .select('id, title, slug, category, cover_image, published, created_at, updated_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('published', true);
  }
  if (category && category !== 'todas') {
    query = query.eq('category', category);
  }
  if (typeof limit === 'number') {
    query = query.range(offset, offset + limit - 1);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  const result = { posts: data ?? [], total: count ?? 0 };
  setCached(cacheKey, result);
  return result;
}

export async function getPostBySlug(slug) {
  const cacheKey = `posts:slug:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (data) setCached(cacheKey, data);
  return data;
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listPostImages(postId) {
  const { data, error } = await supabase
    .from('post_images')
    .select('id, image_url, display_order')
    .eq('post_id', postId)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ----- ESCRITA --------------------------------------------------------------

// Cria post, faz upload de capa e galeria. Retorna o post criado.
export async function createPost({ post, coverFile, galleryFiles }) {
  let coverUrl = null;
  if (coverFile) {
    const { publicUrl } = await uploadFile('covers', coverFile);
    coverUrl = publicUrl;
  }

  const { data: created, error: insertErr } = await supabase
    .from('posts')
    .insert({ ...post, cover_image: coverUrl })
    .select()
    .single();
  if (insertErr) {
    if (coverUrl) await deleteFromStorage('covers', coverUrl); // melhor-esforço
    throw insertErr;
  }

  if (galleryFiles?.length) {
    await uploadGalleryFor(created.id, galleryFiles);
  }
  invalidateCache('posts:');
  return created;
}

// Atualiza post, troca capa se vier nova, sincroniza galeria.
// `removedGalleryIds` = ids de post_images existentes a remover.
// `existingCoverUrl` = URL atual no banco (pra apagar do Storage se trocada).
export async function updatePost({
  id,
  post,
  coverFile,
  existingCoverUrl,
  galleryFiles,
  removedGalleryItems,
}) {
  let coverUrl = existingCoverUrl ?? null;
  if (coverFile) {
    const { publicUrl } = await uploadFile('covers', coverFile);
    coverUrl = publicUrl;
  }

  const { error: updateErr } = await supabase
    .from('posts')
    .update({ ...post, cover_image: coverUrl })
    .eq('id', id);
  if (updateErr) throw updateErr;

  // Apagar capa antiga se foi trocada
  if (coverFile && existingCoverUrl && existingCoverUrl !== coverUrl) {
    await deleteFromStorage('covers', existingCoverUrl);
  }

  // Remover imagens antigas marcadas
  if (removedGalleryItems?.length) {
    const ids = removedGalleryItems.map((i) => i.id);
    await supabase.from('post_images').delete().in('id', ids);
    await Promise.all(
      removedGalleryItems.map((i) => deleteFromStorage('gallery', i.image_url))
    );
  }

  // Subir novas imagens da galeria
  if (galleryFiles?.length) {
    await uploadGalleryFor(id, galleryFiles);
  }
  invalidateCache('posts:');
}

async function uploadGalleryFor(postId, files) {
  const uploads = await Promise.all(
    files.map((file) => uploadFile('gallery', file))
  );

  // Pega o maior display_order existente para empilhar abaixo dele
  const { data: existing } = await supabase
    .from('post_images')
    .select('display_order')
    .eq('post_id', postId)
    .order('display_order', { ascending: false })
    .limit(1);
  const start = (existing?.[0]?.display_order ?? -1) + 1;

  const rows = uploads.map((u, i) => ({
    post_id: postId,
    image_url: u.publicUrl,
    display_order: start + i,
  }));
  const { error } = await supabase.from('post_images').insert(rows);
  if (error) throw error;
}

// Deleta post + galeria + arquivos no Storage.
export async function deletePost(id) {
  // Buscar post + imagens pra saber o que apagar do Storage
  const [{ data: post }, { data: images }] = await Promise.all([
    supabase.from('posts').select('cover_image').eq('id', id).maybeSingle(),
    supabase.from('post_images').select('id, image_url').eq('post_id', id),
  ]);

  // Deletar a linha do post (cascade apaga post_images)
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;

  // Limpar Storage (melhor-esforço)
  if (post?.cover_image) await deleteFromStorage('covers', post.cover_image);
  if (images?.length) {
    await Promise.all(images.map((i) => deleteFromStorage('gallery', i.image_url)));
  }
  invalidateCache('posts:');
}
