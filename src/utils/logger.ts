/**
 * 개발/프로덕션 환경을 고려한 로거 유틸리티
 * Development-only logging utility for better production performance
 */

const isDevelopment = process.env.NODE_ENV === 'development'

interface LogContext {
  component?: string
  action?: string
  userId?: string
  requestId?: string
  [key: string]: any
}

/**
 * 개발 환경에서만 에러를 콘솔에 출력
 * Only logs errors to console in development environment
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] ERROR:`
  
  if (context) {
    console.error(prefix, message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context
    })
  } else {
    console.error(prefix, message, error)
  }
}

/**
 * 개발 환경에서만 경고를 콘솔에 출력
 * Only logs warnings to console in development environment
 */
export function logWarning(message: string, context?: LogContext): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  console.warn(`[${timestamp}] WARN:`, message, context)
}

/**
 * 개발 환경에서만 정보를 콘솔에 출력
 * Only logs info to console in development environment
 */
export function logInfo(message: string, context?: LogContext): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] INFO:`, message, context)
}

/**
 * 개발 환경에서만 디버그 정보를 콘솔에 출력
 * Only logs debug info to console in development environment
 */
export function logDebug(message: string, data?: any, context?: LogContext): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] DEBUG:`, message, data, context)
}

/**
 * API 요청/응답 로깅 (개발 환경 전용)
 * API request/response logging (development only)
 */
export function logApiRequest(method: string, url: string, body?: any): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] API REQUEST:`, method, url, body ? { body } : '')
}

export function logApiResponse(method: string, url: string, status: number, data?: any): void {
  if (!isDevelopment) return

  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] API RESPONSE:`, method, url, status, data ? { data } : '')
}

/**
 * 성능 측정 유틸리티 (개발 환경 전용)
 * Performance measurement utility (development only)
 */
export function createPerformanceLogger(label: string) {
  if (!isDevelopment) {
    return {
      start: () => {},
      end: () => {},
      measure: () => {}
    }
  }

  let startTime: number

  return {
    start: () => {
      startTime = performance.now()
      console.time(`PERF: ${label}`)
    },
    end: () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.timeEnd(`PERF: ${label}`)
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`)
    },
    measure: (checkpoint: string) => {
      const currentTime = performance.now()
      const duration = currentTime - startTime
      console.log(`[PERF] ${label} - ${checkpoint}: ${duration.toFixed(2)}ms`)
    }
  }
}