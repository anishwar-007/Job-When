import { supabase } from '../lib/supabaseClient';

function mapRowToApp(row) {
  const c = row.config || {};
  return {
    id: row.id,
    hrName: row.name || '',
    companyName: c.companyName || '',
    email: c.email || '',
    phone: c.phone || '',
    hasEmail: c.hasEmail !== false,
    jobId: row.jobs?.description ?? c.jobId ?? '',
    emailContent: c.emailContent || '',
    status: c.status || 'Just added',
    isChecked: c.isChecked === true,
    createdAt: c.createdAt || row.created_at,
  };
}

export async function getTrackers() {
  const { data, error } = await supabase
    .from('trackers')
    .select('*, jobs(description, title)')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data: (data || []).map(mapRowToApp), error: null };
}

async function resolveJobId(jobIdValue) {
  if (!jobIdValue) return null;
  const { data } = await supabase.from('jobs').select('id').eq('description', jobIdValue).maybeSingle();
  return data?.id ?? null;
}

export async function createTracker(record) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const job_id = await resolveJobId(record.jobId || '');
  const config = {
    companyName: record.companyName || '',
    email: record.email || '',
    phone: record.phone || '',
    hasEmail: record.hasEmail !== false,
    emailContent: record.emailContent || '',
    status: record.status || 'Just added',
    isChecked: false,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('trackers')
    .insert({
      user_id: user.id,
      job_id: job_id || null,
      name: record.hrName || '',
      config,
      updated_at: new Date().toISOString(),
    })
    .select('*, jobs(description, title)')
    .single();

  if (error) return { data: null, error };
  return { data: mapRowToApp(data), error: null };
}

export async function updateTracker(id, record) {
  const job_id = await resolveJobId(record.jobId || '');
  const config = {
    companyName: record.companyName ?? '',
    email: record.email ?? '',
    phone: record.phone ?? '',
    hasEmail: record.hasEmail !== false,
    emailContent: record.emailContent ?? '',
    status: record.status ?? 'Just added',
    isChecked: record.isChecked === true,
    createdAt: record.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('trackers')
    .update({
      name: record.hrName ?? '',
      job_id: job_id ?? null,
      config,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, jobs(description, title)')
    .single();

  if (error) return { data: null, error };
  return { data: mapRowToApp(data), error: null };
}

export async function deleteTracker(id) {
  const { error } = await supabase.from('trackers').delete().eq('id', id);
  return { error };
}
