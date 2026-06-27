import { SkeletonCard } from './SkeletonCard';

export function SkeletonSlider({ title }: { title: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-40 bg-[#2d2d2d] rounded animate-pulse" />
        <span className="text-xs text-gray-600">{title}</span>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px]">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}
