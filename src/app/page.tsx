import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HeroSection } from '@/components/layout/Hero';
import { HomeMovieSections } from '@/components/movie/HomeMovieSections';
import { LandingPage } from '@/components/landing/LandingPage';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Logged-out visitors get the marketing landing page;
  // authenticated users go straight to browsing.
  if (!session) return <LandingPage />;

  return (
    <>
      <HeroSection />
      <HomeMovieSections />
    </>
  );
}
