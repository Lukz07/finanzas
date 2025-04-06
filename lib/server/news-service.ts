import type { NewsItem } from '../types/blog';

export class ServerNewsService {
  private static instance: ServerNewsService;

  private constructor() {}

  public static getInstance(): ServerNewsService {
    if (!ServerNewsService.instance) {
      ServerNewsService.instance = new ServerNewsService();
    }
    return ServerNewsService.instance;
  }

  // Usar variables de entorno o configuración basada en ambientes
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

  async getNews(): Promise<NewsItem[]> {
    try {
      // Durante la construcción estática, usamos el servicio RSS directamente
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
        // Importar dinámicamente para evitar problemas durante la compilación
        const { rssNewsService } = await import('./rss-news-service');
        return rssNewsService.getNews();
      }
      
      // En desarrollo o cuando tenemos una API_BASE_URL definida, usamos la API
      // Aseguramos que usamos una URL válida con el API_BASE_URL como base
      const baseUrl = ServerNewsService.API_BASE_URL || 
                    (typeof window !== 'undefined' ? window.location.origin : '');
      
      if (!baseUrl) {
        throw new Error('No se pudo determinar la URL base para la API');
      }
      
      const apiUrl = new URL('/api/news/refresh', baseUrl).toString();
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      // Si hay un error, intentamos recuperar las noticias directamente del RSS
      try {
        const { rssNewsService } = await import('./rss-news-service');
        return rssNewsService.getNews();
      } catch (rssError) {
        console.error('Error fetching from RSS as fallback:', rssError);
        return [];
      }
    }
  }
} 