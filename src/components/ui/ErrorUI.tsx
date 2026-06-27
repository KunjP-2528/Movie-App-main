'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Props {
  error: Error & { digest?: string };
  reset?: () => void;
}

export function ErrorUI({ error, reset }: Props) {
  useEffect(() => {
    console.error('[PKFLIX Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center glass rounded-2xl p-10 max-w-md w-full"
      >
        <p className="text-6xl mb-5">😕</p>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3">{error.message}</p>
        <div className="flex gap-3 justify-center">
          {reset && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="px-6 py-2.5 bg-[#E50914] text-white rounded-xl font-semibold hover:bg-[#c40812] transition-colors"
            >
              Try Again
            </motion.button>
          )}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 glass text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Go Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
