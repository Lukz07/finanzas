import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para capturar eventos de interacción
 * Estos pueden incluir:
 * - Clics en noticias
 * - Vistas de noticias
 * - Interacciones con elementos de la UI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar que los datos tengan la estructura correcta
    if (!data || typeof data !== 'object' || !data.d) {
      return NextResponse.json({ error: 'Formato de datos inválido' }, { status: 400 });
    }
    
    // Decodificar los datos (están en base64)
    let decodedData;
    try {
      decodedData = JSON.parse(atob(data.d));
    } catch (decodeError) {
      console.error('Error al decodificar datos:', decodeError);
      return NextResponse.json({ error: 'Error al decodificar datos' }, { status: 400 });
    }
    
    // Registrar en consola para desarrollo
    console.log('[Evento]', decodedData);
    
    // En producción, aquí enviarías los datos a tu sistema de analytics
    // Ejemplo con Vercel Analytics (si estás usando su SDK)
    // También podrías enviar a Google Analytics, Mixpanel, etc.
    
    // Respuesta exitosa
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al procesar evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 