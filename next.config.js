/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/api/debate/stream',
        destination: '/api/debate/state',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig