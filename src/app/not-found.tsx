import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-9xl font-extrabold text-[#E50914] mb-2">404</p>
        <p className="text-2xl font-bold mb-4">Page Not Found</p>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#E50914] hover:bg-[#c40812] text-white font-bold rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
