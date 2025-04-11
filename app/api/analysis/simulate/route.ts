import { NextResponse } from 'next/server';
import { NewsAnalysisClient } from '@/lib/services/news-analysis-client';
import { AnalystType } from '@/lib/types/news-analysis';

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  // Verificar que estamos en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Este endpoint solo está disponible en desarrollo' },
      { status: 403 }
    );
  }

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

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error en simulación de actualización:', error);
    return NextResponse.json(
      { error: 'Error al simular actualización' },
      { status: 500 }
    );
  }
} 