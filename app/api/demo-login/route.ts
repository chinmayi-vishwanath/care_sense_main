import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COOKIE } from '@/lib/demo';

export async function POST(req: NextRequest) {
  const { role } = await req.json().catch(() => ({ role: '' }));

  if (!['patient', 'caregiver', 'doctor'].includes(role)) {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const dest =
    role === 'patient' ? '/patient/dashboard'
    : role === 'caregiver' ? '/caregiver/home'
    : '/doctor/dashboard';

  const res = NextResponse.json({ ok: true, redirect: dest });
  res.cookies.set(DEMO_COOKIE, role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(DEMO_COOKIE);
  return res;
}
