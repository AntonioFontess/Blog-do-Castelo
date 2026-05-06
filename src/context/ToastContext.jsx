import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../lib/utils';

const ToastContext = createContext(null);

let toastIdSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const id = ++toastIdSeq;
      const toast = {
        id,
        message,
        type: options.type ?? 'info', // 'info' | 'success' | 'error'
        duration: options.duration ?? 3500,
      };
      setToasts((current) => [...current, toast]);
      setTimeout(() => removeToast(id), toast.duration);
      return id;
    },
    [removeToast]
  );

  const value = {
    showToast,
    success: (msg, opts) => showToast(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => showToast(msg, { ...opts, type: 'error' }),
    info: (msg, opts) => showToast(msg, { ...opts, type: 'info' }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface p-3 shadow-xl backdrop-blur',
            toast.type === 'success' && 'border-emerald-500/40',
            toast.type === 'error' && 'border-red-500/40',
            toast.type === 'info' && 'border-outline'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs',
              toast.type === 'success' && 'bg-emerald-500/20 text-emerald-300',
              toast.type === 'error' && 'bg-red-500/20 text-red-300',
              toast.type === 'info' && 'bg-primary/20 text-primary'
            )}
          >
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
          </span>
          <p className="flex-1 text-sm text-fg">{toast.message}</p>
          <button
            type="button"
            onClick={() => onClose(toast.id)}
            className="text-muted hover:text-fg"
            aria-label="Fechar notificação"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
