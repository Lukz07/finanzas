import { NextResponse } from 'next/server';
import { NewsAnalysisWorker } from '@/lib/workers/news-analysis-worker';
import { AnalystType } from '@/lib/types/news-analysis';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const analystType = searchParams.get('type') as AnalystType;

  if (!analystType || !['financial', 'economic'].includes(analystType)) {
    return NextResponse.json(
      { error: 'Tipo de analista inválido' },
      { status: 400 }
    );
  }

  try {
    const worker = NewsAnalysisWorker.getInstance();
    await worker.refreshAnalysis(analystType);

    return NextResponse.json({
      success: true,
      message: `Análisis ${analystType} actualizado exitosamente`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en actualización de análisis:', error);
    return NextResponse.json(
      { error: 'Error al actualizar análisis' },
      { status: 500 }
    );
  }
} 