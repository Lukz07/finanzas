import { Home, Car, Plane, BikeIcon as Motorcycle, Target } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Tipo para los logros
export interface Achievement {
  threshold: number // Porcentaje del objetivo (0-100)
  title: string
  description: string
  icon?: LucideIcon
}

// Tipo para los objetivos
export interface ObjectiveType {
  id: string
  name: string
  icon: LucideIcon
  defaultAmount: number
  useICC?: boolean
  achievements: Achievement[]
  motivationalPhrases: {
    start: string
    progress25: string
    progress50: string
    progress75: string
    complete: string
    anticipated: string
  }
}

// Definir los diferentes tipos de objetivos
export const OBJECTIVE_TYPES: Record<string, ObjectiveType> = {
  house: {
    id: "house",
    name: "Casa",
    icon: Home,
    defaultAmount: 90000000,
    useICC: true,
    achievements: [
      {
        threshold: 10,
        title: "Primer ladrillo",
        description: "¡Comenzaste a construir tu futuro!",
      },
      {
        threshold: 25,
        title: "Terreno en vista",
        description: "Ya puedes visualizar dónde construirás",
      },
      {
        threshold: 50,
        title: "Obra en marcha",
        description: "¡La construcción está avanzando!",
      },
      {
        threshold: 75,
        title: "Casi en casa",
        description: "¡Puedes ver el final del camino!",
      },
      {
        threshold: 100,
        title: "¡Objetivo logrado! 🎯",
        description: "¡Tu casa propia es una realidad!",
      },
    ],
    motivationalPhrases: {
      start: "¡Comenzando el viaje hacia tu casa propia! 🚀",
      progress25: "¡Ya alcanzaste el 25%! ¡El terreno está a la vista! 🌄",
      progress50: "¡Medio camino recorrido! ¡La obra está en marcha! 🏗️",
      progress75: "¡Ya alcanzaste el 75%! ¡Casi en casa! 🏠",
      complete: "¡Objetivo logrado! ¡Tu casa propia es una realidad! 🎉",
      anticipated: "¡Increíble! Has realizado aportes anticipados 🚀",
    },
  },
  car: {
    id: "car",
    name: "Auto",
    icon: Car,
    defaultAmount: 15000000,
    useICC: false,
    achievements: [
      {
        threshold: 10,
        title: "Primer paso",
        description: "¡Comenzaste el camino hacia tu auto!",
      },
      {
        threshold: 25,
        title: "Eligiendo modelo",
        description: "Ya puedes empezar a elegir el modelo que te gusta",
      },
      {
        threshold: 50,
        title: "Medio camino",
        description: "¡Ya estás a mitad de camino de tu auto!",
      },
      {
        threshold: 75,
        title: "Casi listo",
        description: "¡Puedes sentir el aroma a auto nuevo!",
      },
      {
        threshold: 100,
        title: "¡A rodar! 🚗",
        description: "¡Tu auto nuevo te está esperando!",
      },
    ],
    motivationalPhrases: {
      start: "¡Comenzando el viaje hacia tu auto nuevo! 🚀",
      progress25: "¡Ya alcanzaste el 25%! ¡Puedes empezar a elegir modelo! 🚗",
      progress50: "¡Medio camino recorrido! ¡Ya puedes sentir el volante! 🛣️",
      progress75: "¡Ya alcanzaste el 75%! ¡Casi puedes oler el auto nuevo! 🔑",
      complete: "¡Objetivo logrado! ¡Tu auto nuevo te espera! 🎉",
      anticipated: "¡Increíble! Has realizado aportes anticipados 🚀",
    },
  },
  motorcycle: {
    id: "motorcycle",
    name: "Moto",
    icon: Motorcycle,
    defaultAmount: 5000000,
    useICC: false,
    achievements: [
      {
        threshold: 10,
        title: "Primer paso",
        description: "¡Comenzaste el camino hacia tu moto!",
      },
      {
        threshold: 25,
        title: "Eligiendo modelo",
        description: "Ya puedes empezar a elegir el modelo que te gusta",
      },
      {
        threshold: 50,
        title: "Medio camino",
        description: "¡Ya estás a mitad de camino de tu moto!",
      },
      {
        threshold: 75,
        title: "Casi listo",
        description: "¡Puedes sentir la adrenalina!",
      },
      {
        threshold: 100,
        title: "¡A rodar! 🏍️",
        description: "¡Tu moto nueva te está esperando!",
      },
    ],
    motivationalPhrases: {
      start: "¡Comenzando el viaje hacia tu moto nueva! 🚀",
      progress25: "¡Ya alcanzaste el 25%! ¡Puedes empezar a elegir modelo! 🏍️",
      progress50: "¡Medio camino recorrido! ¡Ya puedes sentir la adrenalina! 🛣️",
      progress75: "¡Ya alcanzaste el 75%! ¡Casi puedes sentir el viento! 🔑",
      complete: "¡Objetivo logrado! ¡Tu moto nueva te espera! 🎉",
      anticipated: "¡Increíble! Has realizado aportes anticipados 🚀",
    },
  },
  travel: {
    id: "travel",
    name: "Viaje",
    icon: Plane,
    defaultAmount: 3000000,
    useICC: false,
    achievements: [
      {
        threshold: 10,
        title: "Primer paso",
        description: "¡Comenzaste a planificar tu viaje!",
      },
      {
        threshold: 25,
        title: "Eligiendo destino",
        description: "Ya puedes empezar a elegir tu destino",
      },
      {
        threshold: 50,
        title: "Medio camino",
        description: "¡Ya estás a mitad de camino de tu viaje!",
      },
      {
        threshold: 75,
        title: "Casi listo",
        description: "¡Puedes sentir la emoción del viaje!",
      },
      {
        threshold: 100,
        title: "¡Buen viaje! ✈️",
        description: "¡Tu aventura te está esperando!",
      },
    ],
    motivationalPhrases: {
      start: "¡Comenzando a ahorrar para tu viaje soñado! 🚀",
      progress25: "¡Ya alcanzaste el 25%! ¡Puedes empezar a elegir destino! 🗺️",
      progress50: "¡Medio camino recorrido! ¡Ya puedes sentir la emoción! 🌍",
      progress75: "¡Ya alcanzaste el 75%! ¡Casi puedes sentir la aventura! ✈️",
      complete: "¡Objetivo logrado! ¡Tu viaje soñado te espera! 🎉",
      anticipated: "¡Increíble! Has realizado aportes anticipados 🚀",
    },
  },
  custom: {
    id: "custom",
    name: "Personalizado",
    icon: Target,
    defaultAmount: 10000000,
    useICC: false,
    achievements: [
      {
        threshold: 10,
        title: "Primer paso",
        description: "¡Comenzaste el camino hacia tu objetivo!",
      },
      {
        threshold: 25,
        title: "Avanzando",
        description: "Ya has avanzado un cuarto del camino",
      },
      {
        threshold: 50,
        title: "Medio camino",
        description: "¡Ya estás a mitad de camino de tu objetivo!",
      },
      {
        threshold: 75,
        title: "Casi listo",
        description: "¡Estás muy cerca de lograrlo!",
      },
      {
        threshold: 100,
        title: "¡Objetivo logrado! 🎯",
        description: "¡Lo has conseguido!",
      },
    ],
    motivationalPhrases: {
      start: "¡Comenzando el camino hacia tu objetivo! 🚀",
      progress25: "¡Ya alcanzaste el 25%! ¡Sigue así! 🌟",
      progress50: "¡Medio camino recorrido! ¡Tu constancia da frutos! 💪",
      progress75: "¡Ya alcanzaste el 75%! ¡Estás muy cerca! 🏁",
      complete: "¡Objetivo logrado! ¡Lo has conseguido! 🎉",
      anticipated: "¡Increíble! Has realizado aportes anticipados 🚀",
    },
  },
}

