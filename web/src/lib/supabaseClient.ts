import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://riomwjpbjwoadamszres.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_C3NISrfYq62uR55AXZss0g_AeXGlnwE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase Google OAuth Sign-in
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.warn('Supabase Google OAuth notice:', err.message);
    return { data: null, error: err };
  }
}

/**
 * Supabase Apple OAuth Sign-in
 */
export async function signInWithApple() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.warn('Supabase Apple OAuth notice:', err.message);
    return { data: null, error: err };
  }
}
