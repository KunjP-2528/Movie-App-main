import { Suspense } from 'react';
import { SearchPage } from '@/components/search/SearchPage';

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center text-gray-400">
          Searching...
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