// Función para obtener los logros basados en el porcentaje de progreso
export function getAchievementsByProgress(objectiveType: string, progress: number): Achievement[] {
  const objective = OBJECTIVE_TYPES[objectiveType] || OBJECTIVE_TYPES.custom
  return objective.achievements.filter((achievement) => progress * 100 >= achievement.threshold)
}

// Función para obtener una frase motivacional basada en el progreso
export function getMotivationalPhrase(
  objectiveType: string,
  progress: number,
  completedMonths: number,
  anticipatedMonths: number,
): string {
  const objective = OBJECTIVE_TYPES[objectiveType] || OBJECTIVE_TYPES.custom
  const phrases = objective.motivationalPhrases

  if (progress >= 1) return phrases.complete

  if (anticipatedMonths > 0) {
    return `${phrases.anticipated} Has realizado ${anticipatedMonths} ${
      anticipatedMonths === 1 ? "aporte anticipado" : "aportes anticipados"
    }`
  }

  if (progress >= 0.75) {
    if (completedMonths > 15) return `${phrases.progress75} ¡Tu constancia está dando frutos!`
    return phrases.progress75
  }

  if (progress >= 0.5) {
    if (completedMonths > 10) return `${phrases.progress50} ¡Tu disciplina es admirable!`
    return phrases.progress50
  }

  if (progress >= 0.25) {
    if (completedMonths > 5) return `${phrases.progress25} ¡Tus aportes constantes están construyendo tu futuro!`
    return phrases.progress25
  }

  if (progress >= 0.1) {
    if (completedMonths > 2) return "¡Ya alcanzaste el 10%! ¡Cada aporte te acerca más a tu sueño! 🧱"
    return "¡Ya alcanzaste el 10%! ¡El primer paso está dado! 🧱"
  }

  if (completedMonths > 0) return "¡Has comenzado tu viaje! ¡Cada aporte cuenta! 🚀"
  return phrases.start
}
