import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calculator, TrendingUp, Target, PiggyBank, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Guías de Finanzas Personales - Aprende a Invertir y Ahorrar',
  description: 'Guías completas sobre finanzas personales, inversiones, ahorro y planificación financiera. Aprende a gestionar tu dinero de forma inteligente.',
  keywords: [
    'guías finanzas personales',
    'como invertir dinero',
    'planificación financiera',
    'ahorro familiar',
    'inversiones principiantes',
    'presupuesto personal',
    'educación financiera argentina'
  ],
  openGraph: {
    title: 'Guías de Finanzas Personales - Aprende a Invertir y Ahorrar',
    description: 'Guías completas sobre finanzas personales, inversiones, ahorro y planificación financiera. Aprende a gestionar tu dinero de forma inteligente.',
    type: 'website',
  },
};

const guides = [
  {
    id: 'inversiones-principiantes',
    title: 'Guía Completa de Inversiones para Principiantes',
    description: 'Aprende desde cero cómo empezar a invertir tu dinero con poco capital y riesgo controlado.',
    icon: TrendingUp,
    readTime: '15 min',
    topics: ['Tipos de inversiones', 'Riesgo vs Rentabilidad', 'Primeros pasos', 'Errores comunes'],
    link: '/guias/inversiones-principiantes'
  },
  {
    id: 'presupuesto-familiar',
    title: 'Cómo Crear y Mantener un Presupuesto Familiar',
    description: 'Metodología práctica para controlar tus gastos y maximizar tus ahorros mes a mes.',
    icon: Calculator,
    readTime: '12 min',
    topics: ['Regla 50/30/20', 'Control de gastos', 'Apps recomendadas', 'Objetivos de ahorro'],
    link: '/guias/presupuesto-familiar'
  },
  {
    id: 'ahorro-inteligente',
    title: 'Estrategias de Ahorro Inteligente',
    description: 'Técnicas probadas para ahorrar dinero sin sacrificar tu calidad de vida.',
    icon: PiggyBank,
    readTime: '10 min',
    topics: ['Ahorro automático', 'Fondos de emergencia', 'Metas financieras', 'Trucos de ahorro'],
    link: '/guias/ahorro-inteligente'
  },
  {
    id: 'planificacion-jubilacion',
    title: 'Planificación para la Jubilación',
    description: 'Cómo asegurar tu futuro financiero y jubilarte cómodamente.',
    icon: Target,
    readTime: '18 min',
    topics: ['Cálculo jubilatorio', 'Inversiones a largo plazo', 'Seguros de vida', 'Planificación patrimonial'],
    link: '/guias/planificacion-jubilacion'
  },
  {
    id: 'analisis-financiero',
    title: 'Análisis Financiero Personal',
    description: 'Aprende a evaluar tu situación financiera y tomar decisiones informadas.',
    icon: BarChart3,
    readTime: '14 min',
    topics: ['Estados financieros', 'Ratios importantes', 'Indicadores clave', 'Toma de decisiones'],
    link: '/guias/analisis-financiero'
  },
  {
    id: 'educacion-financiera',
    title: 'Fundamentos de Educación Financiera',
    description: 'Conceptos básicos que todo adulto debe conocer sobre el dinero.',
    icon: BookOpen,
    readTime: '20 min',
    topics: ['Conceptos básicos', 'Inflación', 'Interés compuesto', 'Productos financieros'],
    link: '/guias/educacion-financiera'
  }
];

export default function GuiasPage() {
  const breadcrumbItems = [
    { label: 'Guías Financieras' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      
      <PageHeader
        title="Guías de Finanzas Personales"
        description="Aprende a gestionar tu dinero con nuestras guías completas y prácticas sobre inversiones, ahorro y planificación financiera."
        showActions={false}
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => {
          const IconComponent = guide.icon;
          return (
            <Card key={guide.id} className="group hover:shadow-lg transition-shadow duration-300">
              <Link href={guide.link} className="block p-6 h-full">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-finance-green-100 dark:bg-finance-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-finance-green-200 dark:group-hover:bg-finance-green-800/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-finance-green-600 dark:text-finance-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-finance-green-600 dark:group-hover:text-finance-green-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
                      <span>📖 {guide.readTime}</span>
                      <span>{guide.topics.length} temas</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {guide.topics.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400"
                        >
                          {topic}
                        </span>
                      ))}
                      {guide.topics.length > 2 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                          +{guide.topics.length - 2} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 bg-finance-green-50 dark:bg-finance-green-900/10 rounded-xl p-8">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-finance-green-600 dark:text-finance-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda personalizada?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Nuestras guías están diseñadas para ser prácticas y fáciles de seguir. Si tienes dudas específicas, 
            explora nuestras herramientas de cálculo o consulta nuestro análisis de mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/investment-planner"
              className="px-6 py-3 bg-finance-green-600 text-white rounded-lg hover:bg-finance-green-700 transition-colors"
            >
              Usar Calculadora de Inversiones
            </Link>
            <Link 
              href="/analysis"
              className="px-6 py-3 border border-finance-green-600 text-finance-green-600 rounded-lg hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20 transition-colors"
            >
              Ver Análisis de Mercado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
