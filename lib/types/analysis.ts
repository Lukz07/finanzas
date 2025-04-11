export interface AnalysisTranslation {
  title: string;
  description: string;
  content: string;
}

export interface AnalysisItem {
  id: string;
  translations: {
    es: AnalysisTranslation;
    en: AnalysisTranslation;
  };
  date: string;
  category: string;
  author: string;
  imageUrl?: string;
  tags: string[];
}

export interface AnalysisFilters {
  category?: string;
  tag?: string;
  search?: string;
} 