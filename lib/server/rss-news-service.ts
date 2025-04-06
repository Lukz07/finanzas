import Parser from 'rss-parser'
import { v4 as uuidv4 } from 'uuid'
import type { NewsItem } from '../types/blog'

type CustomItem = {
  title: string
  link: string
  pubDate: string
  content: string
  contentSnippet: string
  categories?: string[]
  creator?: string
  isoDate?: string
  'media:content'?: { $: { url: string } }
  enclosure?: { url: string }
}

type CustomFeed = {
  title: string
  description: string
  link: string
  items: CustomItem[]
}

type RssFeed = {
  url: string;
  source: { 
    id: string; 
    name: string; 
    url?: string;
  };
  category: { 
    id: string; 
    name: string; 
  };
}

class RssNewsService {
  private static instance: RssNewsService
  private parser: Parser<CustomFeed, CustomItem>
  private cachedNews: NewsItem[] = []
  private lastFetchTime: Date | null = null
  private isFetching: boolean = false
  private isInitialized: boolean = false
  private initPromise: Promise<void> | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // RSS feeds de noticias financieras argentinas
  private readonly RSS_FEEDS: RssFeed[] = [
    // {
    //   url: 'https://www.cronista.com/feed/economia/',
    //   source: { id: 'cronista', name: 'El Cronista' },
    //   category: { id: 'economy', name: 'Economía' }
    // },
    // {
    //   url: 'https://www.cronista.com/feed/finanzas/',
    //   source: { id: 'cronista', name: 'El Cronista' },
    //   category: { id: 'economy', name: 'Economía' }
    // },
    {
      url: 'https://www.ambito.com/rss/pages/economia.xml',
      source: { id: 'ambito', name: 'Ámbito Financiero' },
      category: { id: 'economy', name: 'Economía' }
    },
    {
      url: 'https://www.ambito.com/rss/pages/finanzas.xml',
      source: { id: 'ambito', name: 'Ámbito Financiero' },
      category: { id: 'finance', name: 'Finanzas' }
    },
    {
      url: 'https://feeds.bloomberg.com/markets/news.rss',
      source: { id: 'bloomberg', name: 'Bloomberg' },
      category: { id: 'markets', name: 'Mercados' }
    },
    {
      url: 'https://feeds.bloomberg.com/economics/news.rss',
      source: { id: 'bloomberg', name: 'Bloomberg' },
      category: { id: 'economy', name: 'Economia' }
    },
    {
      url: 'https://finance.yahoo.com/rss/topstories',
      source: { id: 'yahoo', name: 'Yahoo' },
      category: { id: 'finance', name: 'Finanzas' }
    },
    {
      url: 'https://blockchain.news/rss/',
      source: { id: 'blockchain', name: 'Blockchain News' },
      category: { id: 'crypto', name: 'Criptomonedas' }
    },
    {
      url: 'https://es.cointelegraph.com/rss/tag/bitcoin',
      source: { id: 'cointelegraph', name: 'CoinTelegraph' },
      category: { id: 'crypto', name: 'Criptomonedas' }
    },
    {
      url: 'https://es.cointelegraph.com/rss/tag/ethereum',
      source: { id: 'cointelegraph', name: 'CoinTelegraph' },
      category: { id: 'crypto', name: 'Criptomonedas' }
    },
    {
      url: 'https://es.cointelegraph.com/rss/tag/altcoin',
      source: { id: 'cointelegraph', name: 'CoinTelegraph' },
      category: { id: 'crypto', name: 'Criptomonedas' }
    },
    {
      url: 'https://es.cointelegraph.com/rss/tag/blockchain',
      source: { id: 'cointelegraph', name: 'CoinTelegraph' },
      category: { id: 'crypto', name: 'Criptomonedas' }
    }
  ]

  private constructor() {
    this.parser = new Parser<CustomFeed, CustomItem>({
      customFields: {
        item: [
          ['media:content', 'media:content'],
          ['enclosure', 'enclosure']
        ]
      }
    })
    // Inicializar el caché inmediatamente al crear la instancia
    this.initializeCache();
  }

  // Inicialización asincrónica del caché
  private initializeCache(): void {
    if (!this.initPromise) {
      console.log('📡 RSS News Service - Iniciando carga inicial del caché...');
      this.initPromise = this.refreshCache().then(() => {
        this.isInitialized = true;
        console.log('✅ RSS News Service - Caché inicializado correctamente');
      }).catch(error => {
        console.error('❌ RSS News Service - Error inicializando caché:', error);
      });
    }
  }

