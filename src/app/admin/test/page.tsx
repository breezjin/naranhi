'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [error, setError] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<string>('확인 중...')
  const supabase = createClient()

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)
      setDbStatus('Supabase 연결 테스트 중...')

      // Test basic connection
      const { data, error } = await supabase.from('staff_categories').select('count').limit(1)
      
      if (error) {
        if (error.message.includes('relation "staff_categories" does not exist')) {
          setDbStatus('❌ 데이터베이스 스키마가 생성되지 않았습니다.')
          setError('데이터베이스 스키마를 생성해주세요: yarn db:setup')
        } else {
          setDbStatus('❌ 데이터베이스 연결 실패')
          setError(error.message)
        }
        setConnectionStatus('error')
        return
      }

      // Test table existence
      const tables = ['staff_categories', 'staff_members', 'facility_categories', 'facility_photos', 'notices', 'admin_users']
      const tableStatus = []

      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('id').limit(1)
          if (error) {
            tableStatus.push(`❌ ${table}: ${error.message}`)
          } else {
            tableStatus.push(`✅ ${table}: OK`)
          }
        } catch (err: any) {
          tableStatus.push(`❌ ${table}: ${err.message}`)
        }
      }

      setDbStatus(tableStatus.join('\n'))
      setConnectionStatus('success')

    } catch (error: any) {
      console.error('Connection test error:', error)
      setError(error.message || '연결 테스트 실패')
      setConnectionStatus('error')
      setDbStatus('❌ 연결 테스트 실패')
    }
  }

  const setupDatabase = async () => {
    try {
      setDbStatus('데이터베이스 설정 중...')
      
      // This would normally run the setup script
      setDbStatus('⚠️ 터미널에서 yarn db:setup 명령을 실행해주세요.')
      
    } catch (error: any) {
      setError(error.message)
      setDbStatus('❌ 데이터베이스 설정 실패')
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">나란히 Admin 시스템 테스트</h1>
          <p className="text-muted-foreground">Supabase 연결과 데이터베이스 상태를 확인합니다.</p>
        </div>

        <div className="grid gap-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>연결 상태</CardTitle>
              <CardDescription>Supabase 데이터베이스 연결 상태를 확인합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {connectionStatus === 'testing' && (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      <span>테스트 중...</span>
                    </>
                  )}
                  {connectionStatus === 'success' && (
                    <>
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <span>연결 성공</span>
                    </>
                  )}
                  {connectionStatus === 'error' && (
                    <>
                      <div className="h-4 w-4 rounded-full bg-destructive"></div>
                      <span>연결 실패</span>
                    </>
                  )}
                </div>
                <Button onClick={testConnection} variant="outline" size="sm">
                  다시 테스트
                </Button>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <pre className="whitespace-pre-wrap text-sm">{dbStatus}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>환경 변수</CardTitle>
              <CardDescription>필요한 환경 변수 설정 상태를 확인합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-destructive'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 미설정'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-destructive'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 미설정'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>오류:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>설정 안내</CardTitle>
              <CardDescription>Admin 시스템을 설정하는 방법입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">1. Supabase 프로젝트 생성</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://supabase.com
                    </a>에서 새 프로젝트를 생성하세요.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">2. 환경 변수 설정</h3>
                  <p className="mb-2 text-sm text-muted-foreground">.env 파일에 다음 값들을 설정하세요:</p>
                  <div className="rounded bg-muted p-3 font-mono text-sm">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key<br />
                    SUPABASE_SERVICE_ROLE_KEY=your-service-key
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">3. 데이터베이스 설정</h3>
                  <p className="mb-2 text-sm text-muted-foreground">터미널에서 다음 명령을 실행하세요:</p>
                  <div className="rounded bg-muted p-3 font-mono text-sm">
                    yarn db:setup
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">4. 관리자 계정 생성</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <a href="/admin/login" className="text-primary hover:underline">
                      로그인 페이지
                    </a>에서 관리자 계정을 생성하세요.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Button onClick={setupDatabase} variant="outline">
                  데이터베이스 설정 안내
                </Button>
                <Button onClick={() => window.open('/admin/login', '_blank')}>
                  관리자 로그인
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}