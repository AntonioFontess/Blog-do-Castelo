import { useEffect, useRef, useState, useCallback } from 'react';
import { trapFocus } from '../../lib/focusTrap';

// Lightbox simples: backdrop preto, imagem central, navegação com setas (DOM ou teclado),
// contador, ESC pra fechar.
export function Lightbox({ images, startIndex = 0, onClose, captionFor }) {
  const [index, setIndex] = useState(startIndex);
  const containerRef = useRef(null);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Trava scroll do body enquanto aberto
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Focus trap (mantém Tab dentro do modal, devolve foco ao fechar)
  useEffect(() => {
    return trapFocus(containerRef.current, {
      initialFocusSelector: '[data-lightbox-close]',
    });
  }, []);

  if (!images?.length) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada da imagem"
    >
      {/* Backdrop click pra fechar */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6">
        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/90">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          data-lightbox-close
          onClick={onClose}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Fechar"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Imagem */}
      <div className="relative z-0 mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 sm:px-12">
        <img
          src={images[index]}
          alt={captionFor?.(index) ?? `Imagem ${index + 1}`}
          className="max-h-[85vh] max-w-full select-none rounded-lg object-contain shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Setas */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
