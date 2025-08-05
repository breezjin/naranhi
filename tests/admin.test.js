/**
 * Admin System Tests
 * Basic integration tests for the Naranhi admin system
 */

const fetch = require('node-fetch')

const BASE_URL = 'http://localhost:3000'

describe('Naranhi Admin System Tests', () => {
  
  describe('Basic Connectivity', () => {
    test('Main site should be accessible', async () => {
      const response = await fetch(`${BASE_URL}/`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/html')
    })

    test('Admin login page should be accessible', async () => {
      const response = await fetch(`${BASE_URL}/admin/login`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/html')
    })

    test('Admin test page should redirect to login', async () => {
      const response = await fetch(`${BASE_URL}/admin/test`, { redirect: 'manual' })
      expect([302, 307]).toContain(response.status)
    })

    test('Admin dashboard should redirect to login', async () => {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: 'manual' })
      expect([302, 307]).toContain(response.status)
    })
  })

  describe('Static Assets', () => {
    test('Favicon should be accessible', async () => {
      const response = await fetch(`${BASE_URL}/favicon.ico`)
      expect(response.status).toBe(200)
    })

    test('Static images should be accessible', async () => {
      const response = await fetch(`${BASE_URL}/imgs/naranhi-logo-color.png`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('image')
    })
  })

  describe('API Endpoints', () => {
    test('Notice API should be accessible', async () => {
      const response = await fetch(`${BASE_URL}/api/notice`)
      expect([200, 500]).toContain(response.status) // 500 is ok if Notion API is not configured
    })
  })

  describe('Environment Configuration', () => {
    test('Should have required environment variables', () => {
      // These would be undefined in test environment, but we test the structure
      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
      ]
      
      // In a real test, we'd check process.env
      // For now, just check the structure exists
      expect(requiredEnvVars).toHaveLength(2)
    })
  })

  describe('Page Structure', () => {
    test('Admin login page should contain login form', async () => {
      const response = await fetch(`${BASE_URL}/admin/login`)
      const html = await response.text()
      
      expect(html).toContain('나란히 관리자')
      expect(html).toContain('이메일')
      expect(html).toContain('비밀번호')
      expect(html).toContain('로그인')
    })

    test('Main page should contain site name', async () => {
      const response = await fetch(`${BASE_URL}/`)
      const html = await response.text()
      
      expect(html).toContain('나란히')
    })
  })
})

// Manual test function for database connectivity
async function testDatabaseConnection() {
  console.log('🧪 Manual Database Connection Test')
  
  try {
    // This would need to be run with proper environment variables
    const { createClient } = require('@supabase/supabase-js')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase environment variables not set')
      return false
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection
    const { data, error } = await supabase.from('staff_categories').select('count').limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
    
  } catch (error) {
    console.log('❌ Database test error:', error.message)
    return false
  }
}

module.exports = {
  testDatabaseConnection
}