import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocumentMeta } from '../../lib/seo';

export function Login() {
  useDocumentMeta({ title: 'Login do Admin' });
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      const dest = location.state?.from || '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      // Mensagens do Supabase variam; normalizamos para algo compreensível.
      const msg = String(err?.message ?? '').toLowerCase();
      if (msg.includes('invalid') || msg.includes('credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (msg.includes('confirm')) {
        setError('Conta ainda não confirmada. Confirme o e-mail ou peça pra um admin marcar como confirmado.');
      } else {
        setError('Não foi possível entrar. Tente novamente em instantes.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-secondary/20 via-transparent to-transparent blur-3xl" />

      <Link to="/" className="mb-8 flex items-center gap-3">
        <img src="/logo.png" alt="" className="h-12 w-12 object-contain" />
        <div className="leading-tight">
          <p className="font-serif text-lg font-semibold text-fg">Castelo Hernani Vallim</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Admin · Nº 123</p>
        </div>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-outline bg-surface p-7 shadow-2xl"
      >
        <h1 className="font-serif text-2xl font-semibold text-fg">Acesso restrito</h1>
        <p className="mt-1 text-sm text-muted">
          Entre com o e-mail e a senha cadastrados no painel.
        </p>

        <label className="mt-6 block">
          <span className="text-sm text-muted">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="voce@exemplo.com"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm text-muted">Senha</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </button>

        <p className="mt-6 text-center text-xs text-muted">
          <Link to="/" className="hover:text-primary">
            ← Voltar para o site
          </Link>
        </p>
      </form>
    </div>
  );
}
