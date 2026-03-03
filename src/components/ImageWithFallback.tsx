import { useState } from 'react'

export default function ImageWithFallback({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [error, setError] = useState(false)
  const fallback = '/images/place-food.svg'
  const finalSrc = !src || error ? fallback : src
  return (
    <div className="h-full w-full bg-gray-100">
      <img
        src={finalSrc}
        alt={alt}
        className={className}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  )
}


