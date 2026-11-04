import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DEMO_COOKIE, DEMO_PROFILES, isDemoMode } from '@/lib/demo';
import type { Role } from '@/types/domain';

export async function getSession() {
  // Demo mode: read role from cookie
  const cookieStore = cookies();
  const demoRole = cookieStore.get(DEMO_COOKIE)?.value as Role | undefined;

  if (demoRole && DEMO_PROFILES[demoRole]) {
    const profile = DEMO_PROFILES[demoRole];
    return {
      user: { id: profile.id, email: `${demoRole}@caresense.demo` } as any,
      profile,
      role: profile.role,
      isDemo: true,
    };
  }

  // Real Supabase auth
  if (isDemoMode()) return null;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from('user_profile')
    .select('id, full_name, role, phone')
    .eq('id', user.id)
    .maybeSingle();

  return {
    user,
    profile,
    role: ((profile as any)?.role ?? null) as Role | null,
    isDemo: false,
  };
}
