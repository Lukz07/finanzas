import { NextResponse } from 'next/server';
import { NewsAnalysisClient } from '@/lib/services/news-analysis-client';
import { AnalystType } from '@/lib/types/news-analysis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const analystType = searchParams.get('type') as AnalystType;

  if (!analystType || !['financial', 'economic'].includes(analystType)) {
    return NextResponse.json(
      { error: 'Tipo de analista inválido' },
      { status: 400 }
    );
  }

  try {
    const client = NewsAnalysisClient.getInstance();
    const analysis = await client.getAnalysis(analystType);

    if (!analysis) {
      return NextResponse.json(
        { error: 'No hay análisis disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Error al obtener el análisis' },
      { status: 500 }
    );
  }
} 