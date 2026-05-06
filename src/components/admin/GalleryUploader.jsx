import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { compressImageIfLarge, validateImageFiles } from '../../lib/images';
import { cn } from '../../lib/utils';

// Item: { kind: 'existing'|'new', id?, url|previewUrl, file? }

export function GalleryUploader({ existing, newFiles, removedExistingIds, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const toast = useToast();

  // Cria/limpa URLs de preview para novos arquivos.
  const newPreviews = useMemo(
    () => newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [newFiles]
  );
  useEffect(() => {
    return () => newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [newPreviews]);

  const visibleExisting = existing.filter(
    (e) => !removedExistingIds.includes(e.id)
  );

  const acceptFiles = async (raw) => {
    const { valid, errors } = validateImageFiles(raw);
    if (errors.length) toast.error(errors.join('\n'));
    if (!valid.length) return;
    setProcessing(true);
    try {
      const compressed = await Promise.all(valid.map((f) => compressImageIfLarge(f)));
      onChange({ newFiles: [...newFiles, ...compressed], removedExistingIds });
    } finally {
      setProcessing(false);
    }
  };

  const handlePick = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) acceptFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) acceptFiles(files);
  };

  const removeExisting = (id) => {
    onChange({ newFiles, removedExistingIds: [...removedExistingIds, id] });
  };
  const restoreExisting = (id) => {
    onChange({
      newFiles,
      removedExistingIds: removedExistingIds.filter((x) => x !== id),
    });
  };
  const removeNew = (file) => {
    onChange({ newFiles: newFiles.filter((f) => f !== file), removedExistingIds });
  };

  const totalCount = visibleExisting.length + newFiles.length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted">Galeria de imagens</span>
        <span className="text-xs text-muted">{totalCount} item(s)</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePick}
      />

      <button
        type="button"
        disabled={processing}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 text-center text-sm transition-colors disabled:opacity-60',
          dragOver
            ? 'border-primary bg-primary/5 text-fg'
            : 'border-outline bg-background text-muted hover:border-primary/40 hover:text-fg'
        )}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>{processing ? 'Otimizando imagens…' : 'Clique ou arraste imagens aqui'}</span>
        <span className="text-xs">JPG, PNG ou WebP — até 10 MB cada</span>
      </button>

      {(visibleExisting.length > 0 || newFiles.length > 0 || removedExistingIds.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-4">
          {/* Existentes (visíveis) */}
          {visibleExisting.map((item) => (
            <ImageThumb
              key={`ex-${item.id}`}
              src={item.image_url}
              onRemove={() => removeExisting(item.id)}
            />
          ))}

          {/* Existentes (marcadas pra remover) — fica turvo com botão "desfazer" */}
          {existing
            .filter((e) => removedExistingIds.includes(e.id))
            .map((item) => (
              <div
                key={`rm-${item.id}`}
                className="relative overflow-hidden rounded-lg border border-dashed border-outline opacity-50"
              >
                <img
                  src={item.image_url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-center">
                  <button
                    type="button"
                    onClick={() => restoreExisting(item.id)}
                    className="rounded-md bg-surface px-2 py-1 text-xs text-fg hover:bg-surface-hover"
                  >
                    Desfazer remoção
                  </button>
                </div>
              </div>
            ))}

          {/* Novas */}
          {newPreviews.map((p) => (
            <ImageThumb
              key={p.url}
              src={p.url}
              isNew
              onRemove={() => removeNew(p.file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageThumb({ src, onRemove, isNew = false }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-outline bg-background">
      <img src={src} alt="" className="aspect-square w-full object-cover" />
      {isNew && (
        <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
          Nova
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
        aria-label="Remover imagem"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
