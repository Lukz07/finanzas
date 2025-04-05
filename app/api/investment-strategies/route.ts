import { NextResponse } from 'next/server';
import axios from 'axios';

// Interfaces
interface BrokerType {
  name: string;
  annualRate: number;
  monthlyRate: number;
  websiteUrl: string;
}

interface InvestmentStrategyType {
  id: string;
  label: string;
  icon: string;
  description: string;
  brokers: BrokerType[];
}

// API route handler
export async function GET() {
  try {
    // Usar variables de entorno del servidor (no visibles en el cliente)
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Hoja1';

    // Verificar que las variables de entorno estén configuradas
    if (!apiKey || !sheetId) {
      return NextResponse.json(
        { error: 'Faltan variables de entorno para Google Sheets API' }, 
        { status: 500 }
      );
    }

    const GOOGLE_SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    
    const response = await axios.get(GOOGLE_SHEET_URL);
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron datos en la hoja de Google Sheets' },
        { status: 404 }
      );
    }

    // Ignorar la primera fila (encabezados)
    const dataRows = rows.slice(1);
    
    // Agrupar los datos por estrategia de inversión
    const strategiesMap = new Map<string, InvestmentStrategyType>();
    
    dataRows.forEach((row: string[]) => {
      const [id, label, icon, description, brokerName, annualRateStr, websiteUrl] = row;
      const annualRate = parseFloat(annualRateStr);
      
      if (!strategiesMap.has(id)) {
        // Crear nueva estrategia
        strategiesMap.set(id, {
          id,
          label,
          icon,
          description,
          brokers: []
        });
      }
      
      // Añadir broker a la estrategia existente
      if (brokerName && !isNaN(annualRate)) {
        const strategy = strategiesMap.get(id);
        if (strategy) {
          strategy.brokers.push({
            name: brokerName,
            annualRate,
            monthlyRate: annualRate / 12,
            websiteUrl: websiteUrl || ''
          });
        }
      }
    });
    
    // Convertir el mapa a un array
    const strategies = Array.from(strategiesMap.values());
    
    // Retornar las estrategias como JSON
    return NextResponse.json(strategies);
    
  } catch (error: unknown) {
    console.error('Error al obtener datos de Google Sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al obtener datos: ${errorMessage}` },
      { status: 500 }
    );
  }
} 