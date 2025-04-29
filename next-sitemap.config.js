/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://envioflores.com',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: [
      '/administrador',
      '/administrador/*',
      '/usuario',
      '/api',
      '/api/*',
      '/app/api/*',
      '/compras',
    ],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/administrador',
            '/administrador/*',
            '/usuario',
            '/api',
            '/api/*',
            '/app/api/*',
            '/compras',
          ],
        },
      ],
      additionalSitemaps: [
        'https://www.envioflores.com/blog-sitemap.xml',
      ],
    },
  };
  