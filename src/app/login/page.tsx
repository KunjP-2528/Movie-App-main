import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In – PKFLIX' };

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  // Only show the Google button when OAuth credentials are actually configured.
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414]" />}>
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
