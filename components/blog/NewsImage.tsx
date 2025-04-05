import { useState } from 'react'
import Image from 'next/image'

interface NewsImageProps {
  src: string | null
  alt: string
  title: string
  category: string
  width?: number
  height?: number
  className?: string
}

export function NewsImage({ 
  src, 
  alt, 
  title,
  category,
  width = 400, 
  height = 225, 
  className 
}: NewsImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-finance-green-100 dark:bg-finance-green-900/20 ${className}`}
        style={{ width, height }}
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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority={false}
      quality={75}
      style={{ objectFit: 'cover' }}
    />
  )
} 