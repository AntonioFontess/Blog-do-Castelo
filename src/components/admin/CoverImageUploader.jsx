import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { compressImageIfLarge, validateImageFile } from '../../lib/images';

export function CoverImageUploader({ existingUrl, file, onFileChange }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(existingUrl ?? null);
  const [processing, setProcessing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl);
    }
    setPreviewUrl(existingUrl ?? null);
  }, [file, existingUrl]);

  const acceptFile = async (raw) => {
    const v = validateImageFile(raw);
    if (!v.ok) {
      toast.error(v.error);
      return;
    }
    setProcessing(true);
    try {
      const compressed = await compressImageIfLarge(raw);
      onFileChange(compressed);
    } finally {
      setProcessing(false);
    }
  };

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
    e.target.value = ''; // permite escolher o mesmo arquivo de novo
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  };

  const handleClear = () => {
    onFileChange(null);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted">Imagem de capa</span>
        {previewUrl && (
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary hover:underline"
            >
              Trocar
            </button>
            <span className="text-muted">·</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-300 hover:underline"
            >
              Remover
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePick}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-outline bg-background">
          <img
            src={previewUrl}
            alt="Pré-visualização da capa"
            className="aspect-[16/10] w-full object-cover object-top"
          />
          {processing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-fg">
              Otimizando imagem…
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline bg-background py-12 text-center text-sm text-muted transition-colors hover:border-primary/40 hover:text-fg disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span>Clique ou arraste uma imagem</span>
          <span className="text-xs">JPG, PNG ou WebP</span>
        </button>
      )}
    </div>
  );
}
