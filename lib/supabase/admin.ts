import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Return a dummy client that won't crash at import time.
    // Queries will fail gracefully at runtime instead of crashing the whole app.
    const placeholder = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    return placeholder;
  }

  _admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return _admin;
}

// Proxy so existing `supabaseAdmin.from(...)` calls keep working without refactoring 35 files.
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const real = getAdmin();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === 'function' ? value.bind(real) : value;
  }
});
