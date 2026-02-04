'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface SmartImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function SmartImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  objectFit = 'cover'
}: SmartImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (error) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 rounded-xl`}
        style={{ width, height }}
      >
        <span className="text-2xl">{alt}</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-sm">جاري التحميل...</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit }}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

export default SmartImage
