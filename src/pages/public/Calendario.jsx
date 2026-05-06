import { useEffect, useState } from 'react';
import { EventCard } from '../../components/calendar/EventCard';
import { listPastEvents, listUpcomingEvents } from '../../lib/events';
import { useDocumentMeta } from '../../lib/seo';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

export function Calendario() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showSkeleton = useDelayedLoading(loading);

  useDocumentMeta({
    title: 'Calendário',
    description:
      'Próximos eventos, reuniões e cerimônias do Castelo Hernani Vallim Nº 123 em Cornélio Procópio-PR.',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [up, pa] = await Promise.all([
          listUpcomingEvents(),
          listPastEvents({ limit: 20 }),
        ]);
        if (cancelled) return;
        setUpcoming(up);
        setPast(pa);
      } catch (err) {
        if (!cancelled) setError('Não foi possível carregar o calendário.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-narrow py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Calendário</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-fg sm:text-5xl">
          Próximos eventos
        </h1>
        <p className="mt-4 text-muted">
          Reuniões, cerimônias, ações filantrópicas e atividades especiais. Listamos aqui
          tudo que está por vir no Castelo.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
          {error}
        </div>
      ) : loading && !showSkeleton ? null : loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-stretch gap-4 rounded-xl border border-outline bg-surface p-5"
            >
              <div className="h-16 w-16 animate-pulse rounded-lg bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
              </div>
            </div>
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline bg-surface p-12 text-center">
          <p className="font-serif text-2xl text-fg">Nenhum evento agendado</p>
          <p className="mt-2 text-sm text-muted">
            Estamos preparando os próximos. Acompanhe nossas redes pra saber primeiro.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Eventos passados — colapsável, fechado por padrão */}
      {!loading && past.length > 0 && (
        <details className="mt-16 group rounded-2xl border border-outline bg-surface">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 font-serif text-lg font-semibold text-fg transition-colors hover:bg-surface-hover">
            <span className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-muted transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
              Eventos passados
            </span>
            <span className="text-xs font-medium text-muted">{past.length}</span>
          </summary>
          <div className="grid gap-3 border-t border-outline p-4 md:grid-cols-2 md:p-6">
            {past.map((event) => (
              <div key={event.id} className="opacity-70">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
