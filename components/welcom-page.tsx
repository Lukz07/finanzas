"use client"

import React, { useEffect, useState } from "react"

import { useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  PlusCircle,
  CheckCircle,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  Target,
} from "lucide-react"
import { format, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type InvestmentType, INVESTMENT_TYPES } from "@/components/initial-setup-modal"
import { OBJECTIVE_TYPES, type ObjectiveType } from "@/lib/objective-types"
import { calculateInvestmentProgress, calcularMesesParaObjetivo } from "@/lib/investment-calculator"
import { ThemeToggle } from "@/components/theme-toggle"
import AnimatedBackground from "@/components/animated-background"
import { fetchInvestmentStrategies, type InvestmentStrategyType, type BrokerType } from "@/lib/google-sheets"
import { getStrategyIcon } from "@/components/investment-icons"
// import WelcomePageScrollFix from "@/components/welcome-page-scroll-fix"
// import InvestmentProjectionCard from "@/components/investment-projection-card"

interface InvestmentProjectionCardProps {
  selectedPeriod: string;
  estimatedMonths: number;
  calculateForPeriod: (months: number) => {
    months: number;
    withInvestment: number;
    withoutInvestment: number;
    marketContribution: number;
  };
  initialAmount: number;
  monthlyContribution: number;
  getSelectedAnnualRate: () => number;
  formatCurrency: (value: number) => string;
}

