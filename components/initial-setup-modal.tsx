"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, PlusCircle, CheckCircle, TrendingUp, ShieldAlert, ShieldCheck } from "lucide-react"
import { format, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Actualizar el tipo para que sea un string en lugar de una unión literal
export type InvestmentType = string;

// Definir la estructura de los tipos de inversión para referencia
interface InvestmentTypeDefinition {
  label: string;
  icon: React.ReactNode;
  brokers: Array<{
    name: string;
    annualRate: number;
    monthlyRate: number;
  }>;
}

// Mantener esto como referencia temporal hasta que todos los componentes sean actualizados
// Este objeto ya no se usa directamente, ahora los datos vienen de Google Sheets
export const INVESTMENT_TYPES: Record<string, InvestmentTypeDefinition> = {
  very_conservative: {
    label: "Muy conservadora",
    icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
    brokers: [
      { name: "Mercado Pago", annualRate: 52, monthlyRate: 52/12 },
      { name: "Personal Pay", annualRate: 50, monthlyRate: 50/12 },
      { name: "Uala", annualRate: 49, monthlyRate: 49/12 },
    ]
  },
  conservative: {
    label: "Conservadora",
    icon: <ShieldAlert className="h-5 w-5 text-green-500" />,
    brokers: [
      { name: "Bull Market", annualRate: 62, monthlyRate: 62/12 },
      { name: "Cocos Capital", annualRate: 60, monthlyRate: 60/12 },
    ]
  },
  moderate: {
    label: "Moderada",
    icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
    brokers: [
      { name: "IOL", annualRate: 72, monthlyRate: 72/12 },
      { name: "Balanz", annualRate: 68, monthlyRate: 68/12 },
    ]
  },
};

interface InitialSetupModalProps {
  isOpen: boolean
  onClose: (data: {
    initialAmount: number
    targetAmount: number
    completedContributions: number[]
    lastContributionDate: string | null
    startDate: string
    investmentType: InvestmentType
    selectedBroker?: string
  }) => void
  config: {
    baseTargetAmount: number
    monthlyContribution: number
  }
}

export default function InitialSetupModal({ isOpen, onClose, config }: InitialSetupModalProps) {
  const [step, setStep] = useState(1)
  const [initialAmount, setInitialAmount] = useState(0)
  const [targetAmount, setTargetAmount] = useState(config.baseTargetAmount)
  const [completedContributions, setCompletedContributions] = useState<number[]>([])
  const [startMonth, setStartMonth] = useState<string>("")
  const [investmentType, setInvestmentType] = useState<InvestmentType>("moderate")
  const [selectedBroker, setSelectedBroker] = useState<string>("")

  // Obtener el mes actual - memoizado para evitar recreaciones
  const currentDate = useMemo(() => new Date(), []);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  // Crear un array con los últimos 24 meses para seleccionar el mes de inicio
  const last24Months = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const date = subMonths(currentDate, i)
      const formattedDate = format(date, "yyyy-MM")
      const label = format(date, "MMMM yyyy", { locale: es })

      return {
        value: formattedDate,
        label: label,
        date,
      }
    })
  }, [currentDate])

  // Crear un array con los últimos 12 meses - memoizado para evitar recreaciones
  const last12Months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthIndex = currentDate.getMonth() - i
      const year = currentYear + Math.floor(monthIndex / 12)
      const month = ((monthIndex % 12) + 12) % 12 // Asegura que sea positivo
      return {
        month: month + 1, // Convertir a 1-12
        year,
        label: format(new Date(year, month, 1), "MMMM yyyy", { locale: es }),
        index: i + 1, // Para identificar el mes en la lista (1-12)
      }
    })
  }, [currentDate, currentYear])

  const handleInitialAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInitialAmount(value ? Number.parseInt(value) : 0)
  }, [])

  const handleTargetAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "")
      setTargetAmount(value ? Number.parseInt(value) : config.baseTargetAmount)
    },
    [config.baseTargetAmount],
  )

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)
  }, [])

  const toggleContribution = useCallback((monthIndex: number) => {
    setCompletedContributions((prev) => {
      if (prev.includes(monthIndex)) {
        return prev.filter((m) => m !== monthIndex)
      } else {
        return [...prev, monthIndex].sort((a, b) => a - b)
      }
    })
  }, [])

  const handleStartMonthChange = useCallback((value: string) => {
    setStartMonth(value)
  }, [])

  const handleInvestmentTypeChange = useCallback((value: InvestmentType) => {
    setInvestmentType(value)
  }, [])

  const handleBrokerChange = useCallback((value: string) => {
    setSelectedBroker(value);
  }, []);

  const handleSubmit = useCallback(() => {
    // Si no se seleccionó un mes de inicio, usar el mes actual
    const finalStartDate = startMonth || format(currentDate, "yyyy-MM")

    const result = {
      initialAmount,
      targetAmount: targetAmount || config.baseTargetAmount,
      completedContributions,
      lastContributionDate: completedContributions.length > 0 ? new Date().toISOString() : null,
      startDate: finalStartDate,
      investmentType,
      selectedBroker,
    }

    onClose(result)

    // Resetear el estado para la próxima vez que se abra el modal
    setTimeout(() => {
      setStep(1)
      setInitialAmount(0)
      setTargetAmount(config.baseTargetAmount)
      setCompletedContributions([])
      setStartMonth("")
      setInvestmentType("moderate")
      setSelectedBroker("")
    }, 100)
  }, [
    initialAmount,
    targetAmount,
    completedContributions,
    startMonth,
    investmentType,
    selectedBroker,
    onClose,
    currentDate,
    config.baseTargetAmount,
  ])

  // Calcular el progreso - función pura para evitar efectos secundarios
  const progress = useMemo(() => {
    const contributionsAmount = completedContributions.length * config.monthlyContribution
    const totalAmount = initialAmount + contributionsAmount
    return (totalAmount / (targetAmount || config.baseTargetAmount)) * 100
  }, [initialAmount, completedContributions.length, config.monthlyContribution, targetAmount, config.baseTargetAmount])

  // Calcular el tiempo estimado basado en el tipo de inversión
  const estimatedMonths = useMemo(() => {
    // Seleccionar el broker con la mayor tasa o usar el primero si no hay seleccionado
    const brokers = INVESTMENT_TYPES[investmentType].brokers;
    const broker = selectedBroker 
      ? brokers.find(b => b.name === selectedBroker) 
      : brokers.reduce((prev, current) => (prev.annualRate > current.annualRate) ? prev : current);
    
    const monthlyRate = broker ? broker.monthlyRate : brokers[0].monthlyRate;
    const monthlyContribution = config.monthlyContribution
    const target = targetAmount || config.baseTargetAmount
    const initial = initialAmount

    // Fórmula simplificada para estimar meses
    let months = 0
    let accumulated = initial

    while (accumulated < target) {
      accumulated = accumulated * (1 + monthlyRate) + monthlyContribution
      months++
    }

    return months
  }, [investmentType, selectedBroker, config.monthlyContribution, targetAmount, config.baseTargetAmount, initialAmount])

  // Obtener la tasa anual seleccionada
  const getSelectedAnnualRate = useCallback(() => {
    const brokers = INVESTMENT_TYPES[investmentType].brokers;
    if (selectedBroker) {
      const broker = brokers.find(b => b.name === selectedBroker);
      return broker ? broker.annualRate : brokers[0].annualRate;
    }
    // Si no hay broker seleccionado, usar la tasa más alta
    return brokers.reduce((prev, current) => 
      (prev.annualRate > current.annualRate) ? prev : current
    ).annualRate;
  }, [investmentType, selectedBroker]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 1 ? "Configura tu objetivo" : "Registra tus aportes anteriores"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Define tu objetivo financiero y estrategia de inversión"
              : "Selecciona los meses en los que ya realizaste aportes"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Objetivo financiero</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="targetAmount"
                  placeholder={config.baseTargetAmount.toString()}
                  value={targetAmount === config.baseTargetAmount ? "" : targetAmount}
                  onChange={handleTargetAmountChange}
                  className="text-right"
                />
                <span className="text-sm text-muted-foreground">ARS</span>
              </div>
              <p className="text-sm text-muted-foreground">Este es el monto que necesitas para tu casa propia.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialAmount">Capital inicial</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="initialAmount"
                  placeholder="0"
                  value={initialAmount === 0 ? "" : initialAmount}
                  onChange={handleInitialAmountChange}
                  className="text-right"
                />
                <span className="text-sm text-muted-foreground">ARS</span>
              </div>
              {initialAmount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Esto representa aproximadamente el{" "}
                  {((initialAmount / (targetAmount || config.baseTargetAmount)) * 100).toFixed(2)}% de tu objetivo.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startMonth">¿Cuándo comenzaste tu inversión?</Label>
              <Select value={startMonth} onValueChange={handleStartMonthChange}>
                <SelectTrigger id="startMonth">
                  <SelectValue placeholder="Selecciona el mes de inicio" />
                </SelectTrigger>
                <SelectContent>
                  {last24Months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Este será el mes 1 de tu plan de inversión.</p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de inversión</Label>
              <RadioGroup
                value={investmentType}
                onValueChange={(value) => handleInvestmentTypeChange(value as InvestmentType)}
                className="grid grid-cols-1 gap-4 pt-2"
              >
                {Object.entries(INVESTMENT_TYPES).map(([key, data]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`investment-${key}`} className="peer sr-only" />
                    <Label
                      htmlFor={`investment-${key}`}
                      className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-2">
                        {data.icon}
                        <div className="grid gap-1">
                          <p className="font-medium leading-none">{data.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Brokers: {data.brokers.map(b => b.name).join(", ")}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {/* Selección de broker */}
              <div className="mt-4">
                <Label htmlFor="broker">Selecciona un broker</Label>
                <Select value={selectedBroker} onValueChange={handleBrokerChange}>
                  <SelectTrigger id="broker">
                    <SelectValue placeholder="Selecciona un broker" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_TYPES[investmentType].brokers.map((broker) => (
                      <SelectItem key={broker.name} value={broker.name}>
                        {broker.name} - {broker.annualRate}% anual
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Tiempo estimado para alcanzar tu objetivo:</p>
                <p className="text-lg font-bold mt-1">
                  {estimatedMonths} meses ({Math.floor(estimatedMonths / 12)} años y {estimatedMonths % 12} meses)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Con aportes mensuales de {formatCurrency(config.monthlyContribution)} y un rendimiento del{" "}
                  {getSelectedAnnualRate()}% anual
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => setStep(2)} className="w-full">
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Selecciona los meses en los que ya realizaste aportes:</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {last12Months.map((monthData) => (
                  <Card
                    key={monthData.index}
                    className={`cursor-pointer transition-all ${
                      completedContributions.includes(monthData.index)
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground"
                    }`}
                    onClick={() => toggleContribution(monthData.index)}
                  >
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{monthData.label}</span>
                      </div>
                      {completedContributions.includes(monthData.index) ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <PlusCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span>Resumen:</span>
                <span>{completedContributions.length} aportes registrados</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monto inicial:</span>
                <span>{formatCurrency(initialAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Aportes registrados:</span>
                <span>{formatCurrency(completedContributions.length * config.monthlyContribution)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total acumulado:</span>
                <span>
                  {formatCurrency(initialAmount + completedContributions.length * config.monthlyContribution)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Progreso hacia el objetivo:</span>
                <span>{progress.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button variant="outline" onClick={() => handleSubmit()}>
              Omitir
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button onClick={handleSubmit}>Comenzar</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
