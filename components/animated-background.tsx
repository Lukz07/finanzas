"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Establecer el tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 2 // Duplicar la altura para cubrir más espacio
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Configuración de los gradientes
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      hue: number
      opacity: number
    }[] = []
    const particleCount = 50 // Aumentado para más efecto visual

    // Paleta de colores según el tema
    const isDark = theme === 'dark'
    const baseHue = isDark ? 140 : 100 // Más verde oscuro para dark mode, más brillante para light mode
    const opacityBase = isDark ? 0.35 : 0.2 // Mayor opacidad en dark mode para mayor contraste

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2, // Tamaño aumentado
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        hue: Math.floor(Math.random() * 60) + baseHue, // Tonos de verde adaptados al tema
        opacity: Math.random() * 0.5 + opacityBase, // Opacidad adaptada al tema
      })
    }

    // Función de animación
    const animate = () => {
      // Aplicar un efecto de desvanecimiento para el movimiento fluido
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      particles.forEach((particle) => {
        // Actualizar posición
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebotar en los bordes
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX *= -1
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY *= -1
        }

        // Dibujar partícula
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)

        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme]) // Agregar theme como dependencia para reaccionar a los cambios

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-40 dark:opacity-50 transition-opacity duration-500" />
}
