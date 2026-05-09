import { supabase } from './supabase';
import { getCached, setCached, invalidateCache } from './cache';

// Hoje no formato YYYY-MM-DD (para comparação com a coluna DATE do Postgres).
// Usa horário local — `toISOString()` daria a data UTC, e em Brasília (UTC-3)
// das 21h às 23h59 isso já marcaria o dia seguinte, fazendo eventos do dia
// "saltarem" pra passado.
export function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Lista todos os eventos ordenados por data crescente.
export async function listEvents() {
  const cacheKey = 'events:list:all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  const result = data ?? [];
  setCached(cacheKey, result);
  return result;
}

// Lista apenas eventos futuros (data >= hoje), ordenados do mais próximo ao mais distante.
export async function listUpcomingEvents({ limit } = {}) {
  const cacheKey = `events:upcoming:${limit ?? 'all'}:${todayIso()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('events')
    .select('*')
    .gte('date', todayIso())
    .order('date', { ascending: true });
  if (typeof limit === 'number') query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  const result = data ?? [];
  setCached(cacheKey, result);
  return result;
}

// Lista eventos passados (data < hoje), do mais recente para o mais antigo.
export async function listPastEvents({ limit } = {}) {
  const cacheKey = `events:past:${limit ?? 'all'}:${todayIso()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('events')
    .select('*')
    .lt('date', todayIso())
    .order('date', { ascending: false });
  if (typeof limit === 'number') query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  const result = data ?? [];
  setCached(cacheKey, result);
  return result;
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  invalidateCache('events:');
  return data;
}

export async function updateEvent(id, event) {
  const { error } = await supabase.from('events').update(event).eq('id', id);
  if (error) throw error;
  invalidateCache('events:');
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  invalidateCache('events:');
}

// Helper de UI: classifica o evento em 'past' | 'today' | 'upcoming' a partir
// da data atual.
export function eventStatus(eventDate) {
  if (!eventDate) return 'upcoming';
  const today = todayIso();
  if (eventDate < today) return 'past';
  if (eventDate === today) return 'today';
  return 'upcoming';
}
