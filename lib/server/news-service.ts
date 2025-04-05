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
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  async getNews(): Promise<NewsItem[]> {
    try {
      // Aseguramos que usamos una URL válida con el API_BASE_URL como base
      const apiUrl = ServerNewsService.API_BASE_URL ? 
        new URL('/api/news/refresh', ServerNewsService.API_BASE_URL).toString() : 
        '/api/news/refresh';
        
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
      return [];
    }
  }
} 