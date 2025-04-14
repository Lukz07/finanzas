"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ImageProps } from "next/image";

type ProxiedImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
};

// Lista de dominios que comúnmente tienen problemas con hotlinking
const PROBLEMATIC_DOMAINS = [
  "cointelegraph.com",
  "s3.cointelegraph.com", 
  "images.cointelegraph.com",
  "static.seekingalpha.com",
  "cdn.benzinga.com",
  "images.mktw.net",
  "static.foxbusiness.com",
  // Añade más dominios problemáticos aquí
];

export function ProxiedImage({
  src,
  alt,
  className = "",
  priority = false,
  onLoad,
  ...props
}: ProxiedImageProps) {
  // Estado: 0 = intentando carga normal, 1 = usando proxy, 2 = mostrando placeholder
  const [loadState, setLoadState] = useState(0);
  
  // Manejar el error de carga
  const handleError = () => {
    if (loadState === 0) {
      // Si falló la carga normal, intentar con proxy
      setLoadState(1);
    } else {
      // Si falló el proxy, mostrar placeholder
      setLoadState(2);
    }
  };
  
  // Determinar la URL de la imagen según el estado
  const imageUrl = 
    loadState === 0 ? src :
    loadState === 1 ? `/api/image-proxy?url=${encodeURIComponent(src)}` :
    "/images/placeholder.svg";
  
  return (
    <Image
      {...props}
      src={imageUrl}
      alt={alt}
      className={className}
      priority={priority}
      onError={handleError}
      onLoad={onLoad}
      unoptimized={loadState === 1} // Desactivar optimización solo para proxy
    />
  );
} 