function InvestmentProjectionCard({
  selectedPeriod,
  estimatedMonths,
  calculateForPeriod,
  initialAmount,
  monthlyContribution,
  getSelectedAnnualRate,
  formatCurrency
}: InvestmentProjectionCardProps) {
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(selectedPeriod);
  const [data, setData] = useState({
    withInvestment: 0,
    withoutInvestment: 0,
    marketContribution: 0,
    months: 0
  });

  useEffect(() => {
    console.log("localSelectedPeriod", localSelectedPeriod)
    const months = localSelectedPeriod === '1month' ? 1 :
                  localSelectedPeriod === '6months' ? 6 :
                  localSelectedPeriod === '1year' ? 12 :
                  localSelectedPeriod === '3years' ? 36 :
                  localSelectedPeriod === '5years' ? 60 :
                  localSelectedPeriod === '10years' ? 120 :
                  localSelectedPeriod === 'total' ? estimatedMonths : 1;
    console.log("months", months)
    setData(calculateForPeriod(months));
    console.log("data", data)
  }, [localSelectedPeriod, estimatedMonths, calculateForPeriod]);

  console.log("RENDERING data", data)

  const rendimientoPorcentaje = data.withInvestment > 0 ? 
    ((data.marketContribution / data.withInvestment) * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="p-5 rounded-lg border border-finance-gray-200 dark:border-finance-gray-700 bg-white dark:bg-finance-gray-900">
      {/* Botones de selección de período */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: '1 mes', value: '1month', months: 1 },
          { label: '6 meses', value: '6months', months: 6 },
          { label: '1 año', value: '1year', months: 12 },
          { label: '3 años', value: '3years', months: 36 },
          { label: '5 años', value: '5years', months: 60 },
          { label: '10 años', value: '10years', months: 120 },
          { label: 'Meses totales de la inversión', value: 'total', months: estimatedMonths }
        ].map(period => (
          <button
            key={period.value}
            onClick={() => {setLocalSelectedPeriod(period.value); console.log("period", period.value)}}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              localSelectedPeriod === period.value
                ? 'bg-finance-green-500 text-white dark:text-finance-gray-800'
                : 'bg-finance-gray-100 dark:bg-finance-gray-800 text-finance-gray-700 dark:text-finance-gray-300 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center border-b border-finance-gray-200 dark:border-finance-gray-700 pb-3 mb-4">
        <h5 className="font-medium text-lg text-finance-gray-800 dark:text-white">
          Proyección a {data.months === 1 ? '1 mes' : data.months === 12 ? '1 año' : data.months === 36 ? '3 años' : data.months === 60 ? '5 años' : data.months === 120 ? '10 años' : `${data.months} meses`}
        </h5>
        <div className="flex items-center gap-2">
          <span className="text-xs text-finance-gray-500 dark:text-finance-gray-400">Rendimiento:</span>
          <span className="text-finance-green-600 dark:text-finance-green-400 font-bold text-lg">
            {rendimientoPorcentaje}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 rounded-lg bg-finance-gray-50 dark:bg-finance-gray-800/50">
          <p className="text-sm text-finance-gray-600 dark:text-finance-gray-400 mb-1">Capital acumulado</p>
          <p className="text-2xl font-bold text-finance-gray-800 dark:text-white">
            {/* {formatCurrency(data.withInvestment).replace('ARS', '').replace('.00', '')} */}
            {data.withInvestment}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-finance-gray-50 dark:bg-finance-gray-800/50">
          <p className="text-sm text-finance-gray-600 dark:text-finance-gray-400 mb-1">Aportes realizados</p>
          <p className="text-2xl font-bold text-finance-gray-700 dark:text-finance-gray-300">
            {formatCurrency(data.withoutInvestment).replace('ARS', '').replace('.00', '')}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-finance-green-50 dark:bg-finance-green-900/20">
          <p className="text-sm text-finance-gray-600 dark:text-finance-gray-400 mb-1">Rendimiento generado</p>
          <p className="text-2xl font-bold text-finance-green-600 dark:text-finance-green-400">
            {formatCurrency(data.marketContribution).replace('ARS', '').replace('.00', '')}
          </p>
        </div>
      </div>
      
      {/* Vista para móviles - Más compacta */}
      <div className="md:hidden mt-4 pt-4 border-t border-finance-gray-200 dark:border-finance-gray-700">
        <h6 className="text-sm font-medium text-finance-gray-600 dark:text-finance-gray-400 mb-2">Resumen móvil</h6>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">Capital total:</span>
            <span className="text-base font-medium text-finance-gray-800 dark:text-white">
              {formatCurrency(data.withInvestment).replace('ARS ', '$')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">Tus aportes:</span>
            <span className="text-base font-medium text-finance-gray-700 dark:text-finance-gray-300">
              {formatCurrency(data.withoutInvestment).replace('ARS ', '$')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">Rendimiento:</span>
            <span className="text-base font-medium text-finance-green-600 dark:text-finance-green-400">
              {formatCurrency(data.marketContribution).replace('ARS ', '$')} ({rendimientoPorcentaje})
            </span>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso que muestra la proporción entre aportes y rendimiento */}
      <div className="mt-6">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-finance-gray-600 dark:text-finance-gray-400">
            Tu dinero: {((data.withoutInvestment / data.withInvestment) * 100).toFixed(0)}%
          </span>
          <span className="text-finance-green-600 dark:text-finance-green-400">
            Rendimiento: {((data.marketContribution / data.withInvestment) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-3 w-full bg-finance-gray-100 dark:bg-finance-gray-800 rounded-full overflow-hidden flex">
          {/* Parte que representa el dinero del usuario */}
          <div 
            className="h-full bg-finance-gray-400 dark:bg-finance-gray-600" 
            style={{ 
              width: `${(data.withoutInvestment / data.withInvestment) * 100}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
          {/* Parte que representa el rendimiento */}
          <div 
            className="h-full bg-finance-green-500" 
            style={{ 
              width: `${(data.marketContribution / data.withInvestment) * 100}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-finance-gray-500 dark:text-finance-gray-400">
          <p>Capital total: {formatCurrency(data.withInvestment)}</p>
          <p>• {formatCurrency(data.withoutInvestment)} de tus aportes</p>
          <p>• {formatCurrency(data.marketContribution)} de rendimiento</p>
        </div>
      </div>
      
      {/* Detalles adicionales */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-finance-gray-600 dark:text-finance-gray-400 mb-1">Capital inicial</p>
          <p className="font-medium text-finance-gray-800 dark:text-white">
            {formatCurrency(initialAmount).replace('ARS', '').replace('.00', '')}
          </p>
        </div>
        
        <div>
          <p className="text-finance-gray-600 dark:text-finance-gray-400 mb-1">Aporte mensual</p>
          <p className="font-medium text-finance-gray-800 dark:text-white">
            {formatCurrency(monthlyContribution).replace('ARS', '').replace('.00', '')}
          </p>
        </div>
        
        <div>
          <p className="text-finance-gray-600 dark:text-finance-gray-400 mb-1">Tasa anual</p>
          <p className="font-medium text-finance-green-600 dark:text-finance-green-400">
            {getSelectedAnnualRate()}%
          </p>
        </div>
        
        <div>
          <p className="text-finance-gray-600 dark:text-finance-gray-400 mb-1">Tasa mensual</p>
          <p className="font-medium text-finance-green-600 dark:text-finance-green-400">
            {(getSelectedAnnualRate() / 12).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

interface WelcomePageProps {
  onComplete?: (data: {
    initialAmount: number
    targetAmount: number
    completedContributions: number[]
    lastContributionDate: string | null
    startDate: string
    investmentType: InvestmentType
    selectedBroker: string
    monthlyContribution: number
    objectiveType: string
    objectiveName?: string
    estimatedMonths: number
    currentProgress: number
    nextMilestone: number
  }) => void
  config?: {
    baseTargetAmount: number
    monthlyContribution: number
  }
}

export default function WelcomePage({ onComplete, config }: WelcomePageProps) {
  const [activeTab, setActiveTab] = useState("welcome")
  const [initialAmount, setInitialAmount] = useState(0)
  const [targetAmount, setTargetAmount] = useState(config?.baseTargetAmount || 0)
  const [completedContributions, setCompletedContributions] = useState<number[]>([])
  const [startMonth, setStartMonth] = useState<string>("")
  const [investmentType, setInvestmentType] = useState<string>("moderate")
  const [selectedBroker, setSelectedBroker] = useState<string>("")
  const [monthlyContribution, setMonthlyContribution] = useState(config?.monthlyContribution || 0)
  const [objectiveType, setObjectiveType] = useState("house")
  const [customObjectiveName, setCustomObjectiveName] = useState("")
  
  // Nuevo estado para el formulario de contacto
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("")
  
  // Nuevo estado para almacenar las estrategias de inversión
  const [investmentStrategies, setInvestmentStrategies] = useState<InvestmentStrategyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Períodos de tiempo para comparativa
  const [selectedPeriod, setSelectedPeriod] = useState("1month")

  // Al iniciar, establecer el monto objetivo según el tipo de objetivo seleccionado por defecto
  useEffect(() => {
    if (OBJECTIVE_TYPES[objectiveType]) {
      setTargetAmount(OBJECTIVE_TYPES[objectiveType].defaultAmount);
    }
  }, []);

  // Obtener las estrategias de inversión al cargar el componente
  useEffect(() => {
    const getInvestmentStrategies = async () => {
      try {
        setIsLoading(true)
        const strategies = await fetchInvestmentStrategies()
        setInvestmentStrategies(strategies)
        
        // Si hay estrategias, establecer la primera como predeterminada
        if (strategies.length > 0) {
          setInvestmentType(strategies[0].id)
        }
      } catch (err) {
        console.error('Error al obtener estrategias de inversión:', err)
        setError('No se pudieron cargar las estrategias de inversión')
      } finally {
        setIsLoading(false)
      }
    }
    
    getInvestmentStrategies()
  }, [])

  // Obtener el mes actual
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  // Actualizar el monto objetivo cuando cambia el tipo de objetivo
  const handleObjectiveTypeChange = useCallback((value: string) => {
    setObjectiveType(value)
    const selectedObjective = OBJECTIVE_TYPES[value]
    if (selectedObjective) {
      setTargetAmount(selectedObjective.defaultAmount)
    }
  }, [])

  const handleInitialAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInitialAmount(value ? Number.parseInt(value) : 0)
  }, [])

  const handleTargetAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "")
      setTargetAmount(value ? Number.parseInt(value) : config?.baseTargetAmount || 0)
    },
    [config?.baseTargetAmount],
  )

  const handleMonthlyContributionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "")
      if (value) {
        // Siempre actualiza con el valor ingresado, sin importar su tamaño
        setMonthlyContribution(Number.parseInt(value))
      } else {
        // Solo usa el valor default cuando el campo está vacío
        setMonthlyContribution(config?.monthlyContribution || 0)
      }
    },
    [config?.monthlyContribution],
  )

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)
  }, [])

  // const toggleContribution = useCallback((monthIndex: number) => {
  //   setCompletedContributions((prev) => {
  //     if (prev.includes(monthIndex)) {
  //       return prev.filter((m) => m !== monthIndex)
  //     } else {
  //       return [...prev, monthIndex].sort((a, b) => a - b)
  //     }
  //   })
  // }, [])

  const handleInvestmentTypeChange = useCallback((value: string) => {
    setInvestmentType(value)
    // Reset broker selection when investment type changes
    setSelectedBroker("")
  }, [])

  const handleBrokerChange = useCallback((value: string) => {
    setSelectedBroker(value)
  }, [])

  // Calcular el progreso
  const realCapital = useMemo(() => {
    return initialAmount + completedContributions.length * monthlyContribution
  }, [initialAmount, completedContributions.length, monthlyContribution])

  const progress = useMemo(() => {
    return (realCapital / (targetAmount || config?.baseTargetAmount || 0)) * 100
  }, [realCapital, targetAmount, config?.baseTargetAmount])

  // Obtener la estrategia de inversión seleccionada
  const selectedStrategy = useMemo(() => {
    return investmentStrategies.find(strategy => strategy.id === investmentType) || null
  }, [investmentType, investmentStrategies])

  // Actualizar función para obtener la tasa anual seleccionada
  const getSelectedAnnualRate = useCallback(() => {
    if (!selectedStrategy) return 0;
    
    const brokers = selectedStrategy.brokers;
    if (selectedBroker) {
      const broker = brokers.find(b => b.name === selectedBroker);
      return broker ? broker.annualRate : brokers[0]?.annualRate || 0;
    }
    // Si no hay broker seleccionado, usar la tasa más alta
    return brokers.length > 0 
      ? brokers.reduce((prev, current) => 
          (prev.annualRate > current.annualRate) ? prev : current
        ).annualRate
      : 0;
  }, [selectedStrategy, selectedBroker]);

  // Modificar la cálculo de tiempo estimado
  const estimatedMonths = useMemo(() => {
    if (!selectedStrategy) return 0;
    
    // Seleccionar el broker con la mayor tasa o usar el primero si no hay seleccionado
    const brokers = selectedStrategy.brokers;
    const broker = selectedBroker 
      ? brokers.find(b => b.name === selectedBroker) 
      : brokers.length > 0 
        ? brokers.reduce((prev, current) => (prev.annualRate > current.annualRate) ? prev : current)
        : null;
    
    // Obtener la tasa anual y convertirla a mensual decimal
    const annualRatePercentage = broker ? broker.annualRate : brokers[0]?.annualRate || 0;
    const monthlyRateDecimal = annualRatePercentage / 100 / 12; // Convertir tasa anual a mensual decimal
    
    const target = targetAmount || config?.baseTargetAmount || 0;
    const initial = initialAmount;
    
    // Verificar que la tasa sea válida
    if (monthlyRateDecimal < 0 || monthlyRateDecimal > 1) {
      console.error('Tasa mensual inválida:', monthlyRateDecimal, 'Original:', annualRatePercentage);
    }
    
    // Verificar casos especiales
    // Caso 1: Si el capital inicial ya alcanza el objetivo
    if (initial >= target) {
      return 0;
    }
    
    // Caso 2: Sin interés y sin aportes mensuales - imposible alcanzar objetivo
    if (monthlyRateDecimal === 0 && monthlyContribution <= 0) {
      return Infinity;
    }
    
    // Caso 3: Sin interés pero con aportes - cálculo lineal
    if (monthlyRateDecimal === 0 && monthlyContribution > 0) {
      return Math.ceil((target - initial) / monthlyContribution);
    }
    
    // Calcular tiempo estimado con la función de investment-calculator
    try {
      const result = calcularMesesParaObjetivo(initial, target, monthlyContribution, monthlyRateDecimal)
      
      // Registrar cálculos para depuración
      console.log('Debug - Parámetros del cálculo de tiempo estimado:', {
        objetivo: target,
        capitalInicial: initial,
        aporteMensual: monthlyContribution,
        tasaAnual: annualRatePercentage,
        tasaMensual: monthlyRateDecimal,
        mesesCalculados: result.meses,
        montoFinal: result.saldoFinal.toFixed(0)
      });
      
      return result.meses;
    } catch (error) {
      console.error('Error al calcular tiempo estimado:', error);
      return Infinity;
    }
  }, [investmentType, selectedBroker, selectedStrategy, monthlyContribution, targetAmount, config?.baseTargetAmount, initialAmount]);

  // Calcular el próximo logro
  const nextMilestone = useMemo(() => {
    const selectedObjective = OBJECTIVE_TYPES[objectiveType] || OBJECTIVE_TYPES.custom
    const progressPercentage = (realCapital / targetAmount) * 100

    const nextAchievement = selectedObjective.achievements.find(
      (achievement) => progressPercentage < achievement.threshold,
    )

    if (nextAchievement) {
      return (nextAchievement.threshold / 100) * targetAmount
    }

    return targetAmount
  }, [objectiveType, realCapital, targetAmount]);
  
  // Función para alternar la visibilidad del formulario de contacto
  const toggleContactForm = useCallback(() => {
    setShowContactForm(prev => !prev);
  }, []);
  
  // Función para redirigir al broker
  const redirectToBroker = useCallback(() => {
    if (!selectedBroker || !selectedStrategy) return;
    
    // Buscar el broker seleccionado en la estrategia actual
    const broker = selectedStrategy.brokers.find(b => b.name === selectedBroker);
    
    if (broker && broker.websiteUrl) {
      // Abrir la URL del broker en una nueva pestaña
      window.open(broker.websiteUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: búsqueda en Google si no hay URL disponible
      const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(selectedBroker);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
    
  }, [selectedBroker, selectedStrategy]);
  
  // Calculamos meses sin invertir = (targetAmount - initialAmount) / monthlyContribution
  const monthsWithoutInvesting = useMemo(() => {
    const remainingAmount = targetAmount - initialAmount;
    return monthlyContribution > 0 
      ? Math.ceil(remainingAmount / monthlyContribution) 
      : Infinity;
  }, [targetAmount, initialAmount, monthlyContribution]);
  
  // Calcular rendimientos para diferentes períodos
  const calculateForPeriod = useCallback((months: number) => {
    // Calcular el aporte total sin rendimiento para el período
    const totalContribsForPeriod = initialAmount + (monthlyContribution * months);
    
    // Si son 0 meses o no hay tasa de interés, devolver valores sin rendimiento
    if (months === 0 || getSelectedAnnualRate() === 0) {
      return {
        months: months,
        withInvestment: totalContribsForPeriod,
        withoutInvestment: totalContribsForPeriod,
        marketContribution: 0
      };
    }
    
    try {
      // Obtener la tasa anual y convertirla a mensual decimal
      const annualRate = getSelectedAnnualRate();
      const monthlyRateDecimal = annualRate / 100 / 12; // Convertir tasa anual a mensual decimal
      
      console.log('Debug - Parámetros del cálculo:', {
        meses: months,
        tasaAnual: annualRate,
        tasaMensual: monthlyRateDecimal,
        aporteMensual: monthlyContribution,
        capitalInicial: initialAmount
      });
      
      // Calcular el valor futuro del capital inicial con interés compuesto
      const initialAmountFV = initialAmount * Math.pow(1 + monthlyRateDecimal, months);
      
      // Calcular el valor futuro de los aportes mensuales con interés compuesto
      // Usando la fórmula de valor futuro de una anualidad: PMT * ((1 + r)^n - 1) / r
      const contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyRateDecimal, months) - 1) / monthlyRateDecimal);
      
      // El valor futuro total es la suma de ambos componentes
      const futureValue = initialAmountFV + contributionsFV;
      
      console.log('Debug - Resultados:', {
        valorFuturoCapitalInicial: initialAmountFV,
        valorFuturoAportes: contributionsFV,
        valorFuturoTotal: futureValue,
        aportesTotales: totalContribsForPeriod,
        rendimiento: futureValue - totalContribsForPeriod
      });
      
      // Redondear los valores para evitar problemas de precisión
      const roundedFutureValue = Math.round(futureValue);
      const marketContribution = Math.round(futureValue - totalContribsForPeriod);
      
      return {
        months: months,
        withInvestment: roundedFutureValue,
        withoutInvestment: totalContribsForPeriod,
        marketContribution: marketContribution
      };
    } catch (error) {
      console.error('Error al calcular rendimiento para periodo:', months, error);
      return {
        months: months,
        withInvestment: totalContribsForPeriod,
        withoutInvestment: totalContribsForPeriod,
        marketContribution: 0
      };
    }
  }, [initialAmount, monthlyContribution, getSelectedAnnualRate]);
  
  // Datos para el período seleccionado
  const periodData = useMemo(() => {
    switch (selectedPeriod) {
      case "1month": return calculateForPeriod(1);
      case "6months": return calculateForPeriod(6);
      case "1year": return calculateForPeriod(12);
      case "3years": return calculateForPeriod(36);
      case "5years": return calculateForPeriod(60);
      case "10years": return calculateForPeriod(120);
      case "total":
      default: return calculateForPeriod(estimatedMonths);
    }
  }, [selectedPeriod, calculateForPeriod, estimatedMonths]);

  // Datos específicos para la tabla comparativa (siempre usando el tiempo total estimado)
  const comparisonData = useMemo(() => {
    return calculateForPeriod(estimatedMonths);
  }, [calculateForPeriod, estimatedMonths]);

  // Valor acumulado sin inversión basado en el tiempo sin invertir
  const withoutInvestmentValue = useMemo(() => {
    // Ahora calculamos cuánto se habría acumulado sin inversión 
    // en el mismo tiempo que toma alcanzar el objetivo con inversión
    return comparisonData.withoutInvestment;
  }, [initialAmount, monthlyContribution, estimatedMonths]);

  // Valor acumulado con inversión cuando se alcanza el objetivo
  const withInvestmentValue = useMemo(() => {
    // Usar el valor calculado por comparisonData, que incluye el interés compuesto exacto
    // al final del período estimado
    return estimatedMonths === 0 ? initialAmount : comparisonData.withInvestment;
  }, [estimatedMonths, initialAmount, comparisonData.withInvestment]);

  // Rendimiento acumulado (diferencia entre valor con inversión y contribuciones totales)
  const investmentReturn = useMemo(() => {
    // Contribuciones totales hasta llegar al objetivo con inversión
    return withInvestmentValue - comparisonData.withoutInvestment;
  }, [initialAmount, monthlyContribution, estimatedMonths, withInvestmentValue]);

  // Porcentaje del rendimiento sobre el capital total
  const investmentReturnPercentage = useMemo(() => {
    if (withInvestmentValue <= 0) return 0;
    return (investmentReturn / withInvestmentValue) * 100;
  }, [investmentReturn, withInvestmentValue]);

  // Diferencia porcentual entre inversión y ahorro
  const comparisonPercentage = useMemo(() => {
    if (withoutInvestmentValue <= 0) return 0;
    return (withInvestmentValue / withoutInvestmentValue - 1) * 100;
  }, [withInvestmentValue, withoutInvestmentValue]);

  const handleComplete = useCallback(() => {
    // Si no se seleccionó un mes de inicio, usar el mes actual
    const finalStartDate = startMonth || format(currentDate, "yyyy-MM")

    const result = {
      initialAmount,
      targetAmount: targetAmount || config?.baseTargetAmount || 0,
      completedContributions,
      lastContributionDate: completedContributions.length > 0 ? new Date().toISOString() : null,
      startDate: finalStartDate,
      investmentType,
      selectedBroker,
      monthlyContribution,
      objectiveType,
      objectiveName: objectiveType === "custom" ? customObjectiveName : undefined,
      estimatedMonths,
      currentProgress: progress,
      nextMilestone,
    }

    // Si el usuario ha seleccionado un broker, redirigirlo a su plataforma
    if (selectedBroker) {
      redirectToBroker();
    } 
    // Si no ha seleccionado broker, mostrar el formulario de contacto
    else {
      toggleContactForm();
    }

    // onComplete(result)
  }, [
    initialAmount,
    targetAmount,
    completedContributions,
    startMonth,
    investmentType,
    selectedBroker,
    monthlyContribution,
    objectiveType,
    customObjectiveName,
    estimatedMonths,
    progress,
    nextMilestone,
    onComplete,
    currentDate,
    config?.baseTargetAmount,
    redirectToBroker,
    toggleContactForm
  ])

  const nextTab = useCallback(() => {
    if (activeTab === "welcome") setActiveTab("objective")
    else if (activeTab === "objective") setActiveTab("investment")
    else if (activeTab === "investment") setActiveTab("summary")
  }, [activeTab])

  const prevTab = useCallback(() => {
    if (activeTab === "summary") setActiveTab("investment")
    else if (activeTab === "investment") setActiveTab("objective")
    else if (activeTab === "objective") setActiveTab("welcome")
  }, [activeTab])

  // Obtener el ícono del objetivo seleccionado
  const ObjectiveIcon = OBJECTIVE_TYPES[objectiveType]?.icon || Target

  // Simplificar a solo lo necesario para forzar el modo oscuro
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Siempre establecer el tema en modo oscuro
  useEffect(() => {
    setMounted(true)
  }, []);

  // Esta variable ya no se usa para estilos dinámicos pero la mantenemos por si se necesita en otras lógicas
  const isDarkMode = true

  // Funciones para manejar cambios en el formulario de contacto
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContactEmail(e.target.value);
  }, []);
  
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPhone(e.target.value);
  }, []);
  
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContactMessage(e.target.value);
  }, []);
  
  const handleTermsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  }, []);
  
  // Función para enviar el formulario de contacto
  const submitContactForm = useCallback(async () => {
    // Validar email
    if (!contactEmail) {
      alert("Por favor, ingresa tu correo electrónico");
      return;
    }
    
    // Validar términos
    if (!termsAccepted) {
      alert("Debes aceptar los términos para continuar");
      return;
    }
    
    // Validar selección de asesor
    if (!selectedAdvisor) {
      alert("Por favor, selecciona un asesor");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Simulación de envío de datos
      // En un caso real, aquí iría el código para enviar los datos a tu API
      // Por ejemplo:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: contactEmail,
      //     phone: contactPhone,
      //     message: contactMessage,
      //     investmentType,
      //     selectedBroker,
      //     targetAmount,
      //     monthlyContribution,
      //     objectiveType,
      //     advisor: selectedAdvisor,
      //   }),
      // });
      
      // Simulamos un retraso para mostrar el estado de envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Marcar como enviado
      setContactSubmitted(true);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Hubo un error al enviar tu información. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }, [contactEmail, contactPhone, contactMessage, termsAccepted, investmentType, selectedBroker, targetAmount, monthlyContribution, objectiveType, selectedAdvisor]);

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 dark:bg-finance-gray-900/50 transition-colors duration-300">      
      <div className="w-full max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 text-center">
            <h1 
              className="text-4xl font-bold mb-2 dark:text-white transition-colors duration-200"
            >
              Tips Financieros 🚀
            </h1>
            <p 
              className="dark:text-finance-gray-300 transition-colors duration-200"
            >
              Planifica, visualiza y alcanza tus objetivos financieros
            </p>
          </div>

          <TabsList 
            className="grid grid-cols-4 w-full mb-8 rounded-lg transition-colors duration-300 p-1 dark:bg-finance-gray-800"
          >
            <TabsTrigger
              value="welcome"
              className="transition-colors duration-200 dark:text-finance-gray-200 data-[state=active]:bg-finance-green-500 data-[state=active]:dark:text-finance-gray-800"
            >
              Bienvenida
            </TabsTrigger>
            <TabsTrigger
              value="objective"
              className="transition-colors duration-200 dark:text-finance-gray-300 data-[state=active]:bg-finance-green-500 data-[state=active]:dark:text-finance-gray-800"
            >
              Objetivo
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="transition-colors duration-200 dark:text-finance-gray-300 data-[state=active]:bg-finance-green-500 data-[state=active]:dark:text-finance-gray-800"
            >
              Inversión
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="transition-colors duration-200 dark:text-finance-gray-300 data-[state=active]:bg-finance-green-500 data-[state=active]:dark:text-finance-gray-800"
            >
              Resumen
            </TabsTrigger>
          </TabsList>

          <Card 
            className="border-none shadow-lg overflow-visible transition-colors duration-300 dark:bg-finance-gray-900"
          >
            <TabsContent value="welcome" className="m-0 overflow-auto">
              <CardHeader>
                <CardTitle 
                  className="text-2xl dark:text-white"
                >
                  ¡Bienvenido!
                </CardTitle>
                <CardDescription 
                  className="text-finance-gray-300 dark:text-finance-gray-300"
                >
                  Esta herramienta te ayudará a planificar y visualizar como deberia ser tu progreso hacia cualquier objetivo
                  financiero que te propongas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-finance-green-500/10 dark:bg-finance-green-900/20">
                        <TrendingUp className="h-5 w-5 text-finance-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-finance-gray-800 dark:text-white">
                          Seguimiento de Inversión
                        </h3>
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                          Visualiza tu progreso y proyecciones financieras en tiempo real.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-finance-green-500/10 dark:bg-finance-green-900/20">
                        <ObjectiveIcon className="h-5 w-5 text-finance-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-finance-gray-800 dark:text-white">
                          Objetivo Personalizado
                        </h3>
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                          Define el tipo de objetivo y el monto que necesitas para alcanzarlo.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-finance-green-500/10 dark:bg-finance-green-900/20">
                        <ShieldCheck className="h-5 w-5 text-finance-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-finance-gray-800 dark:text-white">
                          Estrategias de Inversión
                        </h3>
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                          Elige entre diferentes perfiles de riesgo y rendimiento para tu capital.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-finance-green-500/10 dark:bg-finance-green-900/20">
                        <CalendarIcon className="h-5 w-5 text-finance-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-finance-gray-800 dark:text-white">
                          Planificación Temporal
                        </h3>
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                          Calcula cuánto tiempo te tomará alcanzar tu objetivo según tu estrategia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border transition-colors duration-300 bg-finance-green-500/10 dark:bg-finance-green-900/20 border-finance-green-200 dark:border-finance-green-900">
                  <p className="text-sm text-finance-gray-800 dark:text-white">
                    En los siguientes pasos, configuraremos tu plan personalizado. Necesitarás definir:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-finance-gray-600 dark:text-finance-gray-300">
                    <li>El tipo de objetivo que quieres alcanzar</li>
                    <li>Tu objetivo financiero</li>
                    <li>Tu estrategia de inversión</li>
                    <li>Tu capital inicial (si lo tienes)</li>
                    <li>El monto de tus aportes mensuales</li>
                    <li>Los aportes que ya has realizado</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={nextTab} 
                  className="text-white transition-colors duration-300 hover:bg-finance-green-600 bg-finance-green-500 dark:text-finance-gray-800"
                >
                  Comenzar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="objective" className="m-0 overflow-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-finance-gray-800 dark:text-white">Define tu Objetivo</CardTitle>
                <CardDescription>¿Qué objetivo financiero quieres alcanzar?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 overflow-auto">
                {/* Selección del tipo de objetivo */}
                <div className="space-y-2">
                  <Label className="text-finance-gray-800 dark:text-white">Tipo de objetivo</Label>
                  <RadioGroup
                    value={objectiveType}
                    onValueChange={handleObjectiveTypeChange}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2"
                  >
                    {Object.entries(OBJECTIVE_TYPES).map(([key, data]) => {
                      const typedKey = key as string;
                      const typedData = data as ObjectiveType;
                      return (
                      <div key={typedKey} className="flex items-center space-x-2">
                        <RadioGroupItem value={typedKey} id={`objective-${typedKey}`} className="peer sr-only" />
                        <Label
                          htmlFor={`objective-${typedKey}`}
                          className="flex flex-1 items-center justify-between rounded-md border-2 border-finance-gray-200 dark:border-finance-gray-700 bg-white dark:bg-finance-gray-800 p-4 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20 peer-data-[state=checked]:border-finance-green-500 [&:has([data-state=checked])]:border-finance-green-500"
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-finance-green-500/10 p-2 rounded-full">
                              {React.createElement(typedData.icon, { className: "h-5 w-5 text-finance-green-500" })}
                            </div>
                            <div className="grid gap-1">
                              <p className="font-medium leading-none text-finance-gray-800 dark:text-white">
                                {typedData.name}
                              </p>
                              <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                                {formatCurrency(typedData.defaultAmount)}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Campo para nombre personalizado si se selecciona "custom" */}
                {objectiveType === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customObjectiveName" className="text-finance-gray-800 dark:text-white">
                      Nombre de tu objetivo
                    </Label>
                    <Input
                      id="customObjectiveName"
                      placeholder="Ej: Computadora, Bicicleta, etc."
                      value={customObjectiveName}
                      onChange={(e) => setCustomObjectiveName(e.target.value)}
                      className="finance-input"
                    />
                    <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                      Dale un nombre a tu objetivo personalizado.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-finance-gray-800 dark:text-white">
                    Monto del objetivo
                  </Label>
                  <div className="flex items-center space-x-2 max-w-xs">
                    <Input
                      id="targetAmount"
                      placeholder={OBJECTIVE_TYPES[objectiveType]?.defaultAmount.toString() || "0"}
                      value={targetAmount ? targetAmount.toString() : ""}
                      onChange={handleTargetAmountChange}
                      className="text-right finance-input"
                    />
                    <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">ARS</span>
                  </div>
                  <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                    Este es el monto que necesitas para tu{" "}
                    {objectiveType === "house"
                      ? "casa"
                      : objectiveType === "car"
                        ? "auto"
                        : objectiveType === "motorcycle"
                          ? "moto"
                          : objectiveType === "travel"
                            ? "viaje"
                            : objectiveType === "custom" && customObjectiveName
                              ? customObjectiveName
                              : "objetivo"}
                    .
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialAmount" className="text-finance-gray-800 dark:text-white">
                    Capital inicial (opcional)
                  </Label>
                  <div className="flex items-center space-x-2 max-w-xs">
                    <Input
                      id="initialAmount"
                      placeholder="0"
                      value={initialAmount === 0 ? "" : initialAmount}
                      onChange={handleInitialAmountChange}
                      className="text-right finance-input"
                    />
                    <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">ARS</span>
                  </div>
                  {initialAmount > 0 && (
                    <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                      Esto representa aproximadamente el{" "}
                      {((initialAmount / (targetAmount || config?.baseTargetAmount || 0)) * 100).toFixed(2)}% de tu objetivo.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution" className="text-finance-gray-800 dark:text-white">
                    Aporte mensual
                  </Label>
                  <div className="flex items-center space-x-2 max-w-xs">
                    <Input
                      id="monthlyContribution"
                      placeholder="0"
                      value={monthlyContribution.toString()}
                      onChange={handleMonthlyContributionChange}
                      className="text-right finance-input"
                    />
                    <span className="text-sm text-finance-gray-600 dark:text-finance-gray-300">ARS</span>
                  </div>
                  <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                    Este es el monto que planeas aportar cada mes a tu inversión.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevTab}
                  className="border-finance-green-500 text-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20"
                >
                  Atrás
                </Button>
                <Button onClick={nextTab} className="bg-finance-green-500 hover:bg-finance-green-600 text-white dark:text-finance-gray-800">
                  Continuar
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="investment" className="m-0 overflow-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-finance-gray-800 dark:text-white">
                  Estrategia de Inversión
                </CardTitle>
                <CardDescription>
                  Selecciona el perfil de inversión que mejor se adapte a tus objetivos y tolerancia al riesgo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 overflow-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finance-green-500"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
                    {error}
                    <p className="text-sm mt-2">
                      Intenta recargar la página o verifica la conexión a internet.
                    </p>
                  </div>
                ) : (
                  <RadioGroup
                    value={investmentType}
                    onValueChange={handleInvestmentTypeChange}
                    className="grid grid-cols-1 gap-4 pt-2"
                  >
                    {investmentStrategies.map((strategy) => (
                      <div key={strategy.id} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={strategy.id} id={`investment-${strategy.id}`} className="peer sr-only" />
                          <Label
                            htmlFor={`investment-${strategy.id}`}
                            className="flex flex-1 items-center justify-between rounded-md border-2 border-finance-gray-200 dark:border-finance-gray-700 bg-white dark:bg-finance-gray-800 p-4 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20 peer-data-[state=checked]:border-finance-green-500 [&:has([data-state=checked])]:border-finance-green-500"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-finance-green-500">
                                {getStrategyIcon(strategy.id)}
                              </div>
                              <div className="grid gap-1">
                                <p className="font-medium leading-none text-finance-gray-800 dark:text-white">
                                  {strategy.label}
                                </p>
                                <p className="text-sm text-finance-gray-600 dark:text-finance-gray-400">
                                  {strategy.description}
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        {/* Subopciones de brokers que aparecen cuando el tipo de inversión está seleccionado */}
                        {investmentType === strategy.id && (
                          <div className="ml-8 space-y-2 pl-4 border-l-2 border-finance-green-500 dark:border-finance-green-700">
                            <p className="text-sm font-medium text-finance-gray-700 dark:text-finance-gray-300 mb-2">
                              Brokers disponibles:
                            </p>
                            {strategy.brokers.map((broker) => (
                              <div 
                                key={broker.name}
                                onClick={() => handleBrokerChange(broker.name)}
                                className={`p-4 rounded-md cursor-pointer transition-all border ${
                                  selectedBroker === broker.name 
                                    ? 'border-finance-green-500 bg-finance-green-50 dark:bg-finance-green-900/20' 
                                    : 'border-finance-gray-200 dark:border-finance-gray-700 bg-white dark:bg-finance-gray-800 hover:border-finance-gray-300 dark:hover:border-finance-gray-600'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    {/* Placeholder para logo del broker - se puede reemplazar con imagen real */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-finance-gray-100 dark:bg-finance-gray-700 ${
                                      selectedBroker === broker.name ? 'border-2 border-finance-green-500' : ''
                                    }`}>
                                      {broker.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-finance-gray-800 dark:text-white">{broker.name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm font-semibold text-finance-green-600 dark:text-finance-green-400">
                                          {broker.annualRate}%
                                        </p>
                                        <span className="text-xs text-finance-gray-500 dark:text-finance-gray-400">
                                          anual
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {selectedBroker === broker.name && (
                                    <CheckCircle className="h-5 w-5 text-finance-green-500 ml-2" />
                                  )}
                                </div>
                                
                                <div className="mt-3 border-t border-finance-gray-200 dark:border-finance-gray-700 pt-3">
                                  <div className="flex justify-between mb-1">
                                    <p className="text-xs font-medium text-finance-gray-600 dark:text-finance-gray-400">
                                      Rendimiento mensual:
                                    </p>
                                    <p className="text-xs font-semibold text-finance-gray-800 dark:text-white">
                                      {(broker.annualRate / 12).toFixed(2)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                )}

                <div className="mt-4 p-4 bg-finance-green-500/10 dark:bg-finance-green-900/20 rounded-md border border-finance-green-200 dark:border-finance-green-900">
                  <p className="text-sm font-medium text-finance-gray-800 dark:text-white">
                    Tiempo estimado para alcanzar tu objetivo:
                  </p>
                  <p className="text-lg font-bold mt-1 text-finance-green-600 dark:text-finance-green-400">
                    {estimatedMonths} meses ({Math.floor(estimatedMonths / 12)} años y {estimatedMonths % 12} meses)
                  </p>
                  <p className="text-xs text-finance-gray-600 dark:text-finance-gray-300 mt-1">
                    Con aportes mensuales de {formatCurrency(monthlyContribution)} y un rendimiento del{" "}
                    {getSelectedAnnualRate()}% anual ({(getSelectedAnnualRate() / 12).toFixed(2)}% mensual)
                  </p>
                  {selectedBroker && (
                    <p className="text-xs text-finance-gray-600 dark:text-finance-gray-400 mt-1">
                      Broker seleccionado: <span className="font-medium">{selectedBroker}</span>
                    </p>
                  )}
                </div>

                <div className="bg-finance-gray-100 dark:bg-finance-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-finance-gray-800 dark:text-white">
                    Sobre los perfiles de inversión
                  </h4>
                  <div className="space-y-3 text-sm">
                    {investmentStrategies.map(strategy => (
                      <div key={strategy.id}>
                        <div className="font-medium flex items-center text-finance-gray-800 dark:text-white">
                          {getStrategyIcon(strategy.id)}
                          <span className="ml-2">{strategy.label}</span>
                        </div>
                        <p className="text-finance-gray-600 dark:text-finance-gray-300 ml-8">
                          {strategy.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={prevTab}
                  className="w-full sm:w-auto border-finance-green-500 text-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20"
                >
                  Atrás
                </Button>
                <Button onClick={nextTab} className="bg-finance-green-500 hover:bg-finance-green-600 text-white dark:text-finance-gray-800">
                  Continuar
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="summary" className="m-0 overflow-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-finance-gray-800 dark:text-white">Resumen de tu Plan</CardTitle>
                <CardDescription>Revisa la configuración de tu plan de inversión antes de comenzar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 overflow-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <h3 className="font-medium text-finance-gray-800 dark:text-white">Tipo de Objetivo</h3>
                      <div className="flex items-center gap-2">
                        <ObjectiveIcon className="h-5 w-5 text-finance-green-500" />
                        <p className="text-xl font-bold text-finance-gray-800 dark:text-white">
                          {objectiveType === "custom" && customObjectiveName
                            ? customObjectiveName
                            : OBJECTIVE_TYPES[objectiveType]?.name || "Personalizado"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <h3 className="font-medium text-finance-gray-800 dark:text-white">Objetivo Financiero</h3>
                      <p className="text-2xl font-bold text-finance-green-600 dark:text-finance-green-400">
                        {formatCurrency(targetAmount)}
                      </p>
                      {initialAmount > 0 && (
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                          Capital inicial: {formatCurrency(initialAmount)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <h3 className="font-medium text-finance-gray-800 dark:text-white">Estrategia de Inversión</h3>
                      <div className="flex items-center gap-2">
                        {selectedStrategy && getStrategyIcon(selectedStrategy.id)}
                        <p className="text-xl font-bold text-finance-gray-800 dark:text-white">
                          {selectedStrategy ? selectedStrategy.label : ""}
                        </p>
                      </div>
                      {selectedBroker && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-finance-gray-700 dark:text-finance-gray-300">
                            Broker seleccionado:
                          </p>
                          <div className="flex items-center mt-1 gap-2">
                            {/* Logo placeholder en el resumen */}
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-finance-gray-100 dark:bg-finance-gray-700 text-xs font-bold">
                              {selectedBroker.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-finance-gray-800 dark:text-white font-medium">{selectedBroker}</p>
                                <p className="text-sm text-finance-green-600 dark:text-finance-green-400">
                                  {getSelectedAnnualRate()}% anual
                                </p>
                              </div>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-500">
                                {(getSelectedAnnualRate() / 12).toFixed(2)}% rendimiento mensual
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <h3 className="font-medium text-finance-gray-800 dark:text-white">Aporte Mensual</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-finance-green-500" />
                        <p className="text-xl font-bold text-finance-green-600 dark:text-finance-green-400">
                          {formatCurrency(monthlyContribution)}
                        </p>
                      </div>
                      <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                        Este es el monto que planeas aportar cada mes a tu inversión.
                      </p>
                    </div>
                  </div>
            
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <h3 className="font-medium text-finance-gray-800 dark:text-white">Capital inicial</h3>
                      <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-finance-green-500" />
                          <p className="text-xl font-bold text-finance-green-600 dark:text-finance-green-400">
                            {formatCurrency(initialAmount)}
                          </p>
                        </div>
                    </div>
                    <div className="space-y-2 p-4 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-finance-gray-800 dark:text-white">Progreso Inicial</h3>
                        <span className="text-finance-green-600 dark:text-finance-green-400">{progress.toFixed(2)}%</span>
                      </div>
                      <div className="finance-progress-bar">
                        <div className="finance-progress-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-xl text-finance-gray-600 dark:text-finance-gray-300">
                        Tiempo estimado:
                      </p>
                      <p className="text-xl text-finance-green-600 dark:text-finance-green-400">
                        {estimatedMonths} meses ({Math.floor(estimatedMonths / 12)} años y{" "}
                        {estimatedMonths % 12} meses)
                      </p>
                    </div>
                  </div>


                  {/* Comparación entre invertir y no invertir */}
                  <div className="space-y-4 p-5 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                    <h3 className="font-medium text-lg text-finance-gray-800 dark:text-white">Comparativa de inversión vs. ahorro tradicional</h3>
                    
                    {/* Versión de escritorio - Tabla (se oculta en móviles) */}
                    <div className="hidden md:block overflow-x-auto rounded-lg border border-finance-gray-200 dark:border-finance-gray-700">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="bg-finance-gray-100 dark:bg-finance-gray-800 border-b border-finance-gray-200 dark:border-finance-gray-700">
                            <th className="px-4 py-3 text-left font-medium text-finance-gray-800 dark:text-white">Métrica</th>
                            <th className="px-4 py-3 text-left font-medium text-finance-green-600 dark:text-finance-green-400">Con inversión</th>
                            <th className="px-4 py-3 text-left font-medium text-finance-gray-600 dark:text-finance-gray-400">Sin inversión</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-finance-gray-200 dark:divide-finance-gray-700">
                          {/* Fila de tiempo */}
                          <tr className="bg-white dark:bg-finance-gray-900 hover:bg-finance-gray-50 dark:hover:bg-finance-gray-800/80">
                            <td className="px-4 py-4 text-finance-gray-800 dark:text-white font-medium">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-finance-gray-600 dark:text-finance-gray-400" />
                                Tiempo para alcanzar objetivo
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                {estimatedMonths} {estimatedMonths === 1 ? 'mes' : 'meses'}
                              </span>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                Con rendimiento del {getSelectedAnnualRate()}% anual ({(getSelectedAnnualRate() / 12).toFixed(2)}% mensual)
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-finance-gray-600 dark:text-finance-gray-400 font-medium">
                                {monthsWithoutInvesting === Infinity ? 
                                  "∞" : 
                                  `${monthsWithoutInvesting} meses`}
                              </span>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                Capital sin rendimiento en {estimatedMonths} {estimatedMonths === 1 ? 'mes' : 'meses'}
                              </p>
                            </td>
                          </tr>
                          
                          {/* Fila de valor acumulado */}
                          <tr className="bg-white dark:bg-finance-gray-900 hover:bg-finance-gray-50 dark:hover:bg-finance-gray-800/80">
                            <td className="px-4 py-4 text-finance-gray-800 dark:text-white font-medium">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2 text-finance-gray-600 dark:text-finance-gray-400" />
                                Valor acumulado
                              </div>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1 ml-6">
                                Capital total al alcanzar el objetivo
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                {formatCurrency(withInvestmentValue)}
                              </span>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                Con rendimiento del {getSelectedAnnualRate()}% anual e interes compuesto
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-finance-gray-600 dark:text-finance-gray-400 font-medium">
                                {formatCurrency(withoutInvestmentValue)}
                              </span>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                En {estimatedMonths} {estimatedMonths === 1 ? 'm' : 'm'} sin rendimiento
                              </p>
                            </td>
                          </tr>
                          
                          {/* Fila de aporte del mercado */}
                          <tr className="bg-white dark:bg-finance-gray-900 hover:bg-finance-gray-50 dark:hover:bg-finance-gray-800/80">
                            <td className="px-4 py-4 text-finance-gray-800 dark:text-white font-medium">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2 text-finance-green-500" />
                                Rendimiento acumulado
                              </div>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1 ml-6">
                                Lo que aporta el mercado
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              {investmentReturn > 0 ? (
                                <>
                                  <span className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                    {formatCurrency(investmentReturn)}
                                  </span>
                                  <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                    <span className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                      {investmentReturnPercentage.toFixed(1)}%
                                    </span> del capital acumulado
                                  </p>
                                  <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                    Generado en {estimatedMonths} {estimatedMonths === 1 ? 'mes' : 'meses'}
                                  </p>
                                </>
                              ) : (
                                <span className="text-finance-gray-600 dark:text-finance-gray-400">
                                  Sin rendimiento acumulado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-finance-gray-600 dark:text-finance-gray-400">
                                $0
                              </span>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                0% del capital
                              </p>
                              <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                                Sin intereses ni rendimiento
                              </p>
                            </td>
                          </tr>
                          
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Versión móvil - Tarjetas comparativas (se muestran solo en móviles) */}
                    <div className="md:hidden space-y-4 mt-3">
                      {/* Tarjeta de tiempo */}
                      <div className="rounded-lg border border-finance-gray-200 dark:border-finance-gray-700 overflow-hidden">
                        <div className="p-3 bg-finance-gray-100 dark:bg-finance-gray-800 border-b border-finance-gray-200 dark:border-finance-gray-700 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-finance-gray-600 dark:text-finance-gray-400" />
                          <h5 className="font-medium text-finance-gray-800 dark:text-white">Tiempo para alcanzar objetivo</h5>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-finance-gray-200 dark:divide-finance-gray-700">
                          <div className="p-3">
                            <div className="flex items-center mb-1">
                              <span className="w-3 h-3 rounded-full bg-finance-green-500 mr-2"></span>
                              <span className="text-xs font-medium text-finance-gray-600 dark:text-finance-gray-300">Con inversión</span>
                            </div>
                            <p className="text-lg font-medium text-finance-green-600 dark:text-finance-green-400">
                              {estimatedMonths} {estimatedMonths === 1 ? 'm' : 'm'}
                            </p>
                            <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400">
                              {(getSelectedAnnualRate() / 12).toFixed(1)}% mensual
                            </p>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center mb-1">
                              <span className="w-3 h-3 rounded-full bg-finance-gray-400 mr-2"></span>
                              <span className="text-xs font-medium text-finance-gray-600 dark:text-finance-gray-300">Sin inversión</span>
                            </div>
                            <p className="text-lg font-medium text-finance-gray-600 dark:text-finance-gray-400">
                              {monthsWithoutInvesting === Infinity ? "∞" : `${monthsWithoutInvesting} m`}
                            </p>
                            <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400">
                              0% rendimiento
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tarjeta de capital acumulado */}
                      <div className="rounded-lg border border-finance-gray-200 dark:border-finance-gray-700 overflow-hidden">
                        <div className="p-3 bg-finance-gray-100 dark:bg-finance-gray-800 border-b border-finance-gray-200 dark:border-finance-gray-700 flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-finance-gray-600 dark:text-finance-gray-400" />
                          <h5 className="font-medium text-finance-gray-800 dark:text-white">
                            Capital al alcanzar objetivo
                          </h5>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-finance-gray-200 dark:divide-finance-gray-700">
                          <div className="p-3">
                            <div className="flex items-center mb-1">
                              <span className="w-3 h-3 rounded-full bg-finance-green-500 mr-2"></span>
                              <span className="text-xs font-medium text-finance-gray-600 dark:text-finance-gray-300">Con inversión</span>
                            </div>
                            <p className="text-base font-medium text-finance-green-600 dark:text-finance-green-400">
                              {formatCurrency(withInvestmentValue).replace('ARS ', '$')}
                            </p>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center mb-1">
                              <span className="w-3 h-3 rounded-full bg-finance-gray-400 mr-2"></span>
                              <span className="text-xs font-medium text-finance-gray-600 dark:text-finance-gray-300">Sin inversión</span>
                            </div>
                            <p className="text-base font-medium text-finance-gray-600 dark:text-finance-gray-400">
                              {formatCurrency(withoutInvestmentValue).replace('ARS ', '$')}
                            </p>
                            <p className="text-xs text-finance-gray-500 dark:text-finance-gray-400 mt-1">
                              En {estimatedMonths} {estimatedMonths === 1 ? 'm' : 'm'} sin rendimiento
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tarjeta de rendimiento */}
                      <div className="rounded-lg border border-finance-gray-200 dark:border-finance-gray-700 overflow-hidden">
                        <div className="p-3 bg-finance-gray-100 dark:bg-finance-gray-800 border-b border-finance-gray-200 dark:border-finance-gray-700 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-finance-green-500" />
                          <h5 className="font-medium text-finance-gray-800 dark:text-white">Rendimiento generado</h5>
                        </div>
                        <div className="p-3 space-y-2">
                          {investmentReturn > 0 ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-finance-gray-600 dark:text-finance-gray-300">Ganancia:</span>
                                <span className="text-finance-green-600 dark:text-finance-green-400 font-bold">
                                  {formatCurrency(investmentReturn).replace('ARS ', '$')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-finance-gray-600 dark:text-finance-gray-300">Porcentaje:</span>
                                <span className="text-finance-green-600 dark:text-finance-green-400 font-bold">
                                  {investmentReturnPercentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-finance-gray-600 dark:text-finance-gray-300">vs Ahorro:</span>
                                <span className="text-finance-green-600 dark:text-finance-green-400 font-bold">
                                  +{comparisonPercentage.toFixed(1)}%
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-2 text-finance-gray-600 dark:text-finance-gray-400">
                              Sin rendimiento acumulado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Resumen de beneficios - Versión responsiva para todos los dispositivos */}
                    <div className="mt-5 p-4 bg-finance-green-500/10 dark:bg-finance-green-900/20 rounded-lg">
                      <h4 className="text-finance-gray-800 dark:text-white font-medium mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-finance-green-500" />
                        Beneficios de invertir en {estimatedMonths} {estimatedMonths === 1 ? 'mes' : 'meses'}
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Beneficio de rendimiento */}
                        {investmentReturn > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                              <span className="font-medium text-finance-gray-700 dark:text-finance-gray-300">
                                Ganancias adicionales:
                              </span>
                            </div>
                            <div className="w-full sm:w-2/3">
                              <p className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                {formatCurrency(investmentReturn)}
                              </p>
                              <p className="text-xs text-finance-gray-600 dark:text-finance-gray-300 mt-1">
                                El mercado aporta un {investmentReturnPercentage.toFixed(1)}% de tu capital acumulado
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Diferencia de rendimiento */}
                        {investmentReturn > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                              <span className="font-medium text-finance-gray-700 dark:text-finance-gray-300">
                                Diferencia de capital:
                              </span>
                            </div>
                            <div className="w-full sm:w-2/3">
                              <p className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                +{comparisonPercentage.toFixed(1)}%
                              </p>
                              <p className="text-xs text-finance-gray-600 dark:text-finance-gray-300 mt-1">
                                Tu dinero crece un {comparisonPercentage.toFixed(1)}% más rápido invirtiendo
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Equivalencia en aportes */}
                        {investmentReturn > 0 && monthlyContribution > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                              <span className="font-medium text-finance-gray-700 dark:text-finance-gray-300">
                                Ahorro de aportes:
                              </span>
                            </div>
                            <div className="w-full sm:w-2/3">
                              <p className="text-finance-green-600 dark:text-finance-green-400 font-medium">
                                {Math.round(investmentReturn / monthlyContribution)} aportes mensuales
                              </p>
                              <p className="text-xs text-finance-gray-600 dark:text-finance-gray-300 mt-1">
                                Equivale a {formatCurrency(investmentReturn)} que no tendrás que aportar
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Mensaje cuando no hay beneficios */}
                        {investmentReturn <= 0 && (
                          <p className="text-finance-gray-700 dark:text-finance-gray-300">
                            En períodos muy cortos, los beneficios de la inversión pueden no ser significativos.
                            Intenta seleccionar un período más largo para ver el verdadero impacto del rendimiento compuesto.
                          </p>
                        )}

                        <p className="text-finance-gray-700 dark:text-finance-gray-300">
                          <strong>Nota:</strong> Este cálculo es una estimación y puede variar según el rendimiento real de la inversión, inflación, etc. Esto es solo un ejercicio
                          de planificación y no una recomendación de inversión pero muestra el poder del interés compuesto en un escenario ideal a largo plazo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sección de contacto para asesoramiento */}
                  <div className="space-y-4 p-5 border border-finance-gray-200 dark:border-finance-gray-700 rounded-lg bg-white dark:bg-finance-gray-800">
                    {/* Cabecera con título y texto introductorio */}
                    <div>
                      <h3 className="font-medium text-lg text-finance-gray-800 dark:text-white">¿Necesitas asesoramiento profesional?</h3>
                      {!showContactForm && !contactSubmitted && (
                        <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300 mt-1 mb-4">
                          Elige quién prefieres que te asesore para recibir ayuda personalizada con tu estrategia de inversión.
                        </p>
                      )}
                    </div>
                    
                    {/* Tarjetas de asesores (visibles cuando no se muestra el formulario ni está enviado) */}
                    {!showContactForm && !contactSubmitted && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          onClick={() => {
                            setSelectedAdvisor('fede');
                            setShowContactForm(true);
                          }}
                          className="p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center border-finance-gray-200 dark:border-finance-gray-700 hover:border-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20"
                        >
                          <div className="w-16 h-16 rounded-full bg-finance-gray-200 dark:bg-finance-gray-700 flex-shrink-0 overflow-hidden">
                            {/* Placeholder para foto de Fede - reemplazar con imagen real */}
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-finance-gray-500 dark:text-finance-gray-300">
                              F
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-finance-gray-800 dark:text-white">Fede</h4>
                            <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                              Especialista en inversiones con 8 años de experiencia en mercados financieros.
                            </p>
                            <p className="text-xs mt-1 text-finance-green-600 dark:text-finance-green-400 flex items-center">
                              <ArrowRight className="h-3 w-3 mr-1" /> 
                              Contactar con Fede
                            </p>
                          </div>
                        </div>
                        
                        <div 
                          onClick={() => {
                            setSelectedAdvisor('tatiana');
                            setShowContactForm(true);
                          }}
                          className="p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center border-finance-gray-200 dark:border-finance-gray-700 hover:border-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20"
                        >
                          <div className="w-16 h-16 rounded-full bg-finance-gray-200 dark:bg-finance-gray-700 flex-shrink-0 overflow-hidden">
                            {/* Placeholder para foto de Tatiana - reemplazar con imagen real */}
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-finance-gray-500 dark:text-finance-gray-300">
                              T
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-finance-gray-800 dark:text-white">Tatiana</h4>
                            <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300">
                              Asesora financiera certificada con enfoque en planificación personal y objetivos.
                            </p>
                            <p className="text-xs mt-1 text-finance-green-600 dark:text-finance-green-400 flex items-center">
                              <ArrowRight className="h-3 w-3 mr-1" /> 
                              Contactar con Tatiana
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Formulario de contacto */}
                    {showContactForm && !contactSubmitted && (
                      <div className="mt-2">
                        <div className="flex items-center mb-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setShowContactForm(false);
                              setSelectedAdvisor("");
                            }}
                            className="mr-3"
                          >
                            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                            Volver
                          </Button>
                          
                          <p className="text-sm font-medium text-finance-gray-700 dark:text-finance-gray-300">
                            Déjanos tus datos para que {selectedAdvisor === 'fede' ? 'Fede' : 'Tatiana'} se ponga en contacto contigo
                          </p>
                        </div>
                        
                        <div className="flex items-center mb-6 px-4 py-3 bg-finance-green-50 dark:bg-finance-green-900/20 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-finance-gray-200 dark:bg-finance-gray-700 flex-shrink-0 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-finance-gray-500 dark:text-finance-gray-300">
                              {selectedAdvisor === 'fede' ? 'F' : 'T'}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-finance-gray-800 dark:text-white">
                              {selectedAdvisor === 'fede' ? 'Fede' : 'Tatiana'}
                            </p>
                            <p className="text-xs text-finance-gray-600 dark:text-finance-gray-400">
                              {selectedAdvisor === 'fede' 
                                ? 'Especialista en inversiones' 
                                : 'Asesora financiera certificada'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact-email" className="text-finance-gray-800 dark:text-white">
                              Correo electrónico
                            </Label>
                            <Input
                              id="contact-email"
                              type="email"
                              placeholder="tu@email.com"
                              value={contactEmail}
                              onChange={handleEmailChange}
                              disabled={contactSubmitted || submitting}
                              className="finance-input"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contact-phone" className="text-finance-gray-800 dark:text-white">
                              Teléfono (opcional)
                            </Label>
                            <Input
                              id="contact-phone"
                              type="tel"
                              placeholder="+54 9 11 1234-5678"
                              value={contactPhone}
                              onChange={handlePhoneChange}
                              disabled={contactSubmitted || submitting}
                              className="finance-input"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 mt-4">
                          <Label htmlFor="contact-message" className="text-finance-gray-800 dark:text-white">
                            ¿Algo específico que quieras consultar? (opcional)
                          </Label>
                          <Input
                            id="contact-message"
                            placeholder="Escribe tu consulta aquí..."
                            value={contactMessage}
                            onChange={handleMessageChange}
                            disabled={contactSubmitted || submitting}
                            className="finance-input"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4">
                          <input 
                            type="checkbox" 
                            id="terms-consent" 
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                            disabled={contactSubmitted || submitting}
                            className="rounded border-finance-gray-300 dark:border-finance-gray-600 text-finance-green-500 focus:ring-finance-green-500"
                          />
                          <Label 
                            htmlFor="terms-consent" 
                            className="text-sm text-finance-gray-600 dark:text-finance-gray-300"
                          >
                            Acepto recibir información sobre servicios financieros y que mis datos sean compartidos con asesores profesionales.
                          </Label>
                        </div>
                        
                        <div className="flex justify-end pt-4 mt-4">
                          <Button 
                            onClick={submitContactForm}
                            disabled={!contactEmail || !termsAccepted || !selectedAdvisor || submitting}
                            className={`${
                              !contactEmail || !termsAccepted || !selectedAdvisor
                                ? 'bg-finance-gray-300 dark:bg-finance-gray-700 cursor-not-allowed' 
                                : 'bg-finance-green-500 hover:bg-finance-green-600'
                            } text-white dark:text-finance-gray-800 flex items-center justify-center`}
                          >
                            {submitting ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-finance-gray-800 border-t-transparent" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Enviar información de contacto
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Mensaje de confirmación */}
                    {contactSubmitted && (
                      <div className="p-5 bg-finance-green-100 dark:bg-finance-green-900/20 rounded-md text-finance-green-800 dark:text-finance-green-300">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-6 w-6 mr-2 text-finance-green-600 dark:text-finance-green-400" />
                          <h4 className="font-medium text-finance-green-800 dark:text-finance-green-300">
                            ¡Gracias por tu interés!
                          </h4>
                        </div>
                        <p className="ml-8">
                          {selectedAdvisor === 'fede' 
                            ? 'Fede se pondrá en contacto contigo pronto para ayudarte con tu plan de inversión.'
                            : 'Tatiana se pondrá en contacto contigo pronto para ayudarte con tu plan de inversión.'}
                        </p>
                      </div>
                    )}
                    
                    {/* Opción de ir directamente al broker */}
                    {selectedBroker && (
                      <div className={`${contactSubmitted ? 'mt-5' : (showContactForm ? 'mt-5 pt-5 border-t border-finance-gray-200 dark:border-finance-gray-700' : 'mt-0')}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <p className="text-sm text-finance-gray-700 dark:text-finance-gray-300">
                            ¿Prefieres contactar directamente con <span className="font-medium">{selectedBroker}</span>?
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={redirectToBroker}
                            className="w-full sm:w-auto border-finance-green-500 text-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20 flex items-center justify-center"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Ir a la plataforma
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabla 2: Crecimiento exponencial a lo largo del tiempo */}
                <div className="mt-8">
                  <h4 className="font-medium text-finance-gray-800 dark:text-white mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-finance-green-500" />
                    Crecimiento exponencial de tu inversión
                  </h4>
                  
                  {/* Botones de selección de período */}
                 
                  
                  {/* Tarjeta interactiva única */}
                  <InvestmentProjectionCard
                    selectedPeriod={selectedPeriod}
                    estimatedMonths={estimatedMonths}
                    calculateForPeriod={calculateForPeriod}
                    initialAmount={initialAmount}
                    monthlyContribution={monthlyContribution}
                    getSelectedAnnualRate={getSelectedAnnualRate}
                    formatCurrency={formatCurrency}
                  />
                  
                  <div className="mt-4 p-4 bg-finance-yellow-50 dark:bg-finance-yellow-900/20 rounded-md border border-finance-yellow-200 dark:border-finance-yellow-900 text-sm">
                    <p className="text-finance-gray-700 dark:text-finance-gray-300 flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-finance-yellow-500" />
                      <span className="font-medium">Importante:</span> Estos cálculos son proyecciones basadas en:
                    </p>
                    <ul className="ml-6 mt-2 list-disc space-y-1 text-finance-gray-600 dark:text-finance-gray-400">
                      <li>Una tasa de interés constante del {getSelectedAnnualRate()}% anual</li>
                      <li>Aportes mensuales regulares de {formatCurrency(monthlyContribution)}</li>
                      <li>No se considera la inflación del peso argentino ni del dólar</li>
                      <li>No se contemplan posibles cambios en las condiciones del mercado</li>
                    </ul>
                    <p className="mt-2 text-finance-gray-600 dark:text-finance-gray-400">
                      El crecimiento exponencial se hace más evidente en períodos largos debido al interés compuesto.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={prevTab}
                  className="w-full sm:w-auto border-finance-green-500 text-finance-green-500 hover:bg-finance-green-50 dark:hover:bg-finance-green-900/20"
                >
                  Atrás
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="w-full sm:w-auto bg-finance-green-500 hover:bg-finance-green-600 text-white dark:text-finance-gray-800 flex items-center justify-center"
                >
                  {selectedBroker ? (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      <span className="text-sm sm:text-base">Ir a {selectedBroker}</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Solicitar asesoramiento
                    </>
                  )}
                </Button>
              </CardFooter>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
