import { supabase } from '../lib/supabaseClient';

export async function getHrContacts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('hr_contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data: data || [], error: null };
}

/**
 * Create or update hr_contacts from a tracker (contact). Call after create/update tracker.
 * Requires hr_contacts.tracker_id column and unique index (run hr_contacts_add_tracker_id.sql if needed).
 */
export async function ensureHrContactFromTracker(tracker) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !tracker?.id) return { error: null };

  const payload = {
    user_id: user.id,
    tracker_id: tracker.id,
    name: tracker.hrName || '',
    company_name: tracker.companyName || '',
    phone: tracker.phone || '',
    email: tracker.email || '',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('hr_contacts')
    .upsert(payload, { onConflict: 'tracker_id' });

  return { error };
}
