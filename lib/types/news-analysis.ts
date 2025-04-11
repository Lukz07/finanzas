export type AnalystType = "financial" | "economic";

export interface NewsAnalysis {
  id: string;
  newsId: string;
  analystType: AnalystType;
  analysis: string;
  recommendation: string;
  impact: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsAnalysisConfig {
  schedule: {
    financial: string[];
    economic: string[];
  };
  cacheDuration: number;
} 