// categories-sitemap-generator.js
// Script para generar sitemap-categorias.xml con slugs amigables para categorias, fechas especiales y ocasiones

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_URL = 'https://www.envioflores.com';
const API_URL = `${BASE_URL}/api/categorias`;
const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap-categorias.xml');

function slugify(str) {
  return str
    .toString()
    .normalize('NFD')
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function fetchJson(url, token) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const options = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    lib.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log('Respuesta cruda de la API:', data); // <-- Log de depuración
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const token = process.env.PRODS_SECRET;
    if (!token) {
      throw new Error('PRODS_SECRET no definido en variables de entorno');
    }
    const { productList = [] } = await fetchJson(API_URL, token);
    const { categoryList = [], especialDates = [], ocassionList = [] } = productList[0] || {};
    const urls = [];

    // Categorías
    categoryList.forEach((cat) => {
      const slug = slugify(cat.value || cat.name || cat.id);
      urls.push(`${BASE_URL}/categoria/${slug}`);
    });

    // Fechas especiales
    especialDates.forEach((date) => {
      const slug = slugify(date.value || date.name || date.id);
      urls.push(`${BASE_URL}/fechas-especiales/${slug}`);
    });

    // Ocasiones
    ocassionList.forEach((oca) => {
      const slug = slugify(oca.value || oca.name || oca.id);
      urls.push(`${BASE_URL}/ocasiones/${slug}`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (url) => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`Sitemap de categorías generado en ${SITEMAP_PATH}`);
  } catch (err) {
    console.error('Error generando sitemap de categorías:', err);
  }
}

main();
