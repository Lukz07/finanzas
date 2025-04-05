"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewsGrid } from '@/components/blog/NewsGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, TrendingUp, ArrowRight, BookOpen, TrendingDown, BrainCircuit } from 'lucide-react';
import type { NewsItem, NewsFilters } from '@/lib/types/blog';
import { NewsService } from '@/lib/services/news-service';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { PageHeader } from '@/components/ui/page-header';

dayjs.locale('es');
// Evitar la inicialización en el ámbito del módulo
// const newsService = NewsService.getInstance();

export default function HomePage() {
  // Mover la inicialización dentro del componente
  const newsServiceRef = useRef<NewsService | null>(null);
  
  // Inicializar NewsService solo en el cliente
  useEffect(() => {
    if (!newsServiceRef.current) {
      newsServiceRef.current = NewsService.getInstance();
    }
  }, []);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const isFetching = useRef(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Los tips financieros a mostrar en el slider
  const financialTips = [
    {
      id: 1,
      title: "Aprende a invertir inteligentemente",
      description: "Descubre estrategias efectivas para empezar a invertir con poco capital y maximizar tus retornos a largo plazo.",
      icon: <TrendingUp className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-100 dark:bg-finance-green-900/30",
    },
    {
      id: 2,
      title: "Controla tus deudas y gastos",
      description: "Metodologías prácticas para reducir deudas y organizar tus finanzas personales de manera efectiva.",
      icon: <TrendingDown className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-50 dark:bg-finance-green-900/20",
    },
    {
      id: 3,
      title: "Educación financiera continua",
      description: "Mantente al día con conceptos financieros clave que te ayudarán a tomar mejores decisiones económicas.",
      icon: <BookOpen className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-100 dark:bg-finance-green-900/30",
    },
    {
      id: 4,
      title: "Finanzas inteligentes para tu futuro",
      description: "Aprende a planificar tu retiro y asegurar tu estabilidad financiera en el largo plazo.",
      icon: <BrainCircuit className="h-12 w-12 text-finance-green-500" />,
      color: "bg-finance-green-50 dark:bg-finance-green-900/20",
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
      // Solo intentar cargar noticias si ya se inicializó el servicio
      if (!newsServiceRef.current) return;
      
      isFetching.current = true;
      setLoading(true);
      
      // Ajustar filtros según la categoría
      const tabFilters: NewsFilters = {
        ...filters,
        sortBy: 'date',
        sortOrder: 'desc'
      };
      
      console.log('Cargando noticias:', new Date().toISOString());
      const result = await newsServiceRef.current.getNews(tabFilters);
      
      setNews(result);
      setError(null);
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setError('Error al cargar las noticias. Por favor, intente nuevamente.');
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);
  
  // Cargar noticias solo después de que NewsService se haya inicializado
  useEffect(() => {
    if (newsServiceRef.current) {
      fetchNews({});
    }
  }, [fetchNews, newsServiceRef.current]);

  // Contenido de fallback para SSR
  const placeholderNews: NewsItem[] = news.length > 0 ? news : [
    {
      id: 'placeholder-1',
      title: 'Cargando noticias financieras...',
      description: 'Las últimas noticias financieras estarán disponibles en breve.',
      content: '',
      url: '#',
      imageUrl: '',
      publishedAt: new Date().toISOString(),
      source: {
        id: 'placeholder',
        name: 'Finanzas App',
        url: '/',
        type: 'rss',
        priority: 1,
        category: 'economy',
        language: 'es',
        country: 'es',
        updateFrequency: 60
      },
      category: {
        id: 'markets',
        name: 'Mercados',
        slug: 'mercados',
        description: 'Noticias sobre mercados financieros',
        icon: null as any
      },
      readTime: 1,
      sentiment: 'neutral',
      metrics: {
        views: 0,
        engagement: { likes: 0, comments: 0, saves: 0 }
      },
      tags: ['finanzas']
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubscribeLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubscribeSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error subscribing:', err);
      alert('Error al suscribirse. Por favor, intente nuevamente.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-finance-gray-50 dark:bg-finance-gray-900/50">
      <PageHeader
        title="Finanzas Personales"
        description="Tu plataforma integral para gestionar tus finanzas, mantenerte informado y planificar tu futuro financiero."
        showActions={true}
      />

      {/* Slider de Tips Financieros */}
      <div className="relative overflow-hidden rounded-xl shadow-md my-8">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ 
            transform: `translateX(-${currentSlide * 100 / financialTips.length}%)`,
            width: `${financialTips.length * 100}%` 
          }}
        >
          {financialTips.map((tip) => (
            <div 
              key={tip.id} 
              className={`${tip.color} p-8 flex flex-col md:flex-row items-center gap-6`} 
              style={{ width: `${100 / financialTips.length}%` }}
            >
              <div className="flex-shrink-0">
                {tip.icon}
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-finance-gray-900 dark:text-white">{tip.title}</h3>
                <p className="text-finance-gray-600 dark:text-finance-gray-300">{tip.description}</p>
                <Link href="/tools/investment-planner" className="inline-flex">
                  <Button className="mt-2 bg-finance-green-600 hover:bg-finance-green-700">
                    <span>Explorar Tips Financieros</span>
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
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-finance-gray-800/50 hover:bg-finance-gray-800/70 rounded-full p-2 text-white focus:outline-none focus:ring-2 focus:ring-finance-green-500"
          aria-label="Slide anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % financialTips.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-finance-gray-800/50 hover:bg-finance-gray-800/70 rounded-full p-2 text-white focus:outline-none focus:ring-2 focus:ring-finance-green-500"
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
        loading={loading || !newsServiceRef.current}
        error={error || undefined}
      />
        
      {/* Newsletter */}
      <div className="max-w-2xl mx-auto bg-finance-green-50 dark:bg-finance-green-900/20 p-8 rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold text-center text-finance-gray-900 dark:text-white">
          Suscríbete a nuestro Newsletter
        </h2>
        <p className="text-center text-finance-gray-600 dark:text-finance-gray-300">
          Recibe las mejores noticias financieras directamente en tu bandeja de entrada.
        </p>
        <form onSubmit={handleSubscribe} className="flex gap-4">
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={subscribeLoading || subscribeSuccess}
          />
          <Button 
            type="submit" 
            disabled={subscribeLoading || subscribeSuccess}
            className={subscribeSuccess ? 'bg-finance-green-500' : ''}
          >
            {subscribeLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : subscribeSuccess ? (
              <>
                ¡Suscrito!
                <Send className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Suscribirse
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
