"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AnalysisItem } from "@/lib/types/analysis";
import { GoogleSheetsService } from '@/app/api/google-sheets/google-sheets-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageByPath } from "@/lib/config/languages";

type LanguageCode = 'es' | 'en';

// Función para crear slugs amigables
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/(^-|-$)/g, ''); // Eliminar guiones al inicio y final
};

export default function AnalysisPage() {
  const pathname = usePathname();
  const [analysisItems, setAnalysisItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [langCode, setLangCode] = useState<LanguageCode>('es');

  useEffect(() => {
    // Obtener el idioma guardado o usar el predeterminado
    const savedLang = localStorage.getItem('selectedLang') as LanguageCode;
    if (savedLang) {
      setLangCode(savedLang);
    }
  }, []);

  const locale = langCode === 'es' ? es : enUS;
  const alternateLang = langCode === 'es' ? 'en' : 'es';

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const service = GoogleSheetsService.getInstance();
        const items = await service.getAnalysisItems();
        setAnalysisItems(items);
      } catch (err) {
        setError("Error al cargar los análisis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLangCode(newLang);
    localStorage.setItem('selectedLang', newLang);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title={langCode === 'es' ? "Análisis Financiero" : "Financial Analysis"}
          description={langCode === 'es' 
            ? "Explora análisis detallados y tendencias del mercado financiero"
            : "Explore detailed analysis and financial market trends"}
        />
        <div className="mt-8 grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title={langCode === 'es' ? "Análisis Financiero" : "Financial Analysis"}
          description={langCode === 'es' 
            ? "Explora análisis detallados y tendencias del mercado financiero"
            : "Explore detailed analysis and financial market trends"}
        />
        <div className="mt-8 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={langCode === 'es' ? "Análisis Financiero" : "Financial Analysis"}
        description={langCode === 'es' 
          ? "Explora análisis detallados y tendencias del mercado financiero"
          : "Explore detailed analysis and financial market trends"}
      />
      <div className="mt-8 grid gap-6">
        {analysisItems.map((item) => {
          const translation = item.translations[langCode] || item.translations.es;
          const alternateTranslation = item.translations[alternateLang] || item.translations.es;
          // Generar el slug basado en el título del idioma actual
          const slug = createSlug(translation.title);
          
          return (
            <div key={item.id} className="relative">
              <Link 
                href={`/analysis/${slug}`}
                className="block"
              >
                <Card className="hover:bg-muted transition-colors">
                  <CardHeader>
                    <CardTitle>{translation.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(item.date), "PPP", { locale })} • {item.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{translation.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <button
                onClick={() => handleLanguageChange(alternateLang)}
                className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {alternateLang === 'es' ? (
                  <>
                    <span className="text-xl">🇪🇸</span>
                    <span className="text-sm">Español</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🇬🇧</span>
                    <span className="text-sm">English</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 