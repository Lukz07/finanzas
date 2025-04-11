export interface AnalysisItem {
  id: string;
  title: string;
  content: string;
  date: string;
  analyst: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  metrics: {
    views: number;
    engagement: {
      likes: number;
      comments: number;
      saves: number;
    };
  };
}

export type AnalystType = 'financial' | 'economic';

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