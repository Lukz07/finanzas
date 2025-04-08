import { useState } from 'react'
import Image from 'next/image'

interface NewsImageProps {
  src: string | null
  alt: string
  title: string
  category: string
  className?: string
}

export function NewsImage({ 
  src, 
  alt, 
  title,
  category,
  className 
}: NewsImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-finance-green-100 dark:bg-finance-green-900/20 ${className}`}
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
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        priority={false}
        quality={75}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )
} 