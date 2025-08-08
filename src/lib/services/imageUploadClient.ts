export interface ImageUploadOptions {
  bucket?: 'editor-images' | 'facility-images'
  maxSizeBytes?: number
  allowedTypes?: string[]
}

export interface ImageUploadResult {
  url: string
  thumbnailUrl?: string
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
}

const DEFAULT_OPTIONS: Required<Omit<ImageUploadOptions, 'generateThumbnail'>> = {
  bucket: 'editor-images',
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
}

/**
 * 클라이언트에서 이미지를 API를 통해 업로드합니다
 */
export async function uploadImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  // 파일 유효성 검사
  if (!opts.allowedTypes.includes(file.type)) {
    throw new Error(`지원하지 않는 파일 형식입니다. 지원 형식: ${opts.allowedTypes.join(', ')}`)
  }
  
  if (file.size > opts.maxSizeBytes) {
    const maxSizeMB = Math.round(opts.maxSizeBytes / (1024 * 1024))
    throw new Error(`파일 크기가 너무 큽니다. 최대 ${maxSizeMB}MB까지 업로드 가능합니다.`)
  }

  // FormData 준비
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', opts.bucket)
  if (opts.maxSizeBytes) {
    formData.append('maxSize', opts.maxSizeBytes.toString())
  }

  try {
    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '이미지 업로드에 실패했습니다.')
    }

    const result = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error('서버 응답 형식이 올바르지 않습니다.')
    }

    return result.data
  } catch (error) {
    console.error('Image upload client error:', error)
    throw error instanceof Error ? error : new Error('이미지 업로드 중 알 수 없는 오류가 발생했습니다.')
  }
}

/**
 * 파일이 이미지인지 확인합니다
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 변환합니다
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 이미지 업로드 진행률을 추적하는 버전
 */
export async function uploadImageWithProgress(
  file: File,
  options: ImageUploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> {
  if (onProgress) {
    onProgress(0)
  }
  
  const result = await uploadImage(file, options)
  
  if (onProgress) {
    onProgress(100)
  }
  
  return result
}