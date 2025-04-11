import { NextResponse } from 'next/server';
import { NewsAnalysisClient } from '@/lib/services/news-analysis-client';
import { AnalystType } from '@/lib/types/news-analysis';

export async function POST() {
  try {
    const client = NewsAnalysisClient.getInstance();
    const analystTypes: AnalystType[] = ['financial', 'economic'];
    const results: { [key: string]: boolean } = {};

    for (const type of analystTypes) {
      try {
        const analysis = await client.getAnalysis(type);
        results[type] = analysis !== null;
        console.log(`✅ Verificación de caché para ${type}:`, results[type]);
      } catch (error) {
        console.error(`❌ Error al verificar análisis ${type}:`, error);
        results[type] = false;
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
    return NextResponse.json(
      { error: 'Error al inicializar análisis' },
      { status: 500 }
    );
  }
} 