import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { logError } from '@/utils/logger'

// GET /api/admin/notice-categories - Fetch all categories
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // First check if table exists
    const { data: testData, error: testError } = await supabase
      .from('notice_categories')
      .select('id')
      .limit(1)

    if (testError) {
      logError('Database connection or schema error', testError, { 
        component: 'NoticeCategoriesAPI', 
        action: 'GET',
        errorCode: testError.code 
      })
      
      if (testError.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'Database tables not initialized. Please run setup scripts.',
            details: 'Table missing: notice_categories',
            data: [],
            setupRequired: true
          },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message, data: [] },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('notice_categories')
      .select('*')
      .order('display_name', { ascending: true })

    if (error) {
      logError('Error fetching notice categories', error, { component: 'NoticeCategoriesAPI', action: 'GET' })
      
      // Handle specific database errors
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Notice categories table not found. Please contact administrator.', data: [] },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch notice categories', details: error.message, data: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    logError('API Error in notice categories route', error, { component: 'NoticeCategoriesAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/notice-categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.display_name) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      )
    }

    // Check if category name already exists
    const { data: existing } = await supabase
      .from('notice_categories')
      .select('id')
      .eq('name', body.name)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 409 }
      )
    }

    const categoryData = {
      name: body.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      display_name: body.display_name,
      description: body.description || null,
      color: body.color || '#3b82f6',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('notice_categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      logError('Error creating notice category', error, { component: 'NoticeCategoriesAPI', action: 'POST' })
      return NextResponse.json(
        { error: 'Failed to create notice category' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    logError('API Error in notice categories route', error, { component: 'NoticeCategoriesAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}