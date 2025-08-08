import { createAdminClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

export interface ImageUploadOptions {
  bucket?: 'editor-images' | 'facility-images'
  maxSizeBytes?: number
  allowedTypes?: string[]
  generateThumbnail?: boolean
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

const DEFAULT_OPTIONS: Required<Omit<ImageUploadOptions, 'generateThumbnail'>> & { generateThumbnail?: boolean } = {
  bucket: 'editor-images',
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  generateThumbnail: false
}

/**
 * 이미지 파일을 Supabase Storage에 업로드합니다
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
  
  const supabase = createAdminClient()
  
  // Supabase Admin 클라이언트 상태 확인
  console.log('Supabase Admin 클라이언트 초기화됨')
  
  // 고유한 파일명 생성
  const fileExtension = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExtension}`
  const filePath = `${fileName}`
  
  try {
    console.log('이미지 메타데이터 추출 중...')
    // 이미지 메타데이터 추출
    const { width, height } = await getImageDimensions(file)
    console.log('이미지 크기:', { width, height })
    
    console.log('Supabase Storage 업로드 시작...')
    console.log('업로드 정보:', { bucket: opts.bucket, filePath, fileName })
    
    // 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(opts.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    console.log('업로드 결과:', { uploadData, uploadError })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`파일 업로드 실패: ${uploadError.message}`)
    }
    
    console.log('공개 URL 생성 중...')
    // 업로드된 파일의 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(opts.bucket)
      .getPublicUrl(uploadData.path)
    
    console.log('생성된 URL 데이터:', urlData)
    
    const result: ImageUploadResult = {
      url: urlData.publicUrl,
      fileName: fileName,
      fileSize: file.size,
      mimeType: file.type,
      width,
      height
    }
    
    // 썸네일 생성이 요청된 경우 (향후 구현)
    if (opts.generateThumbnail) {
      // TODO: 썸네일 생성 로직 구현
      // result.thumbnailUrl = thumbnailUrl
    }
    
    return result
  } catch (error) {
    console.error('Image upload error:', error)
    throw error instanceof Error ? error : new Error('이미지 업로드 중 알 수 없는 오류가 발생했습니다.')
  }
}

/**
 * 이미지 파일을 삭제합니다
 */
export async function deleteImage(
  fileName: string,
  bucket: 'editor-images' | 'facility-images' = 'editor-images'
): Promise<void> {
  const supabase = createAdminClient()
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) {
      console.error('Delete error:', error)
      throw new Error(`파일 삭제 실패: ${error.message}`)
    }
  } catch (error) {
    console.error('Image delete error:', error)
    throw error instanceof Error ? error : new Error('이미지 삭제 중 알 수 없는 오류가 발생했습니다.')
  }
}

/**
 * 이미지 파일의 크기 정보를 추출합니다 (Sharp 사용)
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  try {
    console.log('Sharp로 이미지 메타데이터 추출 시작...')
    
    // File을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Sharp로 이미지 메타데이터 추출
    const metadata = await sharp(buffer).metadata()
    
    console.log('Sharp 메타데이터:', metadata)
    
    if (!metadata.width || !metadata.height) {
      throw new Error('이미지의 width 또는 height 정보를 찾을 수 없습니다.')
    }
    
    return {
      width: metadata.width,
      height: metadata.height
    }
  } catch (error) {
    console.error('Sharp 이미지 처리 오류:', error)
    throw new Error(`이미지 크기를 읽을 수 없습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
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
 * 이미지 업로드 진행률을 추적하는 버전 (향후 구현)
 */
export async function uploadImageWithProgress(
  file: File,
  options: ImageUploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> {
  // 현재는 기본 업로드와 동일, 향후 진행률 추적 기능 추가
  if (onProgress) {
    onProgress(0)
  }
  
  const result = await uploadImage(file, options)
  
  if (onProgress) {
    onProgress(100)
  }
  
  return result
}