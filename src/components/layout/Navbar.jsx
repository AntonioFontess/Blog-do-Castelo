import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/blog', label: 'Blog' },
  { to: '/calendario', label: 'Calendário' },
  { to: '/contato', label: 'Contato' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-colors duration-300',
        scrolled
          ? 'border-b border-outline bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Castelo Hernani Vallim — início">
          <img
            src="/logo.png"
            alt="Brasão do Castelo Hernani Vallim Nº 123"
            className="h-10 w-10 rounded-md object-contain"
            loading="eager"
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-serif text-base font-semibold text-fg">
              Castelo Hernani Vallim
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
              Nº 123 — DeMolay
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted hover:text-fg'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px bg-primary transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/contato"
            className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
          >
            Quero Participar
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline text-fg hover:bg-surface-hover"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Drawer mobile */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-b border-outline bg-surface transition-[max-height,opacity] duration-300 ease-out',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container-wide flex flex-col py-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-3 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-surface-hover text-primary'
                    : 'text-fg hover:bg-surface-hover'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-background hover:bg-primary-hover"
          >
            Quero Participar
          </Link>
        </nav>
      </div>
    </header>
  );
}
