/** @type {import('next').NextConfig} */ 
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/envio-flores.appspot.com/**',
        },
        {
          protocol: 'https',
          hostname: 'envioflores.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: '45.162.168.207',
          port: '3000',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '',
          pathname: '/**',
        }
      ],
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      unoptimized: true,
  
    },
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,

    allowedDevOrigins: ['http://45.162.168.207:3000'],
  
    // Agregar encabezados para CORS
    async headers() {
      return [
        {
          source: "/api/(.*)", // Aplica a todas las rutas en /api/
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "https://www.envioflores.com", // Dominio permitido
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  