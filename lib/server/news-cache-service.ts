import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import type { NewsItem, NewsFilters } from '../types/blog'

class NewsCacheService {
  private static instance: NewsCacheService
  private cachedNews: NewsItem[] = []
  private lastFetchTime: Date | null = null
  private isFetching: boolean = false
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutos
  private readonly openai: OpenAI | null

  private constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    this.openai = apiKey ? new OpenAI({ apiKey }) : null
  }

  static getInstance(): NewsCacheService {
    if (!NewsCacheService.instance) {
      NewsCacheService.instance = new NewsCacheService()
    }
    return NewsCacheService.instance
  }

  private get shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    const now = new Date()
    return now.getTime() - this.lastFetchTime.getTime() > this.CACHE_DURATION
  }

  async getNews(filters?: NewsFilters): Promise<NewsItem[]> {
    // Si necesitamos actualizar el caché y no hay una actualización en curso
    if (this.shouldRefreshCache && !this.isFetching) {
      this.refreshCache()
    }

    // Si no hay noticias en caché, devolver noticias de ejemplo
    // if (this.cachedNews.length === 0) {
    //   return this.getMockNews()
    // }

    // Aplicar filtros a las noticias cacheadas
    return this.applyFilters(this.cachedNews, filters)
  }

  private async refreshCache() {
    if (!this.openai || this.isFetching) return

    try {
      this.isFetching = true
      console.log('Iniciando generación de noticias...')

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un generador de noticias financieras y económicas que SOLO responde en formato JSON.
            NO des explicaciones, NO agregues comentarios, NO uses markdown.
            SOLO genera un objeto JSON válido con la estructura especificada.
            La respuesta debe comenzar con { y terminar con } sin ningún otro texto.
            Prioriza noticias de Argentina, seguidas por noticias globales relevantes.
            Cada noticia debe ser detallada y precisa.`
          },
          {
            role: 'user',
            content: `Genera este objeto JSON exacto con 5 noticias financieras (reales o ficticias):
            {
              "news": [
                {
                  "id": "${uuidv4()}",
                  "title": "string",
                  "description": "string",
                  "content": "string con mínimo 3 párrafos",
                  "category": {"id": "markets|economy|crypto|companies|technology", "name": "string"},
                  "source": {"id": "string", "name": "string"},
                  "publishedAt": "${new Date().toISOString()}",
                  "readTime": 5,
                  "sentiment": "positive|negative|neutral",
                  "metrics": {
                    "views": 100,
                    "engagement": {"likes": 10, "comments": 5, "saves": 3}
                  },
                  "tags": ["tag1", "tag2", "tag3"]
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No se recibió contenido de GPT-4')

      const newsData = JSON.parse(content)
      if (!newsData.news || !Array.isArray(newsData.news)) {
        throw new Error('Estructura de datos inválida')
      }

      // Procesar las noticias y generar imágenes
      const processedNews = await this.processNewsWithImages(newsData.news)

      // Actualizar el caché
      this.cachedNews = processedNews
      this.lastFetchTime = new Date()
      console.log('Caché de noticias actualizado exitosamente')
    } catch (error) {
      console.error('Error actualizando el caché:', error)
      // No actualizamos lastFetchTime para que el próximo intento pueda refrescar
    } finally {
      this.isFetching = false
    }
  }

  private async processNewsWithImages(news: any[]): Promise<NewsItem[]> {
    if (!this.openai) return news

    const processedNews = []
    // Procesar las noticias en lotes de 5 para respetar el rate limit
    for (let i = 0; i < news.length; i += 5) {
      const batch = news.slice(i, i + 5)
      const processedBatch = await Promise.all(
        batch.map(async (item: any) => {
          try {
            let imageUrl
            try {
              // Usar optional chaining para evitar errores en this.openai nulo
              const imagePrompt = this.openai?.chat.completions.create({
                model: 'gpt-4',
                messages: [
                  {
                    role: 'system',
                    content: 'Genera un prompt descriptivo en inglés para DALL-E que represente visualmente una noticia financiera. El prompt debe ser conciso, descriptivo y enfocado en elementos visuales que representen el contenido de la noticia de manera profesional y financiera.'
                  },
                  {
                    role: 'user',
                    content: `Título: ${item.title}\nDescripción: ${item.description}\nCategoría: ${item.category.name}`
                  }
                ],
                temperature: 0.7,
                max_tokens: 100
              })

              const prompt = (await imagePrompt)?.choices[0]?.message?.content
              if (prompt && this.openai) {
                const image = await this.openai.images.generate({
                  model: 'dall-e-3',
                  prompt: prompt,
                  n: 1,
                  size: '1024x1024',
                  quality: 'standard',
                  style: 'natural'
                })
                imageUrl = image.data[0]?.url
              }
            } catch (error) {
              console.error('Error generando imagen:', error)
            }

            return { ...item, imageUrl }
          } catch (error) {
            console.error('Error procesando noticia:', error)
            return item
          }
        })
      )
      processedNews.push(...processedBatch)

      // Si hay más noticias por procesar, esperar 1 minuto
      if (i + 5 < news.length) {
        await new Promise(resolve => setTimeout(resolve, 60 * 1000))
      }
    }

    return processedNews
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        id: uuidv4(),
        title: 'Ejemplo: El Banco Central mantiene las tasas de interés',
        description: 'En su última reunión, el BCRA decidió mantener las tasas de interés sin cambios.',
        content: 'Contenido detallado de la noticia de ejemplo...',
        category: { 
          id: 'economy', 
          name: 'Economía',
          slug: 'economia',
          description: 'Noticias sobre economía',
          icon: {} as any
        },
        source: { 
          id: 'bcra', 
          name: 'Banco Central',
          url: 'https://www.bcra.gob.ar',
          type: 'rss',
          priority: 1,
          category: 'economy',
          language: 'es',
          country: 'ar',
          updateFrequency: 60
        },
        publishedAt: new Date().toISOString(),
        readTime: 5,
        sentiment: 'neutral',
        metrics: {
          views: 100,
          engagement: { likes: 10, comments: 5, saves: 3 }
        } as any,
        tags: ['BCRA', 'tasas', 'política monetaria'],
        url: 'https://www.bcra.gob.ar/Noticias/tasas-de-interes.html'
      }
    ]
  }

  private applyFilters(news: NewsItem[], filters?: NewsFilters): NewsItem[] {
    if (!filters) return news

    let filteredNews = [...news]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.category) {
      filteredNews = filteredNews.filter(item => 
        item.category.id === filters.category
      )
    }

    if (filters.source) {
      filteredNews = filteredNews.filter(item => 
        item.source.id === filters.source
      )
    }

    if (filters.sentiment) {
      filteredNews = filteredNews.filter(item => 
        item.sentiment === filters.sentiment
      )
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filteredNews = filteredNews.filter(item => {
        const date = new Date(item.publishedAt)
        return date >= start && date <= end
      })
    }

    if (filters.sortBy) {
      filteredNews.sort((a, b) => {
        const order = filters.sortOrder === 'asc' ? 1 : -1
        switch (filters.sortBy) {
          case 'date':
            return order * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
          case 'views':
            return order * ((a.metrics?.views || 0) - (b.metrics?.views || 0))
          case 'engagement':
            const getEngagement = (item: NewsItem) =>
              (item.metrics?.engagement.likes || 0) +
              (item.metrics?.engagement.comments || 0) +
              (item.metrics?.engagement.saves || 0)
            return order * (getEngagement(a) - getEngagement(b))
          default:
            return 0
        }
      })
    }

    return filteredNews
  }
}

export const newsCacheService = NewsCacheService.getInstance() 