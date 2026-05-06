import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { createEvent, getEventById, updateEvent } from '../../lib/events';

const EMPTY_FORM = {
  name: '',
  date: '',
  time: '',
  description: '',
};

export function EventForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const ev = await getEventById(id);
        if (cancelled) return;
        if (!ev) {
          setLoadError('Evento não encontrado.');
          return;
        }
        setForm({
          name: ev.name,
          date: ev.date,
          time: ev.time ? ev.time.slice(0, 5) : '',
          description: ev.description ?? '',
        });
      } catch (err) {
        if (!cancelled) setLoadError('Erro ao carregar o evento.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const isValid = form.name.trim() && form.date;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        date: form.date,
        time: form.time ? form.time : null,
        description: form.description.trim() || null,
      };
      if (isEdit) {
        await updateEvent(id, payload);
        toast.success('Evento atualizado.');
      } else {
        await createEvent(payload);
        toast.success('Evento criado.');
      }
      navigate('/admin/eventos');
    } catch (err) {
      toast.error('Erro ao salvar o evento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-8 w-1/3 animate-pulse rounded bg-surface-hover" />
        <div className="mt-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-surface-hover" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
        {loadError}
        <div className="mt-4">
          <Link to="/admin/eventos" className="text-sm underline hover:text-red-100">
            ← Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/eventos"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
          >
            ← Voltar
          </Link>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-fg">
            {isEdit ? 'Editar evento' : 'Novo evento'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/eventos"
            className="rounded-lg border border-outline bg-transparent px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-hover"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {isEdit ? 'Salvar alterações' : 'Criar evento'}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-outline bg-surface p-6 sm:p-8">
        <label className="block">
          <span className="text-sm text-muted">Nome do evento</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Reunião Ordinária"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-muted">Data</span>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">
              Horário <span className="text-xs text-muted/70">(opcional)</span>
            </span>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-muted">
            Descrição <span className="text-xs text-muted/70">(opcional)</span>
          </span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-1 w-full resize-y rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Detalhes do evento, local, instruções, etc."
          />
        </label>
      </div>
    </form>
  );
}
