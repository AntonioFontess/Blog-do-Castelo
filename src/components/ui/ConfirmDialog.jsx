import { useEffect, useRef } from 'react';
import { trapFocus } from '../../lib/focusTrap';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  // Fechar com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  // Focus trap quando aberto
  useEffect(() => {
    if (!open) return;
    return trapFocus(dialogRef.current, {
      // Foca o "Cancelar" inicialmente — é o caminho seguro/conservador
      initialFocusSelector: '[data-confirm-cancel]',
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md rounded-2xl border border-outline bg-surface p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="font-serif text-xl font-semibold text-fg">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-confirm-cancel
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-outline bg-transparent px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? 'inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60'
                : 'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-primary-hover disabled:opacity-60'
            }
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
