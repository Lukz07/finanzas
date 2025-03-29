import React from 'react';
import {
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Target,
  DollarSign,
  Briefcase,
  PiggyBank,
  Rocket,
  Settings,
  BarChart3,
  LineChart,
  Scale
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const InvestmentIcon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  // Mapa de nombres de iconos a componentes de Lucide
  const iconMap: Record<string, React.ReactNode> = {
    'trending-up': <TrendingUp size={size} className={className} />,
    'shield-alert': <ShieldAlert size={size} className={className} />,
    'shield-check': <ShieldCheck size={size} className={className} />,
    'target': <Target size={size} className={className} />,
    'dollar-sign': <DollarSign size={size} className={className} />,
    'briefcase': <Briefcase size={size} className={className} />,
    'piggy-bank': <PiggyBank size={size} className={className} />,
    'rocket': <Rocket size={size} className={className} />,
    'settings': <Settings size={size} className={className} />,
    'bar-chart': <BarChart3 size={size} className={className} />,
    'line-chart': <LineChart size={size} className={className} />,
    'scale': <Scale size={size} className={className} />
  };

  // Si el nombre del icono no existe en el mapa, devuelve un icono predeterminado
  return <>{iconMap[name] || <Target size={size} className={className} />}</>;
};

// Componentes específicos para cada estrategia de inversión
export const ConservativeIcon = () => (
  <div className="p-2 bg-blue-500/10 rounded-full">
    <ShieldAlert className="h-5 w-5 text-blue-500" />
  </div>
);

export const ModerateIcon = () => (
  <div className="p-2 bg-amber-500/10 rounded-full">
    <TrendingUp className="h-5 w-5 text-amber-500" />
  </div>
);

export const AggressiveIcon = () => (
  <div className="p-2 bg-red-500/10 rounded-full">
    <Rocket className="h-5 w-5 text-red-500" />
  </div>
);

export const VeryConservativeIcon = () => (
  <div className="p-2 bg-green-500/10 rounded-full">
    <ShieldCheck className="h-5 w-5 text-green-500" />
  </div>
);

// Función para obtener el componente de icono basado en el ID de estrategia
export function getStrategyIcon(strategyId: string): React.ReactNode {
  const iconComponents: Record<string, React.ReactNode> = {
    'very_conservative': <VeryConservativeIcon />,
    'conservative': <ConservativeIcon />,
    'moderate': <ModerateIcon />,
    'aggressive': <AggressiveIcon />,
  };
  
  return iconComponents[strategyId] || <ModerateIcon />;
} 