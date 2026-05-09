// Concatena classes de forma segura, ignorando falsy values.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Gera slug a partir de um título (remove acentos, espaços viram hífens).
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Parseia data como meia-noite local. Strings YYYY-MM-DD (coluna DATE do
// Postgres) precisam ser parseadas assim — senão `new Date('2026-05-16')`
// vira UTC e em Brasília (UTC-3) o toLocaleDateString mostra o dia anterior.
export function parseLocalDate(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Formata data ISO/Date para DD/MM/AAAA.
export function formatDate(value) {
  const date = parseLocalDate(value);
  if (!date) return '';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Formata horário HH:MM (aceita "HH:MM:SS" do Postgres TIME ou string já curta).
export function formatTime(value) {
  if (!value) return '';
  return String(value).slice(0, 5);
}

// Mapa categoria → rótulo legível.
export const CATEGORY_LABELS = {
  reuniao: 'Reunião',
  entretenimento: 'Entretenimento',
  filantropia: 'Filantropia',
  cerimonia: 'Cerimônia',
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS);

export function categoryLabel(slug) {
  return CATEGORY_LABELS[slug] ?? slug;
}
