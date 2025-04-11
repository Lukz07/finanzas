import { AnalysisItem } from "@/lib/types/analysis";

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private cache: Map<string, AnalysisItem[]> = new Map();
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {}

  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  private async fetchFromGoogleSheets(): Promise<AnalysisItem[]> {

    if (!SPREADSHEET_ID || !API_KEY) {
      throw new Error("Google Sheets configuration is missing");
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Análisis!A2:L?key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Google Sheets:', errorData);
      throw new Error(`Failed to fetch data from Google Sheets: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.values.map((row: any[], index: number) => ({
      id: `analysis-${index + 1}`,
      translations: {
        es: {
          title: row[0] || "",
          description: row[1] || "",
          content: row[2] || "",
        },
        en: {
          title: row[3] || "",
          description: row[4] || "",
          content: row[5] || "",
        }
      },
      date: row[6] || "",
      category: row[7] || "",
      author: row[8] || "",
      imageUrl: row[9] || undefined,
      tags: (row[10] || "").split(",").map((tag: string) => tag.trim()),
    }));
  }

  public async getAnalysisItems(): Promise<AnalysisItem[]> {
    const now = Date.now();
    const cacheKey = "all-analysis";

    if (
      this.cache.has(cacheKey) &&
      now - this.lastFetchTime < this.CACHE_DURATION
    ) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const items = await this.fetchFromGoogleSheets();
      this.cache.set(cacheKey, items);
      this.lastFetchTime = now;
      return items;
    } catch (error) {
      console.error("Error fetching analysis items:", error);
      return [];
    }
  }

  public async getAnalysisItem(id: string): Promise<AnalysisItem | undefined> {
    const items = await this.getAnalysisItems();
    return items.find((item) => item.id === id);
  }

  public async getCategories(): Promise<string[]> {
    const items = await this.getAnalysisItems();
    return Array.from(new Set(items.map((item) => item.category)));
  }

  public async getTags(): Promise<string[]> {
    const items = await this.getAnalysisItems();
    return Array.from(new Set(items.flatMap((item) => item.tags)));
  }

  public async getAnalysisUrls(): Promise<{ url: string; lastmod: string }[]> {
    const items = await this.getAnalysisItems();
    return items.map(item => ({
      url: `/analysis/${item.id}`,
      lastmod: item.date
    }));
  }
} 