  // Esperar a que el caché se inicialice
  private async ensureCacheInitialized(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) {
      try {
        await this.initPromise;
      } catch (error) {
        console.error('❌ Error esperando inicialización del caché:', error);
      }
    } else {
      await this.refreshCache();
      this.isInitialized = true;
    }
  }

  static getInstance(): RssNewsService {
    if (!RssNewsService.instance) {
      RssNewsService.instance = new RssNewsService()
    }
    return RssNewsService.instance
  }

  async getNews(): Promise<NewsItem[]> {
    // Asegurar que el caché esté inicializado
    await this.ensureCacheInitialized();
    
    // Si necesitamos actualizar el caché y no hay una actualización en curso
    if (this.shouldRefreshCache && !this.isFetching) {
      await this.refreshCache()
    }
    
    // Mostrar información sobre el estado del caché
    console.log(`📊 RSS News Service - Estado del caché: ${this.cachedNews.length} noticias disponibles`);
    console.log(`📅 RSS News Service - Última actualización del caché: ${this.lastFetchTime ? this.lastFetchTime.toISOString() : 'Nunca'}`);
    
    // Si el caché está vacío, forzar una actualización
    if (this.cachedNews.length === 0) {
      console.log('⚠️ RSS News Service - El caché está vacío, forzando actualización');
      await this.refreshCache();
      
      // Si aún está vacío después de intentar actualizarlo, devolver un arreglo vacío
      if (this.cachedNews.length === 0) {
        console.error('❌ RSS News Service - No se pudieron obtener noticias, caché sigue vacío');
        return [];
      }
    }
    
    // Obtener noticias de las últimas 24 horas
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Filtrar por noticias recientes y limitar a 15
    const recentNews = this.cachedNews
      .filter(news => new Date(news.publishedAt) >= last24Hours)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 15);
      
    console.log(`📰 RSS News Service - Retornando ${recentNews.length} noticias recientes`);
    
    // Si no hay noticias recientes, entregar las más recientes del caché
    if (recentNews.length === 0 && this.cachedNews.length > 0) {
      console.log('⚠️ RSS News Service - No hay noticias en las últimas 24 horas, retornando las más recientes');
      return this.cachedNews
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 15);
    }
    
    return recentNews;
  }

  private get shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    const now = new Date()
    return now.getTime() - this.lastFetchTime.getTime() > this.CACHE_DURATION
  }

  private async refreshCache(): Promise<void> {
    if (this.isFetching) return

    try {
      this.isFetching = true
      console.log('Iniciando obtención de noticias RSS...')

      const allNews: NewsItem[] = []
      const urlSet = new Set<string>() // Conjunto para rastrear URLs ya procesadas

      // Obtener noticias de todos los feeds
      for (const feed of this.RSS_FEEDS) {
        try {
          console.log(`Obteniendo noticias de ${feed.source.name}...`)
          const parsedFeed = await this.parser.parseURL(feed.url)
          
          // Convertir los items del RSS en el formato NewsItem
          const newsItems = parsedFeed.items.map(item => this.convertRssItemToNewsItem(item, feed))
          
          // Filtrar noticias duplicadas por URL
          for (const newsItem of newsItems) {
            if (newsItem.url && !urlSet.has(newsItem.url)) {
              urlSet.add(newsItem.url)
              allNews.push(newsItem)
            }
          }
        } catch (error) {
          console.error(`Error obteniendo feed de ${feed.source.name}:`, error)
        }
      }

      console.log(`Se obtuvieron ${allNews.length} noticias de RSS feeds (sin duplicados)`)
      
      // Ordenar noticias por fecha de publicación (más recientes primero)
      // y limitar a máximo 100 noticias para optimizar memoria
      this.cachedNews = allNews
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 100);
        
      this.lastFetchTime = new Date()
      console.log(`Caché actualizado con ${this.cachedNews.length} noticias`)
    } catch (error) {
      console.error('Error actualizando caché de noticias RSS:', error)
    } finally {
      this.isFetching = false
    }
  }

  private convertRssItemToNewsItem(item: CustomItem, feed: RssFeed): NewsItem {
    // Determinar la URL de la imagen
    let imageUrl: string | undefined = undefined
    if (item['media:content']?.$.url) {
      imageUrl = item['media:content'].$.url
    } else if (item.enclosure?.url) {
      imageUrl = item.enclosure.url
    }

    // Extraer un extracto del contenido
    const description = item.contentSnippet 
      ? item.contentSnippet.substring(0, 150) + (item.contentSnippet.length > 150 ? '...' : '')
      : undefined

    // Determinar el sentimiento (simplificado)
    const sentiment = this.analyzeSentiment(item.title + ' ' + (item.contentSnippet || ''))

    // Calcular tiempo de lectura estimado
    const content = item.content || item.contentSnippet || ''
    const wordCount = content.split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) // ~200 palabras por minuto

    // Generar URL interna más robusta
    const generateSlug = (text: string): string => {
      const base = text
        .toLowerCase()
        .normalize('NFD') // Normalizar acentos
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Evitar guiones múltiples
        .trim(); // Eliminar espacios al inicio y final
      
      // Generar un id corto basado en el hash del título para garantizar unicidad
      const shortId = Buffer.from(text).toString('base64').substring(0, 8).replace(/[^a-zA-Z0-9]/g, '');
      
      // Limitar la longitud de la URL para evitar problemas
      const maxBaseLength = 60;
      const trimmedBase = base.length > maxBaseLength 
        ? base.substring(0, maxBaseLength) 
        : base;
      
      const slug = `${trimmedBase}-${shortId}`;
      
      // Registrar el slug generado para depuración
      console.log(`🔗 Generando slug para noticia: "${text.substring(0, 40)}..." -> ${slug}`);
      
      return slug;
    };

    return {
      id: uuidv4(),
      title: item.title,
      description: description || 'Sin descripción disponible',
      content: item.content || item.contentSnippet || 'Sin contenido disponible',
      category: feed.category,
      source: {
        id: feed.source.id,
        name: feed.source.name,
        url: feed.source.url || feed.url
      },
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      readTime,
      sentiment,
      imageUrl,
      metrics: {
        views: Math.floor(Math.random() * 100),
        engagement: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          saves: Math.floor(Math.random() * 10)
        }
      },
      tags: item.categories || [],
      url: item.link || '',
      internalUrl: generateSlug(item.title)
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    // Palabras clave para análisis de sentimiento simplificado
    const positiveWords = ['aumento', 'crece', 'mejora', 'positivo', 'ganancia', 'beneficio', 'éxito']
    const negativeWords = ['caída', 'baja', 'crisis', 'problema', 'negativo', 'pérdida', 'inflación']
    
    const lowerText = text.toLowerCase()
    let positiveCount = 0
    let negativeCount = 0
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++
    })
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++
    })
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }
}

export const rssNewsService = RssNewsService.getInstance() 