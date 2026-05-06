import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { listPosts, deletePost } from '../../lib/posts';
import { categoryLabel, formatDate } from '../../lib/utils';

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // post a deletar
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts } = await listPosts();
      setPosts(posts);
    } catch (err) {
      setError('Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deletePost(confirmTarget.id);
      toast.success(`Post "${confirmTarget.title}" excluído.`);
      setConfirmTarget(null);
      await load();
    } catch (err) {
      toast.error('Erro ao excluir o post. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-fg">Posts</h1>
          <p className="mt-1 text-sm text-muted">
            Gerencie as atividades publicadas no blog.
          </p>
        </div>
        <Link
          to="/admin/posts/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo post
        </Link>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}{' '}
          <button onClick={load} className="ml-2 underline hover:text-red-100">
            Tentar de novo
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-outline bg-surface">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-outline p-4 last:border-b-0">
              <div className="h-10 w-16 animate-pulse rounded bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-surface-hover" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline bg-surface p-10 text-center">
          <p className="font-serif text-xl text-fg">Nenhum post ainda</p>
          <p className="mt-1 text-sm text-muted">
            Crie o primeiro clicando em "Novo post" acima.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-outline bg-surface md:block">
            <table className="w-full">
              <thead className="border-b border-outline bg-background/40">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">Capa</th>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-outline last:border-b-0 hover:bg-surface-hover/50">
                    <td className="px-4 py-3">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          className="h-10 w-16 rounded object-cover object-top"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded bg-surface-hover" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-fg">{p.title}</td>
                    <td className="px-4 py-3">
                      <Badge>{categoryLabel(p.category)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      {p.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link
                          to={`/admin/posts/editar/${p.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-fg"
                          aria-label="Editar"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmTarget(p)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-red-500/15 hover:text-red-300"
                          aria-label="Excluir"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="grid gap-3 md:hidden">
            {posts.map((p) => (
              <li key={p.id} className="rounded-xl border border-outline bg-surface p-4">
                <div className="flex items-start gap-3">
                  {p.cover_image ? (
                    <img
                      src={p.cover_image}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded object-cover object-top"
                    />
                  ) : (
                    <div className="h-14 w-20 shrink-0 rounded bg-surface-hover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-fg">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDate(p.created_at)} · {categoryLabel(p.category)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Link
                    to={`/admin/posts/editar/${p.id}`}
                    className="rounded-md border border-outline px-3 py-1.5 text-xs text-fg hover:bg-surface-hover"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmTarget(p)}
                    className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Excluir post?"
        description={
          confirmTarget
            ? `O post "${confirmTarget.title}" será removido junto com a capa e a galeria. Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
        destructive
        loading={deleting}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
