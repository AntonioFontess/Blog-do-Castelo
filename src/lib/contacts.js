import { supabase } from './supabase';

// Lista mensagens. `filter`: 'all' (padrão) ou 'unread'.
export async function listContacts({ filter = 'all' } = {}) {
  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (filter === 'unread') {
    query = query.eq('read', false);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function setContactRead(id, read) {
  const { error } = await supabase.from('contacts').update({ read }).eq('id', id);
  if (error) throw error;
}

export async function markAllAsRead() {
  const { error } = await supabase.from('contacts').update({ read: true }).eq('read', false);
  if (error) throw error;
}

export async function deleteContact(id) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}

// Inserção pública (do formulário no /contato).
export async function createContact({ name, email, message }) {
  const payload = {
    name: name.trim(),
    email: email?.trim() || null,
    message: message.trim(),
  };
  const { error } = await supabase.from('contacts').insert(payload);
  if (error) throw error;
}
