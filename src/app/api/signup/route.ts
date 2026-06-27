import { NextRequest, NextResponse } from 'next/server';
import { registerUser, hasUser } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));

  // Basic server-side validation
  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  if (hasUser(email)) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  registerUser(email, password);
  return NextResponse.json({ success: true });
}
