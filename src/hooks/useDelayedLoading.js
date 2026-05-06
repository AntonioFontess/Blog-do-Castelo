import { useEffect, useState } from 'react';

// Só "ativa" o estado de loading se ele persistir além do delay.
// Evita o flash de skeleton quando o fetch responde rápido (<200ms),
// que é o caso comum quando o cache acerta ou a rede está boa.
export function useDelayedLoading(loading, delay = 200) {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!loading) {
      setDelayed(false);
      return undefined;
    }
    const id = setTimeout(() => setDelayed(true), delay);
    return () => clearTimeout(id);
  }, [loading, delay]);

  return delayed;
}
