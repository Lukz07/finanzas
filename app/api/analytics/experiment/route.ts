import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para capturar datos de experimentos A/B
 * En un entorno de producción, esto podría enviar los datos a:
 * - Un servicio de analytics
 * - Un data warehouse
 * - Una base de datos
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
    console.log('[A/B Test]', decodedData);
    
    // En producción, aquí enviarías los datos a tu sistema de analytics
    // Ejemplo: await fetch('https://tu-servicio-analytics.com/api', { method: 'POST', body: JSON.stringify(decodedData) });
    
    // También se pueden almacenar en Vercel KV o cualquier otra base de datos
    
    // Respuesta exitosa
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al procesar datos de experimento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 