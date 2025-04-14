"use client"

import { useState, useEffect, memo, useRef } from 'react'
import Image from 'next/image'

interface NewsImageProps {
  src: string | null
  alt: string
  title: string
  category: string
  className?: string
}

export const NewsImage = memo(function NewsImage({ 
  src, 
  alt, 
  title,
  category,
  className 
}: NewsImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!src)
  const hasLoadStarted = useRef(false)

  useEffect(() => {
    // No iniciar carga si no hay imagen o ya hemos intentado cargarla
    if (!src || hasLoadStarted.current) {
      return
    }
    
    hasLoadStarted.current = true
    const img = new window.Image()
    img.src = src
    
    // Usar callbacks directos para mejor rendimiento
    img.onload = () => setIsLoading(false)
    img.onerror = () => {
      setError(true)
      setIsLoading(false)
    }
    
    // Al desmontar o cambiar src, limpiar
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  // Renderizar el componente para imagen faltante o con error
  if (!src || error) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-finance-green-100/60 dark:bg-finance-green-900/20 ${className}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-medium text-finance-green-800 dark:text-finance-green-200 mb-2">
            {category}
          </span>
          <h3 className="text-sm font-semibold text-finance-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-finance-green-100/40 dark:bg-finance-green-900/10" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${isLoading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-150`}
        onError={() => setError(true)}
        priority={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={65}
        unoptimized={src.includes('warnermediacdn.com')}
      />
    </div>
  )
}) 