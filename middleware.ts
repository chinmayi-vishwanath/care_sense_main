import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DEMO_COOKIE = 'demo_role';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;
  const protectedPrefixes = ['/patient', '/caregiver', '/doctor', '/emergency', '/onboarding'];
  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));

  // Demo mode: if demo_role cookie exists, allow through
  const demoRole = req.cookies.get(DEMO_COOKIE)?.value;
  if (demoRole) return res;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured and no demo cookie, redirect protected routes to login
  if (!url || !key) {
    if (isProtected) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
    return res;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      get: (name: string) => req.cookies.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) =>
        res.cookies.set({ name, value, ...options }),
      remove: (name: string, options: CookieOptions) =>
        res.cookies.set({ name, value: '', ...options })
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/caregiver/:path*',
    '/doctor/:path*',
    '/emergency/:path*',
    '/onboarding'
  ]
};
