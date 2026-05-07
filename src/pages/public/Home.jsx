import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PostCard } from '../../components/blog/PostCard';
import { EventCard } from '../../components/calendar/EventCard';
import { listPosts } from '../../lib/posts';
import { listUpcomingEvents } from '../../lib/events';
import { useDocumentMeta } from '../../lib/seo';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const PILLARS = [
  {
    title: 'Liderança',
    desc: 'Preparamos crianças e pré-adolescentes para liderar com integridade dentro e fora do Castelo.',
    icon: (
      <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
    ),
  },
  {
    title: 'Fraternidade',
    desc: 'Amizades verdadeiras que duram a vida toda, em um ambiente seguro e acolhedor.',
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3.5 4-3.5s4 1.5 4 3.5" />
      </>
    ),
  },
  {
    title: 'Filantropia',
    desc: 'Atuamos na comunidade com ações sociais, doações e projetos de impacto local.',
    icon: <path d="M12 21s-7-4.5-9-9.5C1.5 7 5 4 8 5.5c1.6.8 3 2.5 4 4 1-1.5 2.4-3.2 4-4 3-1.5 6.5 1.5 5 6-2 5-9 9.5-9 9.5z" />,
  },
  {
    title: 'Cidadania',
    desc: 'Formamos cidadãos conscientes, com valores sólidos e compromisso com a sociedade.',
    icon: (
      <>
        <path d="M3 21h18M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
  },
];

export function Home() {
  useDocumentMeta({
    title: 'Início',
    description:
      'Castelo Hernani Vallim Nº 123 — Castelo de Escudeiros da Ordem DeMolay em Cornélio Procópio-PR. Conheça nossas atividades, eventos e como fazer parte.',
  });

  const [recentPosts, setRecentPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const showPostsSkeleton = useDelayedLoading(postsLoading);
  const showEventsSkeleton = useDelayedLoading(eventsLoading);

  useEffect(() => {
    let cancelled = false;
    listPosts({ limit: 3, publishedOnly: true })
      .then(({ posts }) => {
        if (!cancelled) {
          setRecentPosts(posts);
          setPostsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecentPosts([]);
          setPostsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    listUpcomingEvents({ limit: 3 })
      .then((events) => {
        if (!cancelled) {
          setUpcomingEvents(events);
          setEventsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUpcomingEvents([]);
          setEventsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow decorativo de fundo */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container-wide grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-in">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-outline bg-surface px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Cornélio Procópio · Paraná
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-fg sm:text-6xl">
              Castelo <span className="text-primary">Hernani Vallim</span>
              <span className="block text-3xl text-muted sm:text-4xl">Nº 123 · Ordem DeMolay</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Um espaço de liderança, fraternidade e propósito para crianças e
              pré-adolescentes de 7 a 11 anos completos. Construímos amizades, valores e
              memórias que duram a vida toda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contato" size="lg">
                Quero Participar
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Button>
              <Button to="/sobre" variant="outline" size="lg">
                Conhecer mais
              </Button>
            </div>
          </div>

          {/* Visual: logo + placeholder do mascote */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-secondary/40 via-transparent to-primary/20 blur-2xl" />
            <div className="relative flex flex-col items-center">
              <img
                src="/logo.png"
                alt="Brasão do Castelo Hernani Vallim Nº 123"
                className="h-64 w-64 object-contain drop-shadow-[0_8px_30px_rgba(201,162,39,0.25)] sm:h-80 sm:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* O que é o Castelo? */}
      <section className="container-wide py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-semibold text-fg">
            O que é o <span className="text-primary">Castelo</span>?
          </h2>
          <p className="mt-4 text-lg text-muted">
            O Castelo de Escudeiros é a porta de entrada da Ordem DeMolay para crianças e
            pré-adolescentes de 7 a 11 anos completos. Nele, você encontra reuniões,
            atividades, ações sociais e cerimônias que constroem caráter, amizade e liderança 
            em um ambiente seguro, alegre e fraternal.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-outline bg-surface p-6 transition-colors hover:border-primary/30 hover:bg-surface-hover"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {p.icon}
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-fg">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Atividades recentes — só aparece se houver posts publicados */}
      {(postsLoading || recentPosts.length > 0) && (
        <section className="container-wide py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Blog</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-fg sm:text-4xl">
                Atividades recentes
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden text-sm font-medium text-muted hover:text-primary sm:inline-flex"
            >
              Ver todas →
            </Link>
          </div>

          {postsLoading && showPostsSkeleton ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-outline bg-surface"
                >
                  <div className="aspect-[16/10] animate-pulse bg-surface-hover" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
                  </div>
                </div>
              ))}
            </div>
          ) : !postsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          {!postsLoading && recentPosts.length > 0 && (
            <div className="mt-6 sm:hidden">
              <Link to="/blog" className="text-sm font-medium text-primary">
                Ver todas as atividades →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Próximos eventos — só aparece se houver eventos futuros */}
      {(eventsLoading || upcomingEvents.length > 0) && (
        <section className="container-wide py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Calendário</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-fg sm:text-4xl">
                Próximos eventos
              </h2>
            </div>
            <Link
              to="/calendario"
              className="hidden text-sm font-medium text-muted hover:text-primary sm:inline-flex"
            >
              Ver calendário completo →
            </Link>
          </div>

          {eventsLoading && showEventsSkeleton ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-stretch gap-4 rounded-xl border border-outline bg-surface p-5"
                >
                  <div className="h-16 w-16 animate-pulse rounded-lg bg-surface-hover" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
                  </div>
                </div>
              ))}
            </div>
          ) : !eventsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : null}
        </section>
      )}

      {/* CTA final */}
      <section className="container-wide py-20">
        <div className="relative overflow-hidden rounded-2xl border border-outline bg-gradient-to-br from-secondary/30 via-surface to-background p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_60%_at_50%_0%,rgba(201,162,39,0.18),transparent_70%)]" />
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Junte-se a nós</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-fg sm:text-5xl">
            Quer fazer parte?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Se você tem entre 7 e 11 anos completos (ou é responsável por uma criança
            nessa idade) e quer conhecer um Castelo de Escudeiros, fale com a gente. Será
            um prazer te receber em uma de nossas reuniões.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/contato" size="lg">
              Entrar em contato
            </Button>
            <Button to="/sobre" variant="outline" size="lg">
              Saber mais sobre o Castelo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
