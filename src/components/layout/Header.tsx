'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';
import { AuthButton } from '@/components/auth/AuthButton';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'My List' },
];

export function Header() {
  const pathname = usePathname();
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.className = next;
  };

  // The landing page (logged-out home) has its own nav — hide the app header there.
  if (pathname === '/' && status !== 'authenticated') return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-extrabold tracking-tight">
              PK<span className="text-[#E50914]">FLIX</span>
            </motion.div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#E50914] ${
                  pathname === link.href ? 'text-[#E50914]' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-sm ml-auto hidden md:block">
            <SearchBar />
          </div>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center glass rounded-full text-lg flex-shrink-0"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>

          {/* Auth */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
