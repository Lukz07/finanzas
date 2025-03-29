"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Asegurarse de que el componente esté montado antes de mostrar el botón
  // para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full hover:bg-finance-green-100 dark:hover:bg-finance-green-900/30 transition-all duration-200"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-finance-green-600" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full hover:bg-finance-green-100 dark:hover:bg-finance-green-900/30 transition-all duration-200"
      onClick={() => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        // Actualizar el tema en next-themes (esto automáticamente manejará las clases HTML)
        setTheme(newTheme);
        
        // Guardar explícitamente en localStorage
        localStorage.setItem('theme', newTheme);
      }}
      aria-label="Cambiar tema"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-finance-green-400" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-finance-green-600" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
