import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/facilities - Fetch all facility photos
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('facility_photos')
      .select(`
        *,
        category:facility_categories(name, display_name)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('facility_categories.name', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching facility photos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch facility photos' },
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

// POST /api/admin/facilities - Create new facility photo
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.image_url || !body.alt_text || !body.category_id) {
      return NextResponse.json(
        { error: 'Title, image URL, alt text, and category are required' },
        { status: 400 }
      )
    }

    // Get the highest display_order for the category
    const { data: maxOrderData } = await supabase
      .from('facility_photos')
      .select('display_order')
      .eq('category_id', body.category_id)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

    const photoData = {
      ...body,
      display_order: nextOrder,
      is_active: true,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('facility_photos')
      .insert(photoData)
      .select(`
        *,
        category:facility_categories(name, display_name)
      `)
      .single()

    if (error) {
      console.error('Error creating facility photo:', error)
      return NextResponse.json(
        { error: 'Failed to create facility photo' },
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