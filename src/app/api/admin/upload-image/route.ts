import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, ImageUploadOptions } from '@/lib/services/imageUploadService'

export async function POST(request: NextRequest) {
  console.log('이미지 업로드 API 호출됨')
  
  try {
    console.log('FormData 파싱 중...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as 'editor-images' | 'facility-images' | undefined
    const maxSize = formData.get('maxSize') as string | undefined
    
    console.log('파일 정보:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      bucket: bucket || 'editor-images'
    })
    
    if (!file) {
      console.log('파일이 없음')
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      )
    }
    
    // 업로드 옵션 설정
    const options: ImageUploadOptions = {
      bucket: bucket || 'editor-images',
      maxSizeBytes: maxSize ? parseInt(maxSize) : undefined
    }
    
    console.log('업로드 옵션:', options)
    console.log('uploadImage 함수 호출 중...')
    
    // 이미지 업로드
    const result = await uploadImage(file, options)
    
    console.log('업로드 결과:', result)
    
    // 결과 검증
    if (!result.url) {
      throw new Error('업로드된 이미지 URL을 생성할 수 없습니다.')
    }
    
    const response = {
      success: true,
      data: result
    }
    
    console.log('API 응답 데이터:', response)
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Image upload API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}