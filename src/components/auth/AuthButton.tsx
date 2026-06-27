'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-[#2d2d2d] animate-pulse" />;
  }

  if (!session) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signIn()}
        className="px-4 py-1.5 bg-[#E50914] hover:bg-[#c40812] text-white text-sm font-bold rounded-lg transition-colors"
      >
        Sign In
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? 'User'}
            width={32}
            height={32}
            className="rounded-full ring-2 ring-[#E50914]/60"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center text-sm font-bold select-none">
            {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        )}
        <span className="text-sm text-gray-300 hidden md:block max-w-[100px] truncate">
          {session.user?.name}
        </span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 glass rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-4 py-3 text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
