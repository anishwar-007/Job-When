import { supabase } from '../lib/supabaseClient';

const BUCKET = 'resumes';
const SIGNED_URL_EXPIRY = 3600; // 1 hour

function getExtension(filename) {
  const i = filename.lastIndexOf('.');
  return i >= 0 ? filename.slice(i) : '.pdf';
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('profiles')
    .select('resume_path, resume_updated_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return { data: null, error };
  return {
    data: {
      resumePath: data?.resume_path ?? null,
      resumeUpdatedAt: data?.resume_updated_at ?? null,
    },
    error: null,
  };
}

export async function uploadResume(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const ext = getExtension(file.name);
  const path = `${user.id}/resume${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { data: null, error: uploadError };

  const now = new Date().toISOString();
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        resume_path: path,
        resume_updated_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );

  if (upsertError) return { data: null, error: upsertError };

  return {
    data: { resumePath: path, resumeUpdatedAt: now },
    error: null,
  };
}

export async function getResumeViewUrl() {
  const { data: profile, error: profileError } = await getProfile();
  if (profileError || !profile?.resumePath) return { data: null, error: profileError || new Error('No resume') };

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(profile.resumePath, SIGNED_URL_EXPIRY);

  if (error) return { data: null, error };
  return { data: data.signedUrl, error: null };
}
