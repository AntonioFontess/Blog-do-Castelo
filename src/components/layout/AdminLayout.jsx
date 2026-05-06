import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminStateProvider, useAdminState } from '../../context/AdminStateContext';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Dashboard',
    end: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
  },
  {
    to: '/admin/posts',
    label: 'Posts',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
  },
  {
    to: '/admin/eventos',
    label: 'Eventos',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    to: '/admin/mensagens',
    label: 'Mensagens',
    icon: (
      <>
        <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
];

export function AdminLayout() {
  return (
    <AdminStateProvider>
      <AdminLayoutInner />
    </AdminStateProvider>
  );
}

function AdminLayoutInner() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background text-fg">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-outline lg:bg-surface">
        <SidebarContent onSignOut={handleSignOut} userEmail={user?.email} />
      </aside>

      {/* Drawer (mobile) */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity',
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            'absolute left-0 top-0 flex h-full w-72 flex-col border-r border-outline bg-surface transition-transform',
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SidebarContent
            onSignOut={handleSignOut}
            userEmail={user?.email}
            onNavigate={() => setDrawerOpen(false)}
          />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-outline bg-background/85 px-4 backdrop-blur">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline text-fg hover:bg-surface-hover lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <p className="font-serif text-base font-semibold">Painel Administrativo</p>
          <div className="ml-auto hidden items-center gap-2 text-xs text-muted sm:flex">
            <span>{user?.email}</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onSignOut, userEmail, onNavigate }) {
  const { unreadCount } = useAdminState();

  return (
    <>
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 border-b border-outline px-5 py-4">
        <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
        <div className="leading-tight">
          <p className="font-serif text-sm font-semibold">Castelo Hernani Vallim</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Admin · Nº 123</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const showBadge = item.to === '/admin/mensagens' && unreadCount > 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted hover:bg-surface-hover hover:text-fg'
                )
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span
                  aria-label={`${unreadCount} não lidas`}
                  className="inline-flex min-w-[1.25rem] justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-background"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-outline p-3">
        <div className="mb-2 px-3 py-1 text-[11px] text-muted truncate" title={userEmail}>
          {userEmail}
        </div>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-fg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12 12 4l9 8" />
            <path d="M5 10v10h14V10" />
          </svg>
          Ver site público
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-fg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
          Sair
        </button>
      </div>
    </>
  );
}
