import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Aviso amigável durante desenvolvimento; em produção a app ainda renderiza,
  // só falhará nas chamadas a Supabase (Fase 2+).
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos. ' +
      'Verifique o arquivo .env.local.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
