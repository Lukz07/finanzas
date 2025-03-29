import axios from 'axios';

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
    // Usar nuestra API route en lugar de acceder directamente a Google Sheets
    const response = await axios.get('/api/investment-strategies');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estrategias de inversión:', error);
    return [];
  }
}

// Función auxiliar para mapear nombres de iconos a componentes
export function getIconByName(iconName: string) {
  // Esta función debe implementarse en el componente que utiliza los iconos
  return iconName;
} 