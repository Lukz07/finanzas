'use client';

import { useState, useEffect } from 'react';

interface VariantSwitcherProps {
  className?: string;
}

export function VariantSwitcher({ className = '' }: VariantSwitcherProps) {
  const [currentVariant, setCurrentVariant] = useState<string>('auto');
  
  // Cargar la variante actual al montar el componente
  useEffect(() => {
    // Intentar obtener la variante del localStorage
    const savedVariant = localStorage.getItem('news_display_variant');
    if (savedVariant === 'slider' || savedVariant === 'static') {
      setCurrentVariant(savedVariant);
    } else {
      setCurrentVariant('auto');
    }
  }, []);
  
  // Cambiar la variante
  const handleVariantChange = (variant: string) => {
    if (variant === 'auto') {
      // Eliminar la preferencia guardada para permitir asignación aleatoria
      localStorage.removeItem('news_display_variant');
      setCurrentVariant('auto');
    } else if (variant === 'slider' || variant === 'static') {
      // Guardar la preferencia
      localStorage.setItem('news_display_variant', variant);
      setCurrentVariant(variant);
    }
    
    // Recargar la página para aplicar los cambios
    window.location.reload();
  };
  
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-finance-gray-800 shadow-lg rounded-lg p-4 z-50 ${className}`}>
      <div className="text-sm font-semibold mb-2">Selector de Variante (Desarrollo)</div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleVariantChange('auto')}
          className={`px-3 py-1 rounded text-sm ${
            currentVariant === 'auto' 
              ? 'bg-finance-green-500 text-white' 
              : 'bg-gray-200 dark:bg-finance-gray-700'
          }`}
        >
          Auto
        </button>
        <button
          onClick={() => handleVariantChange('slider')}
          className={`px-3 py-1 rounded text-sm ${
            currentVariant === 'slider' 
              ? 'bg-finance-green-500 text-white' 
              : 'bg-gray-200 dark:bg-finance-gray-700'
          }`}
        >
          Slider
        </button>
        <button
          onClick={() => handleVariantChange('static')}
          className={`px-3 py-1 rounded text-sm ${
            currentVariant === 'static' 
              ? 'bg-finance-green-500 text-white' 
              : 'bg-gray-200 dark:bg-finance-gray-700'
          }`}
        >
          Estático
        </button>
      </div>
    </div>
  );
} 