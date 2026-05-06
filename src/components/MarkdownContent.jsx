import { lazy, Suspense } from 'react';

// Renderer real fica num chunk separado; só carrega quando alguém de fato
// renderiza Markdown (PostDetail e MarkdownEditor preview).
const Renderer = lazy(() => import('./MarkdownRenderer'));

export function MarkdownContent({ children, className }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface-hover" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-hover" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-hover" />
        </div>
      }
    >
      <Renderer className={className}>{children}</Renderer>
    </Suspense>
  );
}
