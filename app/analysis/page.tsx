"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AnalysisItem } from "@/lib/types/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageByPath } from "@/lib/config/languages";
import Image from "next/image";
import { processImageUrl } from "@/lib/utils/image";

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
        const response = await fetch('/api/google-sheets');
        if (!response.ok) throw new Error('Error al obtener los análisis');
        const data = await response.json();
        
        // Verificar que data.items existe y es un array
        if (data.success && Array.isArray(data.items)) {
          setAnalysisItems(data.items);
        } else if (Array.isArray(data)) {
          // Fallback por si la API devuelve directamente el array
          setAnalysisItems(data);
        } else {
          // Si no hay datos válidos, establecer un array vacío
          console.error('Formato de respuesta inesperado:', data);
          setAnalysisItems([]);
          setError('Formato de respuesta inesperado del servidor');
        }
      } catch (err) {
        setError('Error al cargar los análisis');
        console.error(err);
        // Establecer un array vacío para evitar errores en .map()
        setAnalysisItems([]);
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Comprobar que analysisItems es un array antes de llamar a map */}
        {Array.isArray(analysisItems) && analysisItems.length > 0 ? (
          [...analysisItems].reverse().map((item) => {
            const translation = item.translations[langCode] || item.translations.es;
            const alternateTranslation = item.translations[alternateLang] || item.translations.es;
            const slug = createSlug(translation.title);

            console.log(item.imageUrl);
            
            return (
              <div key={item.id} className="relative">
                <Link 
                  href={`/analysis/${slug}`}
                  className="block"
                >
                  <Card className="hover:bg-muted transition-colors flex flex-col">
                    <CardHeader className="flex-grow">
                      <CardTitle className="pr-10 text-3xl">{translation.title}</CardTitle>
                      <CardDescription>
                        {item.date && /^\d{4}-\d{2}-\d{2}/.test(item.date) 
                          ? format(new Date(item.date), "PPP", { locale }) 
                          : item.date || 'Fecha no disponible'} • {item.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Image
                        src={processImageUrl(item.imageUrl)}
                        alt={translation.title}
                        width={400}
                        height={300}
                        onError={(e) => {
                          e.currentTarget.src = "/banners/noticias/default-banner.png";
                        }}
                        className="object-cover mx-auto p-5 w-full"
                      />
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
          })
        ) : (
          <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-muted-foreground">
              {langCode === 'es' 
                ? "No hay análisis disponibles en este momento"
                : "No analysis available at this time"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 