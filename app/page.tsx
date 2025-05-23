"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewsGrid } from '@/components/blog/NewsGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, TrendingUp, ArrowRight, BookOpen, TrendingDown, BrainCircuit, LineChart, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import type { NewsItem, NewsFilters } from '@/lib/types/blog';
import { FrontendNewsService } from '@/lib/services/frontend-news-service';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { PageHeader } from '@/components/ui/page-header';
import { AdSenseAd } from '@/components/AdSenseAd';
import { AnalysisContainer } from "@/components/analysis/analysis-container";

dayjs.locale('es');

const newsService = FrontendNewsService.getInstance();

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Los tips financieros a mostrar en el slider
  const financialTips = [
    {
      id: 0,
      title: "Nuevo Análisis Disponible",
      description: "Descubre el último análisis financiero y económico del día. Mantente informado sobre las tendencias del mercado y toma decisiones más inteligentes.",
      icon: <LineChart className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-100 dark:bg-transparent",
      link: "/analysis",
      isAnalysis: true
    },
    {
      id: 1,
      title: "Aprende a invertir inteligentemente",
      description: "Descubre estrategias efectivas para empezar a invertir con poco capital y maximizar tus retornos a largo plazo.",
      icon: <TrendingUp className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-100 dark:bg-transparent",
    },
    {
      id: 2,
      title: "Controla tus deudas y gastos",
      description: "Metodologías prácticas para reducir deudas y organizar tus finanzas personales de manera efectiva.",
      icon: <TrendingDown className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-50 dark:bg-transparent",
    },
    {
      id: 3,
      title: "Educación financiera continua",
      description: "Mantente al día con conceptos financieros clave que te ayudarán a tomar mejores decisiones económicas.",
      icon: <BookOpen className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-100 dark:bg-transparent",
    },
    {
      id: 4,
      title: "Finanzas inteligentes para tu futuro",
      description: "Aprende a planificar tu retiro y asegurar tu estabilidad financiera en el largo plazo.",
      icon: <BrainCircuit className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-50 dark:bg-transparent",
    }
  ];

  // Cambiar automáticamente de slide cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % financialTips.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [financialTips.length]);

  // Función para cargar noticias envuelta en useCallback
  const fetchNews = useCallback(async (filters: NewsFilters = {}) => {
    // Evitar llamadas simultáneas
    if (isFetching.current) return;
    
    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);
      
      // Ajustar filtros según la categoría
      const tabFilters: NewsFilters = {
        ...filters,
        sortBy: 'date',
        sortOrder: 'desc'
      };
      
      const result = await newsService.getNews(tabFilters);
      
      setNews(result);
    } catch (err) {
      console.error('❌ Error cargando noticias:', err);
      setError('Error al cargar las noticias. Por favor, intente nuevamente.');
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);
  
  // Cargar noticias al montar el componente
  useEffect(() => {
    fetchNews({});
  }, [fetchNews]);

  // Contenido de fallback para SSR
  const placeholderNews: NewsItem[] = news.length > 0 ? news : [
    {
      id: 'placeholder-1',
      title: 'Cargando noticias financieras...',
      description: 'Las últimas noticias financieras estarán disponibles en breve.',
      content: '',
      url: '#',
      internalUrl: 'cargando-noticias',
      imageUrl: '',
      publishedAt: new Date().toISOString(),
      source: {
        id: 'placeholder',
        name: 'Finanzas App',
        url: '/'
      },
      category: {
        id: 'markets',
        name: 'Mercados'
      },
      readTime: 1,
      sentiment: 'neutral',
      metrics: {
        views: 0,
        engagement: { likes: 0, comments: 0, saves: 0 }
      },
      tags: ['finanzas'],
      slug: 'cargando-noticias'
    }
  ];

  const isFetching = useRef(false);

  return (
    <div className="space-y-8">
      {/* <div className="w-full max-w-[970px] mx-auto px-4">
        <AdSenseAd />
      </div> */}
      <div className="w-full py-8 space-y-8 bg-finance-gray-50 dark:bg-transparent">
        <PageHeader
          title="Finanzas Personales"
          description="Tu plataforma integral para gestionar tus finanzas, mantenerte informado y planificar tu futuro financiero."
          showActions={true}
        />

        {/* Slider de Tips Financieros */}
        <div className="relative overflow-hidden rounded-xl shadow-md my-8 max-w-[970px] mx-auto border border-finance-gray-200 dark:border-finance-gray-300 bg-transparent">
          <div 
            className="flex transition-transform duration-700 ease-in-out mx-auto" 
            style={{ 
              transform: `translateX(-${currentSlide * 100 / financialTips.length}%)`,
              width: `${financialTips.length * 100}%` 
            }}
          >
            {financialTips.map((tip) => (
              <div 
                key={tip.id} 
                className={`${tip.color} p-6 pl-14 pr-14 flex flex-col md:flex-row items-center gap-4`} 
                style={{ width: `${100 / financialTips.length}%` }}
              >
                <div className="flex-shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-finance-gray-900 dark:text-white">{tip.title}</h3>
                  <p className="text-finance-gray-600 dark:text-finance-gray-300">{tip.description}</p>
                  <Link href={tip.isAnalysis ? tip.link : "/tools/investment-planner"} className="inline-flex">
                    <Button className="mt-2 bg-finance-green-600 hover:bg-finance-green-700">
                      <span>{tip.isAnalysis ? "Ver Análisis" : "Explorar Tips Financieros"}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de navegación */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + financialTips.length) % financialTips.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-finance-gray-800/50 hover:bg-finance-gray-800/70 rounded-full p-2 text-white focus:outline-none focus:ring-2 focus:ring-finance-green-500"
            aria-label="Slide anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % financialTips.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-finance-gray-800/50 hover:bg-finance-gray-800/70 rounded-full p-2 text-white focus:outline-none focus:ring-2 focus:ring-finance-green-500"
            aria-label="Siguiente slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Tabs y Filtros */}
        <NewsGrid
          news={news}
          isLoading={loading}
        />
      </div>
      {/* <AnalysisContainer /> */}
    </div>
  );
}
