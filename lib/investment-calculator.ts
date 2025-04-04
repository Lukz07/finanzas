export interface InvestmentConfig {
  targetAmount: number
  monthlyContribution: number
  monthlyInterestRate: number
  usdEquivalent?: number
}

export function calcularMesesParaObjetivo(initialAmount: number, objetivo: number, aporteMensual: any, tasaMensual: number) {  
  let saldo = initialAmount || 0;
  let meses = 0;
  let totalAportado = 0;

  while (saldo < objetivo) {
    saldo += aporteMensual;
    saldo *= (1 + tasaMensual);
    totalAportado += aporteMensual;
    meses++;
  }

  const gananciaPorInteres = saldo - totalAportado;

  return {
    meses,
    totalAportado,
    gananciaPorInteres,
    saldoFinal: saldo
  };

}

export function calculateInvestmentProgress(
  config: InvestmentConfig,
  maxMonths = 60,
  completedContributions: number[] = [],
  initialAmount = 0,
) {
  const { targetAmount, monthlyContribution, monthlyInterestRate } = config

  // Validar que el objetivo no sea cero para evitar divisiones por cero
  const validTargetAmount = targetAmount > 0 ? targetAmount : 1

  // Comenzamos con el monto inicial proporcionado
  let currentAmount = initialAmount
  let monthsToTarget = 0
  let reachedTarget = false
  const monthlyData = []

  // Si el monto inicial ya alcanza o supera el objetivo, no se necesitan meses adicionales
  if (initialAmount >= validTargetAmount) {
    monthsToTarget = 0
    reachedTarget = true
    
    // Añadir el mes inicial para mostrar los datos
    monthlyData.push({
      month: 0,
      previousAmount: initialAmount,
      interestEarned: 0,
      contribution: 0,
      totalAmount: initialAmount,
      hasContribution: false,
      progressPercentage: 100,
    })
    
    return {
      currentAmount: initialAmount,
      monthsToTarget: 0,
      progressPercentage: 100,
      monthlyData,
      totalContributions: 0,
      completedMonths: 0,
      exactMonthsNeeded: 0,
    }
  }

  // Si no hay tasa de interés y no hay aportes mensuales, es imposible alcanzar el objetivo
  if (monthlyInterestRate === 0 && monthlyContribution === 0) {
    return {
      currentAmount: initialAmount,
      monthsToTarget: Infinity,
      progressPercentage: (initialAmount / validTargetAmount) * 100,
      monthlyData: [],
      totalContributions: 0,
      completedMonths: 0,
      exactMonthsNeeded: Infinity,
    }
  }

  // Si no hay tasa de interés, pero hay aportes mensuales, es una simple división
  if (monthlyInterestRate === 0 && monthlyContribution > 0) {
    const remainingAmount = validTargetAmount - initialAmount
    const exactMonthsNeeded = Math.ceil(remainingAmount / monthlyContribution)
    
    // Calcular brevemente los meses para el resultado
    for (let month = 1; month <= Math.min(exactMonthsNeeded, maxMonths); month++) {
      const hasContribution = completedContributions.includes(month)
      const contribution = hasContribution ? monthlyContribution : monthlyContribution
      currentAmount += contribution
      
      const progressPercentage = Math.min((currentAmount / validTargetAmount) * 100, 100)
      
      monthlyData.push({
        month,
        previousAmount: currentAmount - contribution,
        interestEarned: 0,
        contribution,
        totalAmount: currentAmount,
        hasContribution,
        progressPercentage,
      })
      
      if (!reachedTarget && currentAmount >= validTargetAmount) {
        monthsToTarget = month
        reachedTarget = true
      }
    }
    
    return {
      currentAmount,
      monthsToTarget: exactMonthsNeeded,
      progressPercentage: Math.min((currentAmount / validTargetAmount) * 100, 100),
      monthlyData,
      totalContributions: completedContributions.length * monthlyContribution,
      completedMonths: completedContributions.length,
      exactMonthsNeeded,
    }
  }

  // Calcular los meses necesarios para alcanzar el objetivo usando la simulación
  let simulatedAmount = initialAmount
  let exactMonthsNeeded = 0
  
  while (simulatedAmount < validTargetAmount && exactMonthsNeeded < 1000) {
    exactMonthsNeeded++
    
    // Primero aplicar interés al capital acumulado
    const interestEarned = simulatedAmount * monthlyInterestRate
    
    // Luego sumar la contribución mensual
    simulatedAmount = simulatedAmount + interestEarned + monthlyContribution
  }

  // Asegurarse de que solo se calculen los meses necesarios para alcanzar el objetivo
  const monthsToCalculate = Math.min(Math.max(exactMonthsNeeded, 1), maxMonths)

  // Resetear el monto para calcular el progreso mes a mes
  currentAmount = initialAmount

  // Calcular el progreso mes a mes hasta alcanzar el objetivo o el máximo de meses
  for (let month = 1; month <= monthsToCalculate; month++) {
    // Verificar si este mes tiene un aporte confirmado
    const hasContribution = completedContributions.includes(month)
    
    // Calcular el interés generado este mes (antes de agregar la contribución)
    const interestEarned = currentAmount * monthlyInterestRate
    
    // Sumar el interés generado
    currentAmount = currentAmount + interestEarned
    
    // Sumar el aporte mensual si corresponde
    const contribution = hasContribution ? monthlyContribution : monthlyContribution
    currentAmount = currentAmount + contribution

    // Calcular el porcentaje de progreso
    const progressPercentage = Math.min((currentAmount / validTargetAmount) * 100, 100)

    // Guardar los datos de este mes
    monthlyData.push({
      month,
      previousAmount: currentAmount - interestEarned - contribution,
      interestEarned,
      contribution,
      totalAmount: currentAmount,
      hasContribution,
      progressPercentage,
    })

    // Verificar si se alcanzó el objetivo
    if (!reachedTarget && currentAmount >= validTargetAmount) {
      monthsToTarget = month
      reachedTarget = true
    }
  }

  // Si no se alcanzó el objetivo en el número máximo de meses, calcular cuántos meses más se necesitarían
  if (!reachedTarget) {
    let month = monthsToCalculate
    while (currentAmount < validTargetAmount && month < 1000) {
      month++
      
      // Primero calcular el interés generado este mes
      const interestEarned = currentAmount * monthlyInterestRate
      
      // Sumar el interés generado
      currentAmount = currentAmount + interestEarned
      
      // Luego sumar el aporte mensual
      currentAmount = currentAmount + monthlyContribution

      if (currentAmount >= validTargetAmount) {
        monthsToTarget = month
        break
      }
    }
  }

  // Calcular el porcentaje de progreso actual
  const progressPercentage = Math.min((currentAmount / validTargetAmount) * 100, 100)

  // Calcular el total de aportes realizados
  const totalContributions = completedContributions.length * monthlyContribution

  return {
    currentAmount,
    monthsToTarget: reachedTarget ? monthsToTarget : exactMonthsNeeded,
    progressPercentage,
    monthlyData,
    totalContributions,
    completedMonths: completedContributions.length,
    exactMonthsNeeded,
  }
}

export function formatNumberWithSeparators(number: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
}

