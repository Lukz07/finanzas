import Parser from 'rss-parser';
import { NewsItem, NewsFilters } from '@/lib/types/blog';
import { slugify } from '@/lib/utils/slugify';
import { NEWS_SOURCES } from '@/lib/config/news-sources';
import fetch from 'node-fetch';

// Asegurar que solo se ejecute en el servidor
if (typeof window !== 'undefined') {
  throw new Error('Este servicio solo puede ejecutarse en el servidor');
}

class NewsService {
  private static instance: NewsService;
  private parser: Parser;
  private cachedNews: NewsItem[] = [];
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
  private readonly MAX_NEWS_PER_SOURCE = 5; // Máximo de noticias por fuente

  private constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'enclosure']
      }
    });
  }

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private get shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true;
    const now = new Date();
    return now.getTime() - this.lastFetchTime.getTime() > this.CACHE_DURATION;
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['sube', 'crece', 'mejora', 'gana', 'positivo', 'favorable'];
    const negativeWords = ['baja', 'cae', 'pierde', 'negativo', 'desfavorable'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private async parseFeed(url: string, sourceName: string): Promise<NewsItem[]> {
    try {
      console.log(`🔄 Intentando obtener feed de ${sourceName} (${url})`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
        timeout: 10000
      });

      if (!response.ok) {
        console.warn(`⚠️ Error ${response.status} al obtener feed de ${sourceName}: ${url}`);
        return [];
      }

      const xml = await response.text();
      if (!xml || xml.trim() === '') {
        console.warn(`⚠️ Feed vacío para ${sourceName}: ${url}`);
        return [];
      }

      const feed = await this.parser.parseString(xml);
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`⚠️ Feed sin items para ${sourceName}: ${url}`);
        return [];
      }

      // console.log(`✅ Feed obtenido correctamente de ${sourceName} (${feed.items.length} items)`);
      
      // Limitar la cantidad de noticias por fuente
      const limitedItems = feed.items.slice(0, this.MAX_NEWS_PER_SOURCE);
      
      const items = limitedItems.map(item => {
        const title = item.title || ''
        const content = item.content || item.description || ''
        const description = item.contentSnippet || item.description || ''
        const link = item.link || ''
        const imageUrl = item.enclosure?.url || item['media:content']?.$.url || undefined
        const publishedAt = item.pubDate || item.isoDate || new Date().toISOString()
        const category = item.categories?.[0] || 'general'
        const id = item.guid || link || Math.random().toString(36).substring(7)
        const tags = item.categories || []
        const slug = slugify(title) || slugify(id)

        const newsItem: NewsItem = {
          id,
          title,
          description,
          content,
          url: link,
          imageUrl,
          publishedAt,
          source: {
            id: sourceName.toLowerCase().replace(/\s+/g, '-'),
            name: sourceName,
            url: link
          },
          category: {
            id: category.toLowerCase(),
            name: category
          },
          sentiment: this.analyzeSentiment(title),
          readTime: Math.ceil(content.split(' ').length / 200),
          metrics: {
            views: 0,
            engagement: {
              likes: 0,
              comments: 0,
              saves: 0
            }
          },
          tags,
          slug
        }

        return newsItem
      })
      return items
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error al procesar feed de ${sourceName}: ${error.message}`);
      } else {
        console.error(`❌ Error al procesar feed de ${sourceName}: Error desconocido`);
      }
      return []
    }
  }

  private applyFilters(news: NewsItem[], filters?: NewsFilters): NewsItem[] {
    if (!filters) return news;

    let filteredNews = [...news];

    if (filters.category) {
      filteredNews = filteredNews.filter(item => item.category.id === filters.category);
    }

    if (filters.source) {
      filteredNews = filteredNews.filter(item => item.source.id === filters.source);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredNews;
  }

  async getNews(filters?: NewsFilters): Promise<NewsItem[]> {
    try {
      if (this.shouldRefreshCache) {
        console.log('🔄 Actualizando caché de noticias...');
        const rssSources = NEWS_SOURCES.filter(source => source.type === 'rss' && source.feedUrl);
        const newsPromises = rssSources.map(source => 
          this.parseFeed(source.feedUrl!, source.name)
        );
        
        const newsArrays = await Promise.all(newsPromises);
        this.cachedNews = newsArrays.flat();
        this.lastFetchTime = new Date();
        
        console.log(`📊 Total de noticias en caché: ${this.cachedNews.length}`);
      }

      let filteredNews = this.applyFilters(this.cachedNews, filters);
      filteredNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return filteredNews;
    } catch (error) {
      console.error('❌ Error general al obtener noticias:', error);
      return [];
    }
  }
}

export const newsService = NewsService.getInstance(); 