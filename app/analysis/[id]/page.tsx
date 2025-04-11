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
import { use } from "react";
import Image from "next/image";

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

export default function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pathname = usePathname();
  const [analysisItem, setAnalysisItem] = useState<AnalysisItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [langCode, setLangCode] = useState<LanguageCode>('es');
  const [imageError, setImageError] = useState(false);

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
        
        // Buscar el item que coincida con el slug en cualquier idioma
        const item = items.find(item => {
          // Intentar encontrar coincidencia en el idioma actual
          const currentTranslation = item.translations[langCode] || item.translations.es;
          const currentSlug = createSlug(currentTranslation.title);
          
          // Intentar encontrar coincidencia en el idioma alternativo
          const alternateTranslation = item.translations[alternateLang] || item.translations.es;
          const alternateSlug = createSlug(alternateTranslation.title);
          
          return currentSlug === resolvedParams.id || alternateSlug === resolvedParams.id;
        });

        if (item) {
          setAnalysisItem(item);
        } else {
          setError("Análisis no encontrado");
        }
      } catch (err) {
        setError("Error al cargar el análisis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [resolvedParams.id, langCode, alternateLang]);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLangCode(newLang);
    localStorage.setItem('selectedLang', newLang);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title={langCode === 'es' ? "Cargando análisis..." : "Loading analysis..."}
          description=""
        />
        <div className="mt-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analysisItem) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title={langCode === 'es' ? "Error" : "Error"}
          description={error || (langCode === 'es' ? "Análisis no encontrado" : "Analysis not found")}
        />
      </div>
    );
  }

  const translation = analysisItem.translations[langCode] || analysisItem.translations.es;

  // Función para procesar el contenido y dividirlo en párrafos
  const processContent = (content: string) => {
    // Reemplazar /n/n por \n\n para estandarizar
    const standardizedContent = content.replace(/\/n\/n/g, '\n\n');
    // Dividir por doble salto de línea y filtrar párrafos vacíos
    return standardizedContent
      .split(/\n\n+/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <Link 
          href="/analysis"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {langCode === 'es' ? "Volver a análisis" : "Back to analysis"}
        </Link>
        <button
          onClick={() => handleLanguageChange(alternateLang)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {alternateLang === 'es' ? (
            <>
              <span className="text-xl">🇪🇸</span>
              <span>Español</span>
            </>
          ) : (
            <>
              <span className="text-xl">🇬🇧</span>
              <span>English</span>
            </>
          )}
        </button>
      </div>

      <PageHeader
        title={translation.title}
        description={translation.description}
      />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardDescription>
              {format(new Date(analysisItem.date), "PPP", { locale })} • {analysisItem.author}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">{analysisItem.category}</Badge>
              {analysisItem.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <Image
                src={!analysisItem.imageUrl || imageError 
                  ? "/banners/noticias/default-banner.png" 
                  : analysisItem.imageUrl}
                alt={translation.title}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {processContent(translation.content).map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 