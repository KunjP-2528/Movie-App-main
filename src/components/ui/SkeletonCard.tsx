export function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ aspectRatio: '2/3', background: '#1f1f1f' }}
    >
      {/* Animated shimmer sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #1f1f1f 0%, #2d2d2d 50%, #1f1f1f 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}
