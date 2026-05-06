import { Component } from 'react';

// Captura erros de render e mostra fallback amigável. React não tem hook
// equivalente — precisa ser class component.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-surface p-8 text-center shadow-2xl">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-300">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" />
            </svg>
          </div>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-fg">
            Algo deu errado
          </h1>
          <p className="mt-3 text-sm text-muted">
            Encontramos um problema inesperado ao carregar esta página. Tente recarregar
            ou voltar pra página inicial.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-primary-hover"
            >
              Recarregar página
            </button>
            <a
              href="/"
              className="rounded-lg border border-outline bg-transparent px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover"
            >
              Ir para o início
            </a>
          </div>
        </div>
      </div>
    );
  }
}
