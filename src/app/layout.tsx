import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PKFLIX – Discover Movies',
  description: 'Your Netflix-level movie discovery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#141414] text-white min-h-screen`}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
