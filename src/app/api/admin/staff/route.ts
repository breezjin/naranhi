import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/staff - Fetch all staff members
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('staff_members')
      .select(`
        *,
        category:staff_categories(name, display_name)
      `)
      .order('display_order', { ascending: true })

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category.name', category)
    }

    // Search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,position.ilike.%${search}%,specialty.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching staff:', error)
      return NextResponse.json(
        { error: 'Failed to fetch staff members' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/staff - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.position || !body.category_id) {
      return NextResponse.json(
        { error: 'Name, position, and category are required' },
        { status: 400 }
      )
    }

    // Clean up empty strings from arrays
    const cleanData = {
      ...body,
      educations: body.educations?.filter((item: string) => item.trim() !== '') || [],
      certifications: body.certifications?.filter((item: string) => item.trim() !== '') || [],
      experiences: body.experiences?.filter((item: string) => item.trim() !== '') || [],
      specialty: body.specialty || null
    }

    const { data, error } = await supabase
      .from('staff_members')
      .insert([cleanData])
      .select(`
        *,
        category:staff_categories(name, display_name)
      `)
      .single()

    if (error) {
      console.error('Error creating staff:', error)
      return NextResponse.json(
        { error: 'Failed to create staff member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}