import axios from 'axios';

// URL de la hoja de cálculo pública (se debe configurar la hoja como "Pública en la web")
// Esta URL es solo un ejemplo y deberá ser reemplazada por la URL real

// Usar variables de entorno para valores sensibles
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1zcJkFiSaMSdYD2bH-Yv9fqK7kuzCMAODaxzLkvoUXwo';
const range = 'Hoja1';

// Verificar que las variables de entorno estén configuradas
if (!apiKey) {
  console.warn('⚠️ La variable de entorno NEXT_PUBLIC_GOOGLE_API_KEY no está configurada');
}

if (!sheetId) {
  console.warn('⚠️ La variable de entorno NEXT_PUBLIC_GOOGLE_SHEET_ID no está configurada');
}

const GOOGLE_SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

export interface BrokerType {
  name: string;
  annualRate: number;
  monthlyRate: number;
  websiteUrl: string; // URL del sitio web del broker para redirección
}

export interface InvestmentStrategyType {
  id: string;  // Identificador único de la estrategia (conservative, moderate, etc.)
  label: string; // Nombre mostrado en la UI
  icon: string; // Nombre del icono a mostrar (se debe mapear en el componente)
  description: string; // Descripción de la estrategia
  brokers: BrokerType[]; // Lista de brokers disponibles para esta estrategia
}

export async function fetchInvestmentStrategies(): Promise<InvestmentStrategyType[]> {
  try {
    const response = await axios.get(GOOGLE_SHEET_URL);
    
    // La estructura esperada de la hoja:
    // Columnas: id | label | icon | description | broker_name | annual_rate | website_url
    // Cada broker para una estrategia estará en filas adicionales con el mismo id
    console.log(response);
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.error('No se encontraron datos en la hoja de Google Sheets');
      return [];
    }

    // Ignorar la primera fila (encabezados)
    const dataRows = rows.slice(1);
    
    // Agrupar los datos por estrategia de inversión
    const strategiesMap = new Map<string, InvestmentStrategyType>();
    
    dataRows.forEach((row: any[]) => {
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
            websiteUrl: websiteUrl || '' // Usar cadena vacía si no hay URL
          });
        }
      }
    });
    
    return Array.from(strategiesMap.values());
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    return [];
  }
}

// Función auxiliar para mapear nombres de iconos a componentes
export function getIconByName(iconName: string) {
  // Esta función debe implementarse en el componente que utiliza los iconos
  return iconName;
} 