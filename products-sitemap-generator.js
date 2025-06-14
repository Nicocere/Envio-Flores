// products-sitemap-generator.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Cambia esto si tu entorno es desarrollo
const BASE_URL = 'https://www.envioflores.com';
const API_URL = BASE_URL + '/api/productos';
const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap-products.xml');
const AUTH_TOKEN = process.env.NEXT_PUBLIC_PRODS_SECRET || process.env.PRODS_SECRET;


function fetchProducts() {
  return new Promise((resolve, reject) => {
    // Usa el protocolo correcto según la URL
    const url = API_URL;
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, {
      method: 'GET',
      headers: {
        'authorization': `${AUTH_TOKEN}`,
        'accept': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error('Respuesta de la API:', data);
          reject(new Error(`Error HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          resolve(json.productList || []);
        } catch (e) {
          console.error('Respuesta cruda de la API:', data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Función para convertir nombre a slug amigable
function slugify(str) {
  if (!str || typeof str !== 'string' || !str.trim()) return '';
  return String(str)
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita tildes
    .replace(/[^a-zA-Z0-9\s-]/g, '') // quita caracteres especiales
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // espacios por guion
    .replace(/-+/g, '-'); // varios guiones juntos por uno
}

async function main() {

    console.log("NEXT_PUBLIC_PRODS_SECRET:", AUTH_TOKEN)
  if (!AUTH_TOKEN) {
    console.error('Falta la variable de entorno PRODS_SECRET');
    process.exit(1);
  }
  try {
    const products = await fetchProducts();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No se encontraron productos');
    }
    const today = new Date().toISOString().split('T')[0];
    const urls = products.map(prod => {
      let slug = slugify(prod.nombre);
      if (!slug) slug = prod.id; // fallback seguro
      return `<url><loc>${BASE_URL}/detail/${encodeURIComponent(slug)}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`Sitemap generado con ${products.length} productos en ${SITEMAP_PATH}`);
  } catch (err) {
    console.error('Error generando sitemap de productos:', err);
    process.exit(1);
  }
}

main();
