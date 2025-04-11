import { Metadata } from "next";
import { GoogleSheetsService } from "@/lib/services/google-sheets-service";
import { AnalysisItem } from "@/lib/types/analysis";

// Función para crear slugs amigables
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/(^-|-$)/g, ''); // Eliminar guiones al inicio y final
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const service = GoogleSheetsService.getInstance();
  const items = await service.getAnalysisItems();
  
  // Buscar el item que coincida con el slug
  const item = items.find(item => {
    const esSlug = createSlug(item.translations.es.title);
    const enSlug = createSlug(item.translations.en.title);
    return esSlug === params.id || enSlug === params.id;
  });

  if (!item) {
    return {
      title: 'Análisis no encontrado',
      description: 'El análisis solicitado no está disponible',
    };
  }

  const currentSlug = createSlug(item.translations.es.title);
  const alternateSlug = createSlug(item.translations.en.title);
  const currentUrl = `https://finanzas.com/analysis/${currentSlug}`;
  const alternateUrl = `https://finanzas.com/analysis/${alternateSlug}`;

  return {
    title: `${item.translations.es.title} | Finanzas`,
    description: item.translations.es.description,
    keywords: item.tags,
    alternates: {
      canonical: currentUrl,
      languages: {
        'es': currentUrl,
        'en': alternateUrl,
      },
    },
    openGraph: {
      type: 'article',
      title: item.translations.es.title,
      description: item.translations.es.description,
      images: [item.imageUrl || "/banners/noticias/default-banner.png"],
      url: currentUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.translations.es.title,
      description: item.translations.es.description,
      images: [item.imageUrl || "/banners/noticias/default-banner.png"],
    },
    other: {
      'article:published_time': new Date(item.date).toISOString(),
      'article:author': item.author,
      'article:section': item.category,
      ...item.tags.reduce((acc, tag) => ({
        ...acc,
        [`article:tag`]: tag,
      }), {}),
    },
  };
} 