import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Obtener la URL de la imagen original de los parámetros de consulta
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  const referer = searchParams.get('referer') || '';

  if (!imageUrl) {
    return new NextResponse('URL de imagen no proporcionada', { status: 400 });
  }

  try {
    // Validar que la URL sea válida
    const url = new URL(imageUrl);
    
    // Lista negra de dominios que no queremos permitir por seguridad
    const blockedDomains = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'internal.company.com',
    ];
    
    // Verificar que no sea un dominio bloqueado
    if (blockedDomains.some(domain => url.hostname.includes(domain))) {
      return new NextResponse('Dominio no permitido', { status: 403 });
    }

    // Construir el referer automáticamente si no está presente
    const generatedReferer = referer || `https://${url.hostname}`;

    // Hacer la solicitud con encabezados personalizados para evitar restricciones de hotlinking
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FinanzasBot/1.0)',
        'Referer': generatedReferer,
        'Origin': generatedReferer,
      },
    });

    if (!response.ok) {
      console.error(`Error al cargar imagen desde ${imageUrl}: ${response.status} ${response.statusText}`);
      return new NextResponse(`Error al obtener la imagen: ${response.statusText}`, { 
        status: response.status 
      });
    }

    // Obtener el tipo de contenido y los bytes de la imagen
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageData = await response.arrayBuffer();

    // Devolver la imagen con las cabeceras adecuadas
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Caché por 1 día
      },
    });
  } catch (error) {
    console.error('Error en el proxy de imágenes:', error);
    return new NextResponse('Error al procesar la imagen', { status: 500 });
  }
} 