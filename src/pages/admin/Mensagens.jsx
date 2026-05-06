import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useAdminState } from '../../context/AdminStateContext';
import {
  deleteContact,
  listContacts,
  markAllAsRead,
  setContactRead,
} from '../../lib/contacts';
import { cn } from '../../lib/utils';

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Mensagens() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const toast = useToast();
  const { refreshUnread } = useAdminState();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listContacts({ filter });
      setContacts(data);
    } catch (err) {
      setError('Não foi possível carregar as mensagens.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(
    () => contacts.filter((c) => !c.read).length,
    [contacts]
  );

  const handleToggleRead = async (contact) => {
    try {
      await setContactRead(contact.id, !contact.read);
      // Atualiza otimisticamente
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, read: !c.read } : c))
      );
      refreshUnread();
    } catch {
      toast.error('Não foi possível atualizar a mensagem.');
    }
  };

  const handleMarkAllRead = async () => {
    setBulkLoading(true);
    try {
      await markAllAsRead();
      toast.success('Todas as mensagens foram marcadas como lidas.');
      await load();
      refreshUnread();
    } catch {
      toast.error('Não foi possível marcar como lidas.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteContact(confirmTarget.id);
      toast.success('Mensagem excluída.');
      setConfirmTarget(null);
      await load();
      refreshUnread();
    } catch {
      toast.error('Erro ao excluir mensagem.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-fg">Mensagens</h1>
          <p className="mt-1 text-sm text-muted">
            Mensagens recebidas pelo formulário de contato.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={bulkLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-outline bg-surface px-3 py-2 text-xs font-medium text-fg hover:bg-surface-hover disabled:opacity-60"
          >
            {bulkLoading && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filtro */}
      <div className="mb-6 inline-flex rounded-lg border border-outline bg-surface p-0.5">
        <FilterChip
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Todas
        </FilterChip>
        <FilterChip
          active={filter === 'unread'}
          onClick={() => setFilter('unread')}
        >
          Não lidas {unreadCount > 0 && filter === 'unread' && `(${unreadCount})`}
        </FilterChip>
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
        <ul className="space-y-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="rounded-xl border border-outline bg-surface p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-hover" />
              <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-surface-hover" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-surface-hover" />
              </div>
            </li>
          ))}
        </ul>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline bg-surface p-10 text-center">
          <p className="font-serif text-xl text-fg">
            {filter === 'unread' ? 'Nenhuma mensagem não lida' : 'Nenhuma mensagem ainda'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {filter === 'unread'
              ? 'Tudo em dia! Volte aqui quando chegarem novas mensagens.'
              : 'Mensagens enviadas pelo formulário de contato aparecerão aqui.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <MessageCard
              key={c.id}
              contact={c}
              onToggleRead={() => handleToggleRead(c)}
              onDelete={() => setConfirmTarget(c)}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Excluir mensagem?"
        description={
          confirmTarget
            ? `A mensagem de "${confirmTarget.name}" será removida permanentemente.`
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

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-surface-hover text-fg'
          : 'text-muted hover:text-fg'
      )}
    >
      {children}
    </button>
  );
}

function MessageCard({ contact, onToggleRead, onDelete }) {
  return (
    <li
      className={cn(
        'relative overflow-hidden rounded-xl border bg-surface p-5 transition-colors',
        contact.read
          ? 'border-outline'
          : 'border-primary/40 ring-1 ring-primary/20'
      )}
    >
      {!contact.read && (
        <span
          aria-label="Não lida"
          className="absolute left-0 top-0 h-full w-1 bg-primary"
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg font-semibold text-fg">{contact.name}</p>
            {!contact.read && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Nova
              </span>
            )}
          </div>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-muted hover:text-primary"
            >
              {contact.email}
            </a>
          )}
        </div>
        <span className="text-xs text-muted">{formatDateTime(contact.created_at)}</span>
      </div>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-fg/85">
        {contact.message}
      </p>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onToggleRead}
          className="rounded-md border border-outline px-3 py-1.5 text-xs font-medium text-fg hover:bg-surface-hover"
        >
          {contact.read ? 'Marcar como não lida' : 'Marcar como lida'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
