import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// GET /api/staff - Public endpoint to fetch staff members for frontend
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Base query with staff categories
    let query = supabase
      .from('staff_members')
      .select(`
        id,
        name,
        position,
        specialty,
        profile_image_url,
        educations,
        certifications,
        experiences,
        display_order,
        category:staff_categories(name, display_name)
      `)
      .order('display_order', { ascending: true })

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category.name', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching staff:', error)
      return NextResponse.json(
        { error: 'Failed to fetch staff members' },
        { status: 500 }
      )
    }

    // Group staff by category with frontend-compatible keys
    const groupedStaff: any = {
      medical: [],
      treatment: []
    }

    data.forEach((staff: any) => {
      if (staff.category.name === 'medical') {
        groupedStaff.medical.push(staff)
      } else if (staff.category.name === 'therapeutic') {
        groupedStaff.treatment.push(staff)
      }
    })

    return NextResponse.json({ 
      data: groupedStaff,
      categories: Array.from(new Set(data.map((staff: any) => staff.category.name)))
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}