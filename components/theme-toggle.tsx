"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-md hover:bg-accent"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-md hover:bg-accent"
      onClick={() => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        // Actualizar el tema en next-themes (esto automáticamente manejará las clases HTML)
        setTheme(newTheme);
        
        // Guardar explícitamente en localStorage
        localStorage.setItem('theme', newTheme);
      }}
      aria-label="Cambiar tema"
    >
      <Sun
        className={cn(
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
          currentTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
          currentTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        )}
      />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
