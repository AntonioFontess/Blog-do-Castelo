import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { createContact } from '../../lib/contacts';
import { useDocumentMeta } from '../../lib/seo';
import {
  ADDRESS,
  INSTAGRAM_LINK,
  MAPS_EMBED_URL,
  MAPS_SEARCH_URL,
  WHATSAPP_LINK,
} from '../../lib/constants';

export function Contato() {
  useDocumentMeta({
    title: 'Contato',
    description:
      'Entre em contato com o Castelo Hernani Vallim Nº 123 — WhatsApp, Instagram, formulário e endereço da sede em Cornélio Procópio.',
  });

  return (
    <section className="container-narrow py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Contato</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-fg sm:text-5xl">
          Vamos conversar
        </h1>
        <p className="mt-4 text-muted">
          Se você tem entre 7 e 11 anos completos (ou é responsável por uma criança nessa
          idade) e quer conhecer o Castelo Hernani Vallim n°123, escolha o canal que preferir abaixo.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-outline bg-surface p-6 transition-colors hover:border-primary/40 hover:bg-surface-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M20.5 3.5A11.6 11.6 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.4zm-8.5 18.3c-1.7 0-3.4-.5-4.9-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 1 1 18.1-4.9 9.8 9.8 0 0 1-9.9 9.5zm5.5-7.3c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.5.1c-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4s-.9.9-.9 2.2.9 2.6 1 2.7c.1.2 1.8 2.7 4.4 3.8 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-semibold text-fg">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted">
            Resposta rápida pelo nosso canal direto.
          </p>
          <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
            Abrir conversa →
          </p>
        </a>

        <a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-outline bg-surface p-6 transition-colors hover:border-primary/40 hover:bg-surface-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-semibold text-fg">Instagram</h2>
          <p className="mt-2 text-sm text-muted">Acompanhe nossas atividades em tempo real.</p>
          <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
            @hernani_vallim →
          </p>
        </a>
      </div>

      {/* Onde nos encontrar — endereço + mapa */}
      <div className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">
            Onde nos encontrar
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-fg sm:text-4xl">
            Nossa sede
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            As reuniões acontecem na sede da Loja Maçônica anfitriã, no centro de
            Cornélio Procópio.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 md:items-stretch">
          <div className="flex flex-col rounded-xl border border-outline bg-surface p-6 sm:p-7">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" />
                <circle cx="12" cy="9" r="3" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-fg">{ADDRESS.loja}</h3>
            <address className="mt-3 space-y-1 text-[15px] not-italic leading-relaxed text-fg/85">
              <p>{ADDRESS.street}</p>
              <p>
                {ADDRESS.district} — {ADDRESS.city} - {ADDRESS.state}
              </p>
            </address>

            <div className="mt-auto pt-6">
              <a
                href={MAPS_SEARCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
              >
                Ver no Google Maps
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-outline bg-surface">
            <iframe
              title="Localização do Castelo Hernani Vallim — Loja Cavaleiro de Malta nº 7"
              src={MAPS_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-full min-h-[320px] w-full border-0"
            />
          </div>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await createContact({ name, email, message });
      setSent(true);
    } catch (err) {
      setError(
        'Não foi possível enviar a mensagem agora. Tente o WhatsApp logo acima ou volte em instantes.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSent(false);
    setError(null);
  };

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-emerald-500/30 bg-surface p-10 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-fg">Mensagem enviada!</h2>
        <p className="mt-2 text-sm text-muted">
          Recebemos a sua mensagem e em breve um responsável pelo Castelo entra em
          contato.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-lg border border-outline bg-transparent px-4 py-2 text-sm text-fg hover:bg-surface-hover"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-16 max-w-3xl rounded-2xl border border-outline bg-surface p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl font-semibold text-fg">Ou envie uma mensagem</h2>
      <p className="mt-1 text-sm text-muted">
        Preencha e a gente retorna assim que possível.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-muted">Nome</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Seu nome completo"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">
            E-mail <span className="text-xs text-muted/70">(opcional)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="voce@exemplo.com"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-muted">Mensagem</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full resize-y rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Como podemos te ajudar?"
        />
      </label>

      {error && (
        <div role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Enviando…
            </>
          ) : (
            'Enviar mensagem'
          )}
        </Button>
      </div>
    </form>
  );
}
