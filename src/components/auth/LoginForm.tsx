'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function LoginForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ── Sign Up: create the account, then send the user to the Sign In tab ──
    if (isSignup) {
      if (!email.includes('@') || password.length < 6) {
        setError('Enter a valid email and a password of at least 6 characters.');
        return;
      }
      setLoading(true);
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setLoading(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Could not create account. Please try again.');
        return;
      }

      enqueueSnackbar('Account created! Please sign in to continue.', { variant: 'success' });
      setMode('signin');     // switch to Sign In tab
      setPassword('');       // clear password, keep email prefilled
      return;
    }

    // ── Sign In ──
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setError('Invalid email or password. Use demo@pkflix.com / demo123 to try.');
      return;
    }

    // Hard navigation so the server re-renders `/` with the new session cookie
    // and the client session (useSession) re-initializes. A client-side
    // router.push() would serve the stale, logged-out RSC cache instead.
    window.location.assign('/');
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/' });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#141414]">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <Link href="/" className="block text-center mb-10">
          <span className="text-3xl font-extrabold tracking-tight">
            PK<span className="text-[#E50914]">FLIX</span>
          </span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex p-1 mb-7 bg-white/5 rounded-xl" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                !isSignup ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isSignup ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-1">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {isSignup ? 'Start building your movie collection' : 'Sign in to your account'}
          </p>

          {/* Google — only rendered when OAuth is configured on the server */}
          {googleEnabled && (
            <>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 glass hover:bg-white/10 rounded-xl font-medium transition-colors mb-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSignup ? 'Sign up with Google' : 'Continue with Google'}
              </motion.button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-600">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="demo@pkflix.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#E50914]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#E50914]/60 transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-[#c40812] disabled:opacity-60 text-white font-bold rounded-xl transition-colors"
            >
              {loading
                ? isSignup ? 'Creating account…' : 'Signing in…'
                : isSignup ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: <span className="text-gray-300">demo@pkflix.com</span> /{' '}
              <span className="text-gray-300">demo123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
