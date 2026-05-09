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
// Se a galeria falhar, desfaz a criação do post para evitar "post fantasma"
// sem as imagens que o usuário esperava ter cadastrado.
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
    try {
      await uploadGalleryFor(created.id, galleryFiles);
    } catch (galleryErr) {
      await supabase.from('posts').delete().eq('id', created.id);
      if (coverUrl) await deleteFromStorage('covers', coverUrl);
      throw galleryErr;
    }
  }
  invalidateCache('posts:');
  return created;
}

// Atualiza post, troca capa se vier nova, sincroniza galeria.
// - `coverFile`: novo arquivo a subir (ou null).
// - `existingCoverUrl`: URL desejada quando NÃO há novo arquivo. Null = remover.
// - `originalCoverUrl`: URL atual no banco; usada pra apagar do Storage quando
//    a capa for trocada OU removida.
export async function updatePost({
  id,
  post,
  coverFile,
  existingCoverUrl,
  originalCoverUrl,
  galleryFiles,
  removedGalleryItems,
}) {
  let nextCoverUrl = existingCoverUrl ?? null;
  let uploadedCoverUrl = null;
  if (coverFile) {
    const { publicUrl } = await uploadFile('covers', coverFile);
    uploadedCoverUrl = publicUrl;
    nextCoverUrl = publicUrl;
  }

  const { error: updateErr } = await supabase
    .from('posts')
    .update({ ...post, cover_image: nextCoverUrl })
    .eq('id', id);
  if (updateErr) {
    if (uploadedCoverUrl) await deleteFromStorage('covers', uploadedCoverUrl);
    throw updateErr;
  }

  // Apagar capa antiga em qualquer mudança (troca ou remoção).
  if (originalCoverUrl && originalCoverUrl !== nextCoverUrl) {
    await deleteFromStorage('covers', originalCoverUrl);
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

// Atômico: ou todas as imagens entram na galeria, ou nenhuma. Se algum upload
// falhar (ou o insert no DB falhar), os arquivos já enviados são removidos do
// Storage para não virarem órfãos.
async function uploadGalleryFor(postId, files) {
  const results = await Promise.allSettled(
    files.map((file) => uploadFile('gallery', file))
  );

  const uploaded = [];
  const failedNames = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') uploaded.push(r.value);
    else failedNames.push(files[i]?.name ?? 'arquivo');
  });

  if (failedNames.length) {
    await Promise.all(
      uploaded.map((u) => deleteFromStorage('gallery', u.publicUrl))
    );
    throw new Error(`Falha ao enviar imagens: ${failedNames.join(', ')}`);
  }

  // Pega o maior display_order existente para empilhar abaixo dele
  const { data: existing } = await supabase
    .from('post_images')
    .select('display_order')
    .eq('post_id', postId)
    .order('display_order', { ascending: false })
    .limit(1);
  const start = (existing?.[0]?.display_order ?? -1) + 1;

  const rows = uploaded.map((u, i) => ({
    post_id: postId,
    image_url: u.publicUrl,
    display_order: start + i,
  }));
  const { error } = await supabase.from('post_images').insert(rows);
  if (error) {
    await Promise.all(
      uploaded.map((u) => deleteFromStorage('gallery', u.publicUrl))
    );
    throw error;
  }
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
