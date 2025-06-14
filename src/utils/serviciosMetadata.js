import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { baseDeDatosServer } from './firebaseServer';

// Caché en memoria para el servidor
let serverSideProductsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutos de caché

/**
 * Obtiene todos los productos con caché del lado del servidor
 * @returns {Promise<Array>} - Array de productos
 */
async function getAllProductsWithCache() {
  const now = Date.now();
  
  // Si el caché es válido, usarlo
  if (serverSideProductsCache && (now - cacheTimestamp < CACHE_TTL)) {
    return serverSideProductsCache;
  }
  
  // Si no hay caché o expiró, consultar Firestore
  try {
    const productsRef = collection(baseDeDatosServer, 'productos');
    const productsSnapshot = await getDocs(productsRef);
    
    const products = [];
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    // Actualizar caché y timestamp
    serverSideProductsCache = products;
    cacheTimestamp = now;
    
    return products;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    return serverSideProductsCache || []; // Usar caché anterior si hay error
  }
}

/**
 * Convierte un string a slug amigable para URLs
 */
export function slugify(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

/**
 * Obtiene un producto específico por su ID o slug amigable
 * @param {string} productIdOrSlug - ID o slug del producto a buscar
 * @returns {Promise<Object|null>} - Datos del producto o null si no se encuentra
 */
export const fetchProductById = async (productIdOrSlug) => {
  try {
    // Intentar buscar en el caché primero
    const allProducts = await getAllProductsWithCache();
    const cachedProduct = allProducts.find(p => p.id === productIdOrSlug);
    if (cachedProduct) {
      return cachedProduct;
    }
    // Intentamos obtener el producto por ID exacto
    const productDoc = await getDoc(doc(baseDeDatosServer, 'productos', productIdOrSlug));
    if (productDoc.exists()) {
      const productData = { id: productDoc.id, ...productDoc.data() };
      return productData;
    }
    // Si no se encuentra por ID exacto, intentamos buscar por slug amigable en el nombre
    const slug = slugify(productIdOrSlug);
    const productBySlug = allProducts.find(p => slugify(p.nombre) === slug);
    if (productBySlug) {
      return productBySlug;
    }
    // Si no está en caché, buscar en Firestore por nombre exacto (por compatibilidad)
    const productsRef = collection(baseDeDatosServer, 'productos');
    const q = query(productsRef, where('nombre', '==', productIdOrSlug.replace(/-/g, ' ')));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const productData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      return productData;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener producto por ID o slug:', error);
    return null;
  }
};

/**
 * Obtiene productos relacionados basados en categoría o características similares
 * @param {string} productId - ID del producto base
 * @param {number} limit - Cantidad de productos relacionados a devolver
 * @returns {Promise<Array>} - Array de productos relacionados
 */
export const fetchRelatedProducts = async (productId, limit = 4) => {
  try {
    const product = await fetchProductById(productId);
    if (!product) return [];
    
    // Usamos el caché de productos
    const allProducts = await getAllProductsWithCache();
    
    // Filtramos productos de la misma categoría, excluyendo el producto actual
    const relatedProducts = allProducts
      .filter(p => 
        p.id !== productId && 
        (p.categoria === product.categoria || 
         p.ocasiones?.some(o => product.ocasiones?.includes(o)))
      )
      .slice(0, limit);
    
    // Si no hay suficientes productos relacionados, completamos con productos aleatorios
    if (relatedProducts.length < limit) {
      const randomProducts = allProducts
        .filter(p => 
          p.id !== productId && 
          !relatedProducts.some(r => r.id === p.id)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, limit - relatedProducts.length);
      
      return [...relatedProducts, ...randomProducts];
    }
    
    return relatedProducts;
  } catch (error) {
    console.error('Error al obtener productos relacionados:', error);
    return [];
  }
};

/**
 * Obtiene las palabras clave relevantes para un producto específico
 * @param {string} productId - ID del producto
 * @returns {Promise<Array<string>>} - Array de palabras clave relevantes
 */
export const getProductKeywords = async (productId) => {
  try {
    const product = await fetchProductById(productId);
    if (!product) return [];
    
    const baseKeywords = [
      product.nombre,
      `${product.nombre} envío`,
      `${product.nombre} entrega express`,
      `comprar ${product.nombre}`,
      `${product.nombre} Argentina`,
      'flores envío mismo día',
      'envío flores express',
      'regalos personalizados',
      'flores a domicilio',
      'enviar flores',
      'ramos de flores',
      'flores frescas',
      'flores online',
      'flores para regalo',
      'florería online',
      'arreglos florales',
      'flores Buenos Aires',
      'envío rápido flores',
      'flores para cumpleaños',
      'flores para aniversario',
      'flores para eventos',
      'flores especiales',
      'regalos florales',
      'entrega de flores en el día',
      'mejores flores CABA',
      'flores y chocolates',
      'flores y peluches',
      'regalos combinados',
      'flores premium'
    ];
    
    // Agregamos palabras clave específicas de la categoría
    if (product.categoria) {
      baseKeywords.push(
        product.categoria,
        `${product.categoria} a domicilio`,
        `envío de ${product.categoria}`,
        `${product.categoria} online`,
        `mejor ${product.categoria}`,
        `${product.categoria} premium`,
        `${product.categoria} Argentina`,
        `${product.categoria} envío en el día`,
        `comprar ${product.categoria}`,
        `regalos de ${product.categoria}`,
        `arreglos de ${product.categoria}`,
        `sorpresas de ${product.categoria}`,
        `mejores ${product.categoria} online`,
        `mejores ${product.categoria} a domicilio`,
        `mejores ${product.categoria} express`,
        `mejores ${product.categoria}`,
        `mejores ${product.categoria} Argentina`,
        `mejores ${product.categoria} en el día`,
        `mejores ${product.categoria} online`,
        `mejores ${product.categoria} a domicilio`,
        

      );
    }
    
    // Agregamos palabras clave específicas de las ocasiones
    if (product.ocasiones && Array.isArray(product.ocasiones)) {
      product.ocasiones.forEach(ocasion => {
        baseKeywords.push(
          ocasion,
          `regalos para ${ocasion}`,
          `flores para ${ocasion}`,
          `${ocasion} regalo`,
          `sorpresa para ${ocasion}`,
          `mejor regalo para ${ocasion}`,
          `ideas para ${ocasion}`
        );
      });
    }
    
    // Devolvemos palabras clave únicas
    return [...new Set(baseKeywords)];
  } catch (error) {
    console.error('Error al obtener palabras clave del producto:', error);
    return [
      'flores', 'envío de flores', 'regalos', 'flores a domicilio', 
      'flores online', 'arreglos florales', 'ramos de flores', 
      'florería', 'entrega de flores', 'envío express', 'flores frescas',
      'flores Argentina', 'flores Buenos Aires', 'flores CABA', 'ENVIO FLORES'
    ];
  }
};

export default {
  fetchProductById,
  fetchRelatedProducts,
  getProductKeywords
};