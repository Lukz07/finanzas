import { NewsAnalysis, AnalystType } from '../types/news-analysis';
import { CacheManager } from '../workers/cache-manager';

export class NewsAnalysisClient {
  private static instance: NewsAnalysisClient;
  private cache: CacheManager;

  private constructor() {
    this.cache = CacheManager.getInstance();
  }

  public static getInstance(): NewsAnalysisClient {
    if (!NewsAnalysisClient.instance) {
      NewsAnalysisClient.instance = new NewsAnalysisClient();
    }
    return NewsAnalysisClient.instance;
  }

  private getCacheKey(analystType: AnalystType): string {
    return `analysis:${analystType}`;
  }

  public async getAnalysis(analystType: AnalystType): Promise<NewsAnalysis | null> {
    console.log('🔍 Buscando análisis en caché:', analystType);
    
    const cacheKey = this.getCacheKey(analystType);
    console.log('🔑 Llave de búsqueda:', cacheKey);
    
    try {
      const analysis = await this.cache.get<NewsAnalysis>(cacheKey);
      console.log('📝 Resultado de la búsqueda:', analysis ? 'Encontrado' : 'No encontrado');
      return analysis;
    } catch (error) {
      console.error('❌ Error al obtener análisis:', error);
      return null;
    }
  }

  public async getLastUpdateTime(analystType: AnalystType): Promise<Date | null> {
    try {
      const lastFetch = await this.cache.get<string>(`${this.getCacheKey(analystType)}:lastFetch`);
      return lastFetch ? new Date(lastFetch) : null;
    } catch (error) {
      console.error(`❌ Error obteniendo última actualización para ${analystType}:`, error);
      return null;
    }
  }
} 