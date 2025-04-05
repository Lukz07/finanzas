import type { NewsCategory } from '@/lib/types/blog';
import {
  LineChart,
  Building2,
  Wallet,
  Briefcase,
  Cpu,
  LandPlot,
  Landmark,
  Bitcoin,
  GanttChartSquare,
  Globe,
  TrendingUp,
  BadgeDollarSign
} from 'lucide-react';

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: 'markets',
    name: 'Mercados',
    slug: 'mercados',
    description: 'Análisis y noticias sobre mercados financieros globales',
    icon: LineChart
  },
  {
    id: 'economy',
    name: 'Economía',
    slug: 'economia',
    description: 'Información sobre la economía global y local',
    icon: TrendingUp
  },
  {
    id: 'finance',
    name: 'Finanzas',
    slug: 'finanzas',
    description: 'Noticias sobre finanzas personales y corporativas',
    icon: Wallet
  },
  {
    id: 'business',
    name: 'Negocios',
    slug: 'negocios',
    description: 'Actualidad empresarial y corporativa',
    icon: Briefcase
  },
  {
    id: 'technology',
    name: 'Tecnología',
    slug: 'tecnologia',
    description: 'Innovación tecnológica en el sector financiero',
    icon: Cpu
  },
  {
    id: 'real-estate',
    name: 'Inmobiliario',
    slug: 'inmobiliario',
    description: 'Mercado inmobiliario y tendencias del sector',
    icon: LandPlot
  },
  {
    id: 'banking',
    name: 'Banca',
    slug: 'banca',
    description: 'Noticias sobre el sector bancario',
    icon: Building2
  },
  {
    id: 'regulation',
    name: 'Regulación',
    slug: 'regulacion',
    description: 'Cambios regulatorios y normativas financieras',
    icon: Landmark
  },
  {
    id: 'crypto',
    name: 'Criptomonedas',
    slug: 'criptomonedas',
    description: 'Noticias sobre criptomonedas y blockchain',
    icon: Bitcoin
  },
  {
    id: 'commodities',
    name: 'Materias Primas',
    slug: 'materias-primas',
    description: 'Mercado de commodities y recursos naturales',
    icon: GanttChartSquare
  },
  {
    id: 'international',
    name: 'Internacional',
    slug: 'internacional',
    description: 'Noticias financieras internacionales',
    icon: Globe
  },
  {
    id: 'investments',
    name: 'Inversiones',
    slug: 'inversiones',
    description: 'Estrategias y oportunidades de inversión',
    icon: BadgeDollarSign
  }
];

export function getCategoryIcon(categoryId: string) {
  const category = NEWS_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.icon || TrendingUp;
}

export function getCategoryById(categoryId: string) {
  return NEWS_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getCategoryBySlug(slug: string) {
  return NEWS_CATEGORIES.find(cat => cat.slug === slug);
} 