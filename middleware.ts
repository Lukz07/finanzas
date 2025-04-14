import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Función para detectar si el usuario es un bot (ofuscada)
function _isr(userAgent: string | null): boolean {
  if (!userAgent) return false;
  // Patrón ofuscado
  const _p = /(?:b[0o]t|cr[a@]wl[e3]r|sp[i1]d[e3]r|g[0o][0o]gl[e3]b[0o]t)/i;
  return _p.test(userAgent);
}

export function middleware(request: NextRequest) {
  // Obtener la respuesta original
  const response = NextResponse.next();

  // Generar ID para la sesión si no existe
  const hasSessionId = request.cookies.has('_sid');
  if (!hasSessionId) {
    const sessionId = uuidv4();
    response.cookies.set('_sid', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
  }

  // Configurar cabeceras relacionadas con SEO
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  // Cabecera Vary para indicar que el contenido puede variar según el user-agent
  response.headers.set('Vary', 'User-Agent');
  
  // El path actual
  const { pathname } = request.nextUrl;
  
  // Si estamos en una ruta de blog
  if (pathname.startsWith('/blog')) {
    const userAgent = request.headers.get('user-agent');
    
    // Si es un bot, incluir cabecera para indicar que está viendo la versión estática
    // y establecer cabeceras de caché específicas para bots
    if (_isr(userAgent)) {
      response.headers.set('X-Variant', 'static');
      // Cache para bots
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    } else {
      // No guardar en caché para usuarios normales
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    
    // Agregar protección contra hotlinking de imágenes
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self'");
  }
  
  return response;
}

// Especificar en qué rutas debe ejecutarse el middleware
export const config = {
  matcher: [
    '/blog/:path*', 
    '/'
  ],
}; 