import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Estado leve compartilhado entre as páginas do admin (sidebar, badges, etc).
// Por enquanto guarda só o contador de mensagens não lidas — mas é o ponto
// de extensão natural pra outros KPIs do admin.

const AdminStateContext = createContext({ unreadCount: 0, refreshUnread: () => {} });

export function AdminStateProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);
      if (!error) setUnreadCount(count ?? 0);
    } catch {
      // Falha silenciosa: badge zerado é melhor que crash da sidebar.
    }
  }, []);

  useEffect(() => {
    refreshUnread();
    // Polling discreto a cada 60s pra pegar mensagens novas enquanto admin
    // está em outra tela.
    const id = setInterval(refreshUnread, 60_000);
    return () => clearInterval(id);
  }, [refreshUnread]);

  return (
    <AdminStateContext.Provider value={{ unreadCount, refreshUnread }}>
      {children}
    </AdminStateContext.Provider>
  );
}

export function useAdminState() {
  return useContext(AdminStateContext);
}
