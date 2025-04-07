import { Redis } from '@upstash/redis'

export class RedisMetrics {
  private static redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
  })

  private static readonly METRICS_KEY = 'metrics'
  private static readonly COMMANDS_KEY = 'commands'

  public static async incrementCommands(): Promise<void> {
    try {
      await this.redis.incr(this.COMMANDS_KEY)
    } catch (error) {
      console.error('Error incrementando contador de comandos:', error)
    }
  }

  public static async logDataSize(newsCount: number, dataSize: number): Promise<void> {
    try {
      const metrics = {
        newsCount,
        dataSize,
        lastUpdate: new Date().toISOString()
      }
      await this.redis.set(this.METRICS_KEY, JSON.stringify(metrics))
    } catch (error) {
      console.error('Error guardando métricas:', error)
    }
  }

  public static async getMetrics(): Promise<{
    newsCount: number
    dataSize: number
    lastUpdate: string
    commandCount: number
  }> {
    try {
      const [metrics, commandCount] = await Promise.all([
        this.redis.get<string>(this.METRICS_KEY),
        this.redis.get<number>(this.COMMANDS_KEY)
      ])

      const parsedMetrics = metrics ? JSON.parse(metrics) : {
        newsCount: 0,
        dataSize: 0,
        lastUpdate: new Date().toISOString()
      }

      return {
        ...parsedMetrics,
        commandCount: commandCount || 0
      }
    } catch (error) {
      console.error('Error obteniendo métricas:', error)
      return {
        newsCount: 0,
        dataSize: 0,
        lastUpdate: new Date().toISOString(),
        commandCount: 0
      }
    }
  }
} 