import { cn } from '@/lib/utils'

interface SafeImageProps {
  src: string
  alt: string
  width?: number | null
  height?: number | null
  title?: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  sizes?: string
  unoptimized?: boolean
  fill?: boolean
}

export default function SafeImage({
  src,
  alt,
  title,
  className = '',
  loading = 'lazy'
}: SafeImageProps) {
  // Validate src URL
  const isValidSrc = typeof src === 'string' && src.trim().length > 0
  
  if (!isValidSrc) {
    return null
  }

  // Use regular img tag for maximum hydration safety
  return (
    <img
      src={src}
      alt={alt || '공지사항 이미지'}
      title={title}
      className={cn('w-full h-auto object-cover rounded-lg', className)}
      loading={loading}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
      suppressHydrationWarning
    />
  )
}