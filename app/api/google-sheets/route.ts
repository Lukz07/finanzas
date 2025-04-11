import { NextResponse } from 'next/server';
import { GoogleSheetsService } from './google-sheets-service';

export async function GET() {
  try {
    const service = GoogleSheetsService.getInstance();
    const items = await service.getAnalysisItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los análisis' }, { status: 500 });
  }
} 