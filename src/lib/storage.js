import { supabase } from './supabase';

// Gera um nome único para o arquivo no Storage, preservando a extensão.
function uniqueFileName(file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now();
  return `${id}.${ext}`;
}

// Sobe um arquivo para um bucket e devolve a URL pública.
export async function uploadFile(bucket, file) {
  const path = uniqueFileName(file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Extrai o caminho ("path") do arquivo dentro do bucket a partir da URL pública.
// As URLs públicas do Supabase têm o formato: .../storage/v1/object/public/<bucket>/<path>
export function pathFromPublicUrl(bucket, publicUrl) {
  if (!publicUrl) return null;
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

// Remove um arquivo do Storage. Falha silenciosa para não bloquear fluxos
// (orphans no Storage não são bonitos, mas não devem travar a UX).
export async function deleteFromStorage(bucket, publicUrl) {
  const path = pathFromPublicUrl(bucket, publicUrl);
  if (!path) return;
  try {
    await supabase.storage.from(bucket).remove([path]);
  } catch (err) {
    // Logado em dev; em prod o Supabase ainda terá o arquivo, mas não impacta o app.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[storage] falha ao remover arquivo', publicUrl, err);
    }
  }
}
