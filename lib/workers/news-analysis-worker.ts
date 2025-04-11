import { NewsAnalysis, NewsAnalysisConfig, AnalystType } from '../types/news-analysis';
import { OpenAI } from 'openai';
import { CacheManager } from './cache-manager';

export class NewsAnalysisWorker {
  private static instance: NewsAnalysisWorker;
  private cache: CacheManager;
  private config: NewsAnalysisConfig;
  private openai: OpenAI;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.config = {
      schedule: {
        financial: ['09:00', '15:00', '21:00'],
        economic: ['10:00', '16:00', '22:00']
      },
      cacheDuration: 8 * 60 * 60 * 1000 // 8 horas en milisegundos
    };
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.cache = CacheManager.getInstance();
  }

  public static getInstance(): NewsAnalysisWorker {
    if (!NewsAnalysisWorker.instance) {
      NewsAnalysisWorker.instance = new NewsAnalysisWorker();
    }
    return NewsAnalysisWorker.instance;
  }

  private getCacheKey(analystType: AnalystType): string {
    return `analysis:${analystType}`;
  }

  public async refreshAnalysis(analystType: AnalystType): Promise<void> {
    console.log(`🔄 Iniciando actualización de análisis ${analystType}...`);
    
    try {
      let analysis: NewsAnalysis;

      // if (this.isDevelopment) {
      //   console.log('🔧 Usando análisis simulado en desarrollo');
      //   analysis = this.generateMockAnalysis(analystType);
      // } else {
        const prompt = this.generatePrompt(analystType);
        console.log(`📝 Prompt generado para ${analystType}:`, prompt);

        console.log('🤖 Realizando llamada a OpenAI...');
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Eres un analista ${analystType === 'financial' ? 'financiero' : 'económico'} experto. 
              Analiza las noticias mas relevantes del dia y proporciona un análisis detallado y profesional.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });

        console.log('📊 Respuesta de OpenAI recibida:', completion.choices[0].message.content);
        analysis = {
          id: crypto.randomUUID(),
          newsId: 'latest',
          analystType,
          analysis: completion.choices[0].message.content || '',
          recommendation: '',
          impact: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      // }

      await this.saveAnalysis(analystType, analysis);
      console.log('✅ Análisis guardado en caché');
    } catch (error) {
      console.error(`❌ Error en actualización de análisis ${analystType}:`, error);
      throw error;
    }
  }

  private async saveAnalysis(analystType: AnalystType, analysis: NewsAnalysis): Promise<void> {
    await this.cache.set({
      key: this.getCacheKey(analystType),
      value: analysis,
      ttl: this.config.cacheDuration
    });

    await this.cache.set({
      key: `${this.getCacheKey(analystType)}:lastFetch`,
      value: new Date().toISOString(),
      ttl: this.config.cacheDuration
    });
  }

  private generatePrompt(analystType: AnalystType): string {
    const role = analystType === 'financial' ? 'financiero' : 'económico';
    return `Eres un analista ${role} experto. Proporciona un análisis detallado y profesional de las tendencias y eventos más relevantes del día de estados unidos y argentina. Tu respuesta debe ser directa y profesional, sin incluir disculpas o mensajes introductorios. 

      Estructura tu análisis de la siguiente manera:

      1. Resumen de los eventos principales
      2. Impacto en los mercados/economía
      3. Perspectivas a corto y mediano plazo
      4. Recomendaciones clave

      Inicia directamente con el análisis, sin preámbulos.`;
  }

  private generateMockAnalysis(analystType: AnalystType): NewsAnalysis {
    const role = analystType === 'financial' ? 'financiero' : 'económico';
    return {
      id: crypto.randomUUID(),
      newsId: 'latest',
      analystType,
      analysis: `[SIMULACIÓN] Análisis ${role} de las últimas 8 horas...`,
      recommendation: 'Recomendación simulada',
      impact: 'Impacto simulado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  public async shouldRefresh(analystType: AnalystType): Promise<boolean> {
    const lastFetchKey = `${this.getCacheKey(analystType)}:lastFetch`;
    const lastFetch = await this.cache.get<string>(lastFetchKey);
    
    if (!lastFetch) {
      console.log(`⏰ No hay análisis previo para ${analystType}`);
      return true;
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const shouldRefresh = this.config.schedule[analystType].includes(currentTime);
    console.log(`⏰ Verificación de actualización para ${analystType}:`, {
      horaActual: currentTime,
      horariosProgramados: this.config.schedule[analystType],
      necesitaActualizar: shouldRefresh
    });

    return shouldRefresh;
  }

  public async getAnalysis(analystType: AnalystType): Promise<NewsAnalysis | null> {
    return await this.cache.get<NewsAnalysis>(this.getCacheKey(analystType));
  }
} 