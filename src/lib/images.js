// Validação e compressão de imagens client-side. Reduz arquivos grandes pra
// upload mais rápido e armazenamento mais barato — sem perda visível.

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DIMENSION = 1920; // lado maior em px
const JPEG_QUALITY = 0.82;
// Não compactamos imagens menores que isso; já estão "ok".
const COMPRESSION_THRESHOLD_BYTES = 200 * 1024;

const ACCEPTED_PREFIX = 'image/';

export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'Arquivo inválido.' };
  if (!file.type?.startsWith(ACCEPTED_PREFIX)) {
    return { ok: false, error: 'Apenas imagens (JPG, PNG, WebP) são aceitas.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      error: `Imagem muito grande (${mb} MB). O máximo é 10 MB.`,
    };
  }
  return { ok: true };
}

// Filtra uma lista de arquivos: retorna { valid, errors } onde errors é uma
// lista de mensagens (uma por arquivo rejeitado).
export function validateImageFiles(files) {
  const valid = [];
  const errors = [];
  for (const file of files) {
    const v = validateImageFile(file);
    if (v.ok) valid.push(file);
    else errors.push(`${file.name}: ${v.error}`);
  }
  return { valid, errors };
}

// Lê o arquivo como dataURL (Promise).
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}

// Carrega uma dataURL como HTMLImageElement (Promise).
function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao decodificar imagem.'));
    img.src = dataUrl;
  });
}

// Comprime uma imagem se for grande. Retorna o arquivo original quando:
// - não é imagem
// - já é pequena (< 200KB)
// - a saída comprimida ficaria maior (caso raro)
// - a compressão falhar
export async function compressImageIfLarge(file) {
  try {
    if (!file?.type?.startsWith(ACCEPTED_PREFIX)) return file;
    if (file.size < COMPRESSION_THRESHOLD_BYTES) return file;

    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);

    const { width, height } = img;
    const longest = Math.max(width, height);
    const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    // Em caso de qualquer erro na compressão, sobe o arquivo original.
    return file;
  }
}
