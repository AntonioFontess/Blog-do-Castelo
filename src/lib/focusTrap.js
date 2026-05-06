// Focus trap mínimo e dependency-free para uso em modais (Lightbox, ConfirmDialog).
// Mantém Tab/Shift+Tab dentro do container e devolve o foco ao elemento anterior
// quando o trap é desligado.

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function trapFocus(container, { initialFocusSelector } = {}) {
  if (!container) return () => {};
  const previouslyFocused =
    typeof document !== 'undefined' ? document.activeElement : null;

  const focusables = () =>
    Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null
    );

  const focusFirst = () => {
    const list = focusables();
    if (!list.length) return;
    if (initialFocusSelector) {
      const initial = container.querySelector(initialFocusSelector);
      if (initial) {
        initial.focus();
        return;
      }
    }
    list[0].focus();
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const list = focusables();
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKeyDown);
  // Foca o primeiro elemento ou o seletor inicial após o paint.
  requestAnimationFrame(focusFirst);

  return () => {
    container.removeEventListener('keydown', onKeyDown);
    if (
      previouslyFocused &&
      typeof previouslyFocused.focus === 'function' &&
      document.contains(previouslyFocused)
    ) {
      previouslyFocused.focus();
    }
  };
}
