'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { isImageFile, formatFileSize } from '@/lib/services/imageUploadClient'

export interface ImageUploadResult {
  url: string
  alt: string
  title?: string
  width?: number
  height?: number
}

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageUploaded: (result: ImageUploadResult) => void
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onImageUploaded
}: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState({
    alt: '',
    title: '',
    caption: ''
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const resetState = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setError(null)
    setImageInfo({ alt: '', title: '', caption: '' })
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    
    // 파일 타입 검증
    if (!isImageFile(file)) {
      setError('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기가 10MB를 초과합니다.')
      return
    }
    
    setSelectedFile(file)
    
    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // 기본 정보 자동 입력
    const fileName = file.name.split('.')[0]
    setImageInfo(prev => ({
      ...prev,
      title: prev.title || fileName,
      alt: prev.alt || `${fileName} 이미지`
    }))
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.')
      return
    }
    
    if (!imageInfo.alt.trim()) {
      setError('대체 텍스트를 입력해주세요.')
      return
    }
    
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('bucket', 'editor-images')
      
      // 업로드 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 20
        })
      }, 200)
      
      console.log('업로드 요청 시작...')
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })
      
      console.log('응답 상태:', response.status, response.statusText)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (!response.ok) {
        console.log('응답 실패, 에러 데이터 파싱 중...')
        console.log('응답 헤더:', response.headers)
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const responseText = await response.text()
          console.log('응답 텍스트:', responseText)
          
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText)
              errorMessage = errorData.error || errorMessage
            } catch (jsonError) {
              console.error('JSON 파싱 실패, 텍스트 그대로 사용:', jsonError)
              errorMessage = responseText
            }
          }
        } catch (parseError) {
          console.error('응답 읽기 실패:', parseError)
        }
        
        throw new Error(errorMessage)
      }
      
      console.log('응답 성공, 데이터 파싱 중...')
      let responseData;
      try {
        const responseText = await response.text()
        console.log('응답 텍스트:', responseText)
        
        if (!responseText) {
          throw new Error('서버에서 빈 응답을 반환했습니다.')
        }
        
        responseData = JSON.parse(responseText)
        console.log('파싱된 응답 데이터:', responseData)
        
        if (!responseData.success || !responseData.data) {
          throw new Error('서버 응답 형식이 올바르지 않습니다.')
        }
      } catch (parseError) {
        console.error('성공 응답 데이터 파싱 실패:', parseError)
        throw new Error(`서버 응답을 파싱할 수 없습니다: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`)
      }
      
      const { data } = responseData
      
      // 업로드 결과 전달
      const result: ImageUploadResult = {
        url: data.url,
        alt: imageInfo.alt,
        title: imageInfo.title || undefined,
        width: data.width,
        height: data.height
      }
      
      onImageUploaded(result)
      
      toast({
        title: '이미지 업로드 완료',
        description: '이미지가 성공적으로 업로드되었습니다.'
      })
      
      // 다이얼로그 닫기 및 상태 초기화
      onOpenChange(false)
      resetState()
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>이미지 업로드</DialogTitle>
          <DialogDescription>
            에디터에 삽입할 이미지를 업로드합니다. (최대 10MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 파일 선택 영역 */}
          {!selectedFile && (
            <div
              className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  이미지를 선택하거나 드래그하세요
                </p>
                <p className="text-sm text-gray-600">
                  JPG, PNG, WebP, GIF 파일 (최대 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* 선택된 이미지 미리보기 */}
          {selectedFile && imagePreview && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedFile(null)
                    setImagePreview(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>파일명:</strong> {selectedFile.name}</p>
                <p><strong>파일 크기:</strong> {formatFileSize(selectedFile.size)}</p>
                <p><strong>파일 타입:</strong> {selectedFile.type}</p>
              </div>
            </div>
          )}

          {/* 이미지 정보 입력 */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alt-text">대체 텍스트 *</Label>
                <Input
                  id="alt-text"
                  value={imageInfo.alt}
                  onChange={(e) => setImageInfo(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="시각 장애인을 위한 이미지 설명"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">이미지 제목</Label>
                <Input
                  id="title"
                  value={imageInfo.title}
                  onChange={(e) => setImageInfo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="이미지 제목 (선택사항)"
                  disabled={isUploading}
                />
              </div>
            </div>
          )}

          {/* 업로드 진행률 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>업로드 진행률</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            취소
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !imageInfo.alt.trim() || isUploading}
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                업로드
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}