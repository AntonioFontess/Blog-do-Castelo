// Cache em memória, scope da aba. Some quando o usuário recarrega a página.
// Usado pra evitar refetch desnecessário em navegação rápida entre abas.

const DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutos

const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expires: Date.now() + ttlMs });
}

// Invalida todas as entradas cuja chave começa com o prefixo.
// Sem prefixo, limpa tudo.
export function invalidateCache(prefix) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
