import type { NewsItem } from '@/lib/types/blog';

export class DataOptimizer {
  private static readonly MAX_DESCRIPTION_LENGTH = 150;
  private static readonly MAX_CONTENT_LENGTH = 5000;

  public static optimizeNewsData(news: NewsItem[]): NewsItem[] {
    return news.map(item => ({
      ...item,
      // Truncar textos largos
      description: this.truncateText(item.description, this.MAX_DESCRIPTION_LENGTH),
      content: this.truncateText(item.content, this.MAX_CONTENT_LENGTH),
      // Asegurar que los campos numéricos sean números
      metrics: {
        views: Number(item.metrics?.views) || 0,
        engagement: {
          likes: Number(item.metrics?.engagement?.likes) || 0,
          comments: Number(item.metrics?.engagement?.comments) || 0,
          saves: Number(item.metrics?.engagement?.saves) || 0
        }
      }
    }));
  }

  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  public static getDataSize(data: any): number {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  public static logDataSize(data: any, label: string = 'Data'): void {
    const sizeInBytes = this.getDataSize(data);
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    console.log(`📊 ${label} size: ${sizeInKB}KB (${sizeInBytes} bytes)`);
  }
} 