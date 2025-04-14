import { NextResponse } from 'next/server';
import { GoogleSheetsService } from './google-sheets-service';

export async function GET() {
  try {
    const service = GoogleSheetsService.getInstance();
    
    // Verificar la configuración
    const config = {
      SPREADSHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID,
      API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY,
      hasSpreadsheetId: !!(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID),
      hasApiKey: !!(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY),
    };
    
    try {
      const items = await service.getAnalysisItems();
      return NextResponse.json({
        success: true,
        items,
        config: {
          ...config,
          // Ocultar las claves reales por seguridad
          API_KEY: config.API_KEY ? '***' : null,
          SPREADSHEET_ID: config.SPREADSHEET_ID ? '***' : null,
        },
      });
    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        error: error.message, 
        config: {
          ...config,
          // Ocultar las claves reales por seguridad
          API_KEY: config.API_KEY ? '***' : null,
          SPREADSHEET_ID: config.SPREADSHEET_ID ? '***' : null,
        },
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error en el servicio de Google Sheets', 
      message: error?.message || 'Desconocido' 
    }, { status: 500 });
  }
} 