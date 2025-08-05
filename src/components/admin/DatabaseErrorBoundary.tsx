'use client'

import React, { Component, ReactNode } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Database, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  context?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class DatabaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Database Error Boundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const { context = 'Admin System' } = this.props

      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Determine error type and message
      let errorTitle = '데이터베이스 오류'
      let errorMessage = '데이터를 불러오는 중 문제가 발생했습니다.'
      let suggestions: string[] = []

      if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
        errorTitle = '데이터베이스 테이블 누락'
        errorMessage = '필요한 데이터베이스 테이블이 존재하지 않습니다.'
        suggestions = [
          '데이터베이스 설정 스크립트를 실행하세요: yarn db:setup',
          'Supabase 프로젝트가 올바르게 구성되었는지 확인하세요',
          '환경 변수 설정을 확인하세요'
        ]
      } else if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
        errorTitle = '데이터베이스 스키마 불일치'
        errorMessage = '데이터베이스 구조가 애플리케이션과 일치하지 않습니다.'
        suggestions = [
          '데이터베이스 마이그레이션을 실행하세요',
          '최신 스키마로 업데이트하세요',
          '개발팀에 문의하세요'
        ]
      } else if (error?.message?.includes('JWT') || error?.message?.includes('authentication')) {
        errorTitle = '인증 오류'
        errorMessage = '사용자 인증에 실패했습니다.'
        suggestions = [
          '다시 로그인해 보세요',
          'Supabase 인증 설정을 확인하세요',
          '세션이 만료되었을 수 있습니다'
        ]
      } else if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
        errorTitle = '네트워크 연결 오류'
        errorMessage = 'Supabase 서버에 연결할 수 없습니다.'
        suggestions = [
          '인터넷 연결을 확인하세요',
          'Supabase URL과 API 키를 확인하세요',
          '잠시 후 다시 시도하세요'
        ]
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">
                {errorTitle}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>{context}</strong>: {errorMessage}
                </AlertDescription>
              </Alert>

              {suggestions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium text-gray-900">해결 방법:</h4>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                          {index + 1}
                        </span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-center gap-3">
                  <Button onClick={this.handleRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    다시 시도
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin/dashboard'}
                  >
                    대시보드로 이동
                  </Button>
                </div>
              </div>

              {/* Development Mode Error Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    개발자 정보 (클릭하여 펼치기)
                  </summary>
                  <div className="mt-3 rounded-lg bg-gray-100 p-4">
                    <div className="text-sm">
                      <div className="mb-2 font-medium text-red-600">Error:</div>
                      <pre className="mb-4 whitespace-pre-wrap text-xs text-gray-700">
                        {error.message}
                      </pre>
                      {error.stack && (
                        <>
                          <div className="mb-2 font-medium text-red-600">Stack Trace:</div>
                          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-600">
                            {error.stack}
                          </pre>
                        </>
                      )}
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC wrapper for easier usage
export const withDatabaseErrorBoundary = (
  WrappedComponent: React.ComponentType<any>,
  context?: string
) => {
  return function DatabaseErrorBoundaryWrapper(props: any) {
    return (
      <DatabaseErrorBoundary context={context}>
        <WrappedComponent {...props} />
      </DatabaseErrorBoundary>
    )
  }
}

export default DatabaseErrorBoundary