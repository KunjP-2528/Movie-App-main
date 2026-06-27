/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        // Google account avatars (next-auth Google sign-in)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config) => {
    // transformers.js (in-browser Whisper) ships optional Node-only deps —
    // tell webpack to ignore them so the browser/worker build succeeds.
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    };
    return config;
  },
};

module.exports = nextConfig;
