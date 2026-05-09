import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { todayIso } from '../../lib/events';

function StatCard({ label, value, hint, loading, accent = 'primary' }) {
  const accentClass = accent === 'primary' ? 'text-primary' : 'text-secondary';
  return (
    <div className="rounded-xl border border-outline bg-surface p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className={`mt-3 font-serif text-4xl font-semibold ${accentClass}`}>
        {loading ? '—' : value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Dashboard() {
  const [counts, setCounts] = useState({ posts: 0, events: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const today = todayIso();

      // allSettled garante que se uma query falhar, as outras ainda mostram valor.
      const [postsRes, eventsRes, contactsRes] = await Promise.allSettled([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('date', today),
        supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('read', false),
      ]);
      if (cancelled) return;

      const pickCount = (res) =>
        res.status === 'fulfilled' && !res.value.error ? res.value.count ?? 0 : null;

      const next = {
        posts: pickCount(postsRes),
        events: pickCount(eventsRes),
        unread: pickCount(contactsRes),
      };
      const anyFailed = Object.values(next).some((v) => v === null);

      setCounts({
        posts: next.posts ?? 0,
        events: next.events ?? 0,
        unread: next.unread ?? 0,
      });
      if (anyFailed) {
        setError('Alguns contadores não puderam ser carregados. O resto está atualizado.');
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-fg">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Visão geral do conteúdo e das mensagens recebidas.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Posts publicados" value={counts.posts} loading={loading} />
        <StatCard
          label="Eventos futuros"
          value={counts.events}
          hint="Eventos com data ≥ hoje"
          loading={loading}
        />
        <StatCard
          label="Mensagens não lidas"
          value={counts.unread}
          loading={loading}
          accent="secondary"
        />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-fg">Ações rápidas</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/posts/novo"
            className="group flex items-start gap-4 rounded-xl border border-outline bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-hover"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-fg">Novo post</p>
              <p className="mt-1 text-sm text-muted">
                Cadastre uma nova atividade no blog.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/eventos/novo"
            className="group flex items-start gap-4 rounded-xl border border-outline bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-hover"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-fg">Novo evento</p>
              <p className="mt-1 text-sm text-muted">
                Adicione um evento ao calendário.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
