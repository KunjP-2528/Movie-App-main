export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 7) return 'text-green-400';
  if (rating >= 5) return 'text-yellow-400';
  return 'text-red-400';
};

// Generates a shimmer SVG as a base64 blur placeholder for Next.js <Image>
export const shimmerBlurUrl = (w = 400, h = 600): string => {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#1f1f1f"/>
    <rect width="${w}" height="${h}" fill="url(#g)">
      <animate attributeName="x" from="-${w}" to="${w}" dur="1.4s" repeatCount="indefinite"/>
    </rect>
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stop-color="#1f1f1f"/>
        <stop offset="50%" stop-color="#2d2d2d"/>
        <stop offset="100%" stop-color="#1f1f1f"/>
      </linearGradient>
    </defs>
  </svg>`;

  const encoded =
    typeof window === 'undefined'
      ? Buffer.from(svg).toString('base64')
      : btoa(unescape(encodeURIComponent(svg)));

  return `data:image/svg+xml;base64,${encoded}`;
};
