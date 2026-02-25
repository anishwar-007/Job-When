import { supabase } from '../lib/supabaseClient';

function mapRowToApp(row) {
  return {
    id: row.id,
    value: row.description,
    displayText: row.title || row.description,
    closed: row.status === 'closed',
  };
}

export async function getJobs() {
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) return { data: null, error };
  return { data: (data || []).map(mapRowToApp), error: null };
}

export async function createJob({ value, displayText = '', closed = false }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const title = (displayText || value || '').trim() || value;
  const description = (value || '').trim();
  if (!description) return { data: null, error: new Error('Job value is required') };

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: user.id,
      title,
      description,
      status: closed ? 'closed' : 'open',
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data: mapRowToApp(data), error: null };
}

export async function updateJob(id, { title, description, status }) {
  const updates = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;

  const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
  if (error) return { data: null, error };
  return { data: mapRowToApp(data), error: null };
}

export async function deleteJob(id) {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  return { error };
}
