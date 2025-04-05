import type { NewsSource } from '@/lib/types/blog'

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com/feeds/markets.rss',
    type: 'rss',
    priority: 1,
    category: 'markets',
    language: 'en',
    country: 'us',
    updateFrequency: 15,
  },
  // {
  //   id: 'reuters',
  //   name: 'Reuters',
  //   url: 'https://www.reutersagency.com/feed/',
  //   type: 'rss',
  //   priority: 1,
  //   category: 'international',
  //   language: 'en',
  //   country: 'uk',
  //   updateFrequency: 15,
  // },
  // {
  //   id: 'financial-times',
  //   name: 'Financial Times',
  //   url: 'https://www.ft.com/rss/home',
  //   type: 'rss',
  //   priority: 1,
  //   category: 'business',
  //   language: 'en',
  //   country: 'uk',
  //   updateFrequency: 30,
  // },
  // {
  //   id: 'wsj',
  //   name: 'Wall Street Journal',
  //   url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  //   type: 'rss',
  //   priority: 1,
  //   category: 'markets',
  //   language: 'en',
  //   country: 'us',
  //   updateFrequency: 30,
  // },
  // {
  //   id: 'cnbc',
  //   name: 'CNBC',
  //   url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'markets',
  //   language: 'en',
  //   country: 'us',
  //   updateFrequency: 15,
  // },
  // {
  //   id: 'investing',
  //   name: 'Investing.com',
  //   url: 'https://www.investing.com/rss/news.rss',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'markets',
  //   language: 'en',
  //   country: 'global',
  //   updateFrequency: 15,
  // },
  // {
  //   id: 'coindesk',
  //   name: 'CoinDesk',
  //   url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'crypto',
  //   language: 'en',
  //   country: 'us',
  //   updateFrequency: 15,
  // },
  // {
  //   id: 'cointelegraph',
  //   name: 'CoinTelegraph',
  //   url: 'https://cointelegraph.com/rss',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'crypto',
  //   language: 'en',
  //   country: 'global',
  //   updateFrequency: 15,
  // },
  // {
  //   id: 'ambito',
  //   name: 'Ámbito Financiero',
  //   url: 'https://www.ambito.com/rss/economia.xml',
  //   type: 'rss',
  //   priority: 1,
  //   category: 'economy',
  //   language: 'es',
  //   country: 'ar',
  //   updateFrequency: 30,
  // },
  // {
  //   id: 'cronista',
  //   name: 'El Cronista',
  //   url: 'https://www.cronista.com/files/rss/news.xml',
  //   type: 'rss',
  //   priority: 1,
  //   category: 'business',
  //   language: 'es',
  //   country: 'ar',
  //   updateFrequency: 30,
  // },
  // {
  //   id: 'forbes',
  //   name: 'Forbes',
  //   url: 'https://www.forbes.com/real-time/feed2/',
  //   type: 'rss',
  //   priority: 3,
  //   category: 'business',
  //   language: 'en',
  //   country: 'us',
  //   updateFrequency: 60,
  // },
  // {
  //   id: 'infobae-economia',
  //   name: 'Infobae Economía',
  //   url: 'https://www.infobae.com/feeds/rss/economia/',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'economy',
  //   language: 'es',
  //   country: 'ar',
  //   updateFrequency: 30,
  // },
  // {
  //   id: 'iprofesional',
  //   name: 'iProfesional',
  //   url: 'https://www.iprofesional.com/rss',
  //   type: 'rss',
  //   priority: 2,
  //   category: 'business',
  //   language: 'es',
  //   country: 'ar',
  //   updateFrequency: 30,
  // },
  // APIs de noticias financieras
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

export function getSourcesByCountry(country: string) {
  return SOURCES_BY_COUNTRY[country] || [];
} 