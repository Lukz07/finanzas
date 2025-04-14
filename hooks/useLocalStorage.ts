import { useState, useEffect } from 'react';

/**
 * Hook personalizado para usar localStorage con React
 * @param key Clave para almacenar el valor
 * @param initialValue Valor inicial si no hay nada en localStorage
 * @returns [storedValue, setValue] - Valor almacenado y función para actualizarlo
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Prevenir errores durante SSR
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Obtener del localStorage
      const item = window.localStorage.getItem(key);
      // Parsear el valor almacenado o devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error);
      return initialValue;
    }
  });

  // Sincronizar el estado con localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Guardar el estado en localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
} 