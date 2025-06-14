/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.envioflores.com',
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
      '/cart',
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
            '/cart'
          ],
        },
      ],
      additionalSitemaps: [
        'https://www.envioflores.com/blog-sitemap.xml',
        'https://www.envioflores.com/sitemap-products.xml',
        'https://www.envioflores.com/sitemap-categorias.xml',
      ],
    },
  };
