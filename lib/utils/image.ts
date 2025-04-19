export function processImageUrl(imageUrl: string | undefined): string {
  const OWN_DOMAIN = 'https://finanzas.com';
  const DEFAULT_IMAGE = '/banners/noticias/default-banner.png';
  const INTERNAL_PATH_PREFIX = '/banners/noticias/';
  
  if (!imageUrl) {
    return DEFAULT_IMAGE;
  }
  
  try {
    const url = new URL(imageUrl);
    if (url.origin === OWN_DOMAIN) {
      // Convertir a ruta relativa dentro de public
      return url.pathname;
    }
    // Es una URL externa válida
    return imageUrl;
  } catch (e) {
    // Si no es una URL válida, asumir que es una ruta relativa
    if (imageUrl.startsWith('/')) {
      // Verificar si ya incluye el prefijo interno
      if (imageUrl.startsWith(INTERNAL_PATH_PREFIX)) {
        return imageUrl;
      }
      // Prepend el prefijo interno si es una ruta relativa dentro del dominio
      return `${INTERNAL_PATH_PREFIX}${imageUrl.replace(/^\//, '')}`;
    } else {
      // Asignar la ruta relativa al prefijo interno
      return `${INTERNAL_PATH_PREFIX}${imageUrl}`;
    }
  }
}