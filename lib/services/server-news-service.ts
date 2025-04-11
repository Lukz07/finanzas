import type { NewsItem } from '@/lib/types/blog';
import { NEWS_SOURCES } from '@/lib/config/news-sources';
import Parser from 'rss-parser';
import fetch from 'node-fetch';

// Asegurar que solo se ejecute en el servidor
if (typeof window !== 'undefined') {
  throw new Error('Este servicio solo puede ejecutarse en el servidor');
}

// Función para limpiar objetos y asegurar que sean serializables
function cleanObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  // Si es un array, limpiar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }
  
  // Si es un objeto, crear un nuevo objeto plano
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Ignorar propiedades con prototipos personalizados
    if (key === '$' || key === '_') continue;
    clean[key] = cleanObject(value);
  }
  return clean;
}

export class ServerNewsService {
  private static instance: ServerNewsService;
  private parser: Parser;

  private constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'enclosure']
      }
    });
  }

  static getInstance(): ServerNewsService {
    if (!ServerNewsService.instance) {
      ServerNewsService.instance = new ServerNewsService();
    }
    return ServerNewsService.instance;
  }

  private async parseFeed(url: string): Promise<NewsItem[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
        timeout: 10000
      });

      if (!response.ok) {
        console.warn(`⚠️ Error ${response.status} al obtener feed: ${url}`);
        return [];
      }

      const xml = await response.text();
      if (!xml || xml.trim() === '') {
        console.warn(`⚠️ Feed vacío: ${url}`);
        return [];
      }

      const feed = await this.parser.parseString(xml);
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`⚠️ Feed sin items: ${url}`);
        return [];
      }

      // Limpiar los items antes de mapearlos
      const cleanItems = feed.items.map(cleanObject);

      return cleanItems.map(item => ({
        id: item.guid || item.link || Math.random().toString(36).substring(7),
        title: item.title || '',
        description: item.contentSnippet || item.description || '',
        content: item.content || item.description || '',
        url: item.link || '',
        imageUrl: item.enclosure?.url || item['media:content']?.url || undefined,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        source: {
          id: 'rss-feed',
          name: 'RSS Feed',
          url: item.link || '',
          country: 'global'
        },
        category: {
          id: 'general',
          name: 'General'
        },
        sentiment: 'neutral',
        readTime: 0,
        metrics: {
          views: 0,
          engagement: {
            likes: 0,
            comments: 0,
            saves: 0
          }
        },
        tags: [],
        slug: item.link ? new URL(item.link).pathname.split('/').pop() || '' : ''
      }));
    } catch (error) {
      console.error(`❌ Error al procesar feed: ${error}`);
      return [];
    }
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const rssSources = NEWS_SOURCES.filter(source => source.type === 'rss' && source.feedUrl);
      const newsPromises = rssSources.map(source => this.parseFeed(source.feedUrl!));
      const newsArrays = await Promise.all(newsPromises);
      const news = newsArrays.flat();
      
      // Ordenar por fecha de publicación
      news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      return news;
    } catch (error) {
      console.error('❌ Error general al obtener noticias:', error);
      return [];
    }
  }
} 