import { useEffect, useState } from 'react';
import { listPosts } from '../../lib/posts';
import { PostCard } from '../../components/blog/PostCard';
import { CATEGORIES, categoryLabel, cn } from '../../lib/utils';
import { useDocumentMeta } from '../../lib/seo';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const PAGE_SIZE = 9;

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('todas');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  useDocumentMeta({
    title: 'Blog',
    description:
      'Reuniões, cerimônias, ações filantrópicas e atividades do Castelo Hernani Vallim Nº 123. Acompanhe os momentos marcantes do nosso castelo.',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { posts: fetched, total } = await listPosts({
          category: category === 'todas' ? null : category,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
          publishedOnly: true,
        });
        if (cancelled) return;
        setPosts((prev) => (page === 0 ? fetched : [...prev, ...fetched]));
        setTotal(total);
      } catch (err) {
        if (!cancelled) setError('Não foi possível carregar os posts.');
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category, page]);

  const handleCategoryChange = (cat) => {
    if (cat === category) return;
    setCategory(cat);
    setPage(0);
    // Os posts antigos são mantidos com fade até a nova lista chegar — evita flicker.
  };

  const hasMore = posts.length < total;
  const isFiltering = !initialLoad && loading;
  // Só mostra skeleton se a carga inicial demorar mais de 200ms
  // (cache hit ou rede rápida = sem flicker).
  const showInitialSkeleton = useDelayedLoading(initialLoad && loading);

  return (
    <section className="container-wide py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Blog</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-fg sm:text-5xl">
          Atividades do Castelo
        </h1>
        <p className="mt-4 text-muted">
          Reuniões, cerimônias, ações sociais e atividades recreativas — registramos aqui
          os momentos marcantes do Castelo Hernani Vallim.
        </p>
      </header>

      {/* Filtros */}
      <div className="mb-10 flex flex-wrap gap-2">
        <CategoryChip
          active={category === 'todas'}
          onClick={() => handleCategoryChange('todas')}
        >
          Todas
        </CategoryChip>
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c}
            active={category === c}
            onClick={() => handleCategoryChange(c)}
          >
            {categoryLabel(c)}
          </CategoryChip>
        ))}
      </div>

      {/* Conteúdo */}
      {error ? (
        <ErrorState onRetry={() => setPage((p) => p)} />
      ) : initialLoad && loading ? (
        showInitialSkeleton ? <SkeletonGrid /> : null
      ) : posts.length === 0 ? (
        <EmptyState category={category} />
      ) : (
        <div
          className={cn(
            'transition-opacity duration-200',
            isFiltering && 'opacity-50 pointer-events-none'
          )}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-outline bg-surface px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface-hover disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Carregando…
                  </>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CategoryChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary/15 text-primary'
          : 'border-outline bg-surface text-muted hover:border-primary/40 hover:text-fg'
      )}
    >
      {children}
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-outline bg-surface"
        >
          <div className="aspect-[16/10] animate-pulse bg-surface-hover" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ category }) {
  return (
    <div className="rounded-xl border border-dashed border-outline bg-surface p-12 text-center">
      <p className="font-serif text-2xl text-fg">
        {category === 'todas'
          ? 'Nenhuma atividade publicada ainda'
          : `Nenhuma atividade na categoria "${categoryLabel(category)}"`}
      </p>
      <p className="mt-2 text-sm text-muted">
        {category === 'todas'
          ? 'As atividades publicadas pelo painel administrativo aparecerão aqui.'
          : 'Tente outra categoria ou volte mais tarde.'}
      </p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-8 text-center">
      <p className="text-red-200">Não foi possível carregar os posts.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex rounded-lg border border-red-300/40 px-4 py-2 text-sm text-red-100 hover:bg-red-500/20"
      >
        Tentar novamente
      </button>
    </div>
  );
}
