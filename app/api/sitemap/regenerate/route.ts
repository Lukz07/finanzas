import { NextResponse } from 'next/server';
import { getSafeNews } from '@/lib/workers/news-service';
import { GoogleSheetsService } from '@/app/api/google-sheets/google-sheets-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cachear

export async function GET() {
  try {
    console.log('🔄 Iniciando regeneración de sitemap...');
    
    // Obtener URLs de análisis (esto carga los datos en cache)
    const sheetsService = GoogleSheetsService.getInstance();
    const analysisUrls = await sheetsService.getAnalysisUrls();
    
    // Obtener URLs de noticias (esto actualiza la caché si es necesario)
    const news = await getSafeNews();
    
    console.log(`📊 Datos obtenidos: ${analysisUrls.length} análisis, ${news.length} noticias`);
    
    // Forzar regeneración del sitemap haciendo una solicitud a /sitemap.xml
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
      console.log('🔄 Solicitando regeneración del sitemap.xml...');
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (sitemapResponse.ok) {
        console.log('✅ Sitemap regenerado correctamente');
      } else {
        console.error(`❌ Error al regenerar sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`);
      }
    } catch (sitemapError) {
      console.error('❌ Error al solicitar regeneración del sitemap:', sitemapError);
    }
    
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        stats: {
          news: news.length,
          analysis: analysisUrls.length
        }
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error general en regeneración de sitemap:', error);
    return NextResponse.json(
      { error: 'Error regenerando sitemap', details: String(error) },
      { status: 500 }
    );
  }
} 