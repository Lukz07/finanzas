import type { NewsSource } from '@/lib/types/blog'

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    type: 'rss',
    priority: 1,
    category: 'mercados',
    language: 'en',
    country: 'us',
    updateFrequency: 15,
    feedUrl: 'https://feeds.bloomberg.com/markets/news.rss'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    type: 'rss',
    priority: 1,
    category: 'economia',
    language: 'en',
    country: 'us',
    updateFrequency: 15,
    feedUrl: 'https://feeds.bloomberg.com/economics/news.rss'
  },
  {
    id: 'ambito',
    name: 'Ámbito Financiero',
    url: 'https://www.ambito.com',
    type: 'rss',
    priority: 2,
    category: 'economía',
    language: 'es',
    country: 'ar',
    updateFrequency: 30,
    feedUrl: 'https://www.ambito.com/rss/pages/economia.xml'
  },
  {
    id: 'ambito',
    name: 'Ámbito Financiero',
    url: 'https://www.ambito.com',
    type: 'rss',
    priority: 2,
    category: 'finanzas',
    language: 'es',
    country: 'ar',
    updateFrequency: 30,
    feedUrl: 'https://www.ambito.com/rss/pages/finanzas.xml'
  },
  {
    id: 'cronista',
    name: 'El Cronista',
    url: 'https://www.cronista.com',
    type: 'rss',
    priority: 2,
    category: 'finanzas',
    language: 'es',
    country: 'ar',
    updateFrequency: 30,
    feedUrl: 'https://www.cronista.com/files/rss/finanzas.xml'
  },
  {
    id: 'clarin',
    name: 'Clarín',
    url: 'https://www.clarin.com',
    type: 'rss',
    priority: 2,
    category: 'economía',
    language: 'es',
    country: 'ar',
    updateFrequency: 30,
    feedUrl: 'https://www.clarin.com/rss/economia/'
  },
  {
    id: 'cointelegraph',
    name: 'CoinTelegraph',
    url: 'https://es.cointelegraph.com',
    type: 'rss',
    priority: 1,
    category: 'crypto',
    language: 'es',
    country: 'global',
    updateFrequency: 15,
    feedUrl: 'https://es.cointelegraph.com/rss'
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com',
    type: 'rss',
    priority: 1,
    category: 'finance',
    language: 'en',
    country: 'us',
    updateFrequency: 15,
    feedUrl: 'https://finance.yahoo.com/rss/topstories'
  },
  {
    id: 'alpha-vantage',
    name: 'Alpha Vantage News',
    url: 'https://www.alphavantage.co/query',
    type: 'api',
    priority: 1,
    category: 'markets',
    language: 'en',
    country: 'us',
    updateFrequency: 60,
    credentials: {
      apiKey: process.env.ALPHA_VANTAGE_API_KEY
    }
  },
  {
    id: 'finnhub',
    name: 'Finnhub',
    url: 'https://finnhub.io/api/v1',
    type: 'api',
    priority: 1,
    category: 'markets',
    language: 'en',
    country: 'us',
    updateFrequency: 60,
    credentials: {
      apiKey: process.env.FINNHUB_API_KEY
    }
  },
]

// Categorías disponibles
export const NEWS_CATEGORIES = [
  'mercados',
  'economia',
  'finanzas',
  'negocios',
  'tecnologia',
  'politica',
  'argentina',
]

// Fuentes por idioma
export const SOURCES_BY_LANGUAGE = NEWS_SOURCES.reduce((acc, source) => {
  if (source.language) {
    if (!acc[source.language]) {
      acc[source.language] = [];
    }
    acc[source.language].push(source);
  }
  return acc;
}, {} as Record<string, NewsSource[]>);

// Fuentes por país
export const SOURCES_BY_COUNTRY = NEWS_SOURCES.reduce((acc, source) => {
  if (source.country) {
    if (!acc[source.country]) {
      acc[source.country] = [];
    }
    acc[source.country].push(source);
  }
  return acc;
}, {} as Record<string, NewsSource[]>);

// Fuentes por tipo
export const SOURCES_BY_TYPE = {
  rss: NEWS_SOURCES.filter(source => source.type === 'rss'),
  api: NEWS_SOURCES.filter(source => source.type === 'api'),
  scraper: NEWS_SOURCES.filter(source => source.type === 'scraper'),
}

// Fuentes por categoría
export const SOURCES_BY_CATEGORY = NEWS_SOURCES.reduce((acc, source) => {
  if (source.category) {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
  }
  return acc;
}, {} as Record<string, NewsSource[]>);

export function getSourceById(sourceId: string) {
  return NEWS_SOURCES.find(source => source.id === sourceId);
}

export function getSourcesByCategory(categoryId: string) {
  return SOURCES_BY_CATEGORY[categoryId] || [];
}

export function getSourcesByLanguage(language: string) {
  return SOURCES_BY_LANGUAGE[language] || [];
}

export function getSourcesByCountry(country: string): NewsSource[] {
  return NEWS_SOURCES.filter(source => source.country === country);
} 