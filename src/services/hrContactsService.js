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
