/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Las paginas privadas cambian con cada registro: que el navegador no las
  // reutilice de su cache al navegar entre pestanas.
  experimental: { staleTimes: { dynamic: 0 } },
};

export default nextConfig;
