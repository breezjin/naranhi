import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// GET /api/facilities - Public endpoint to fetch facility photos for frontend
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Base query with facility categories
    let query = supabase
      .from('facility_photos')
      .select(`
        id,
        title,
        image_url,
        thumbnail_url,
        alt_text,
        caption,
        width,
        height,
        display_order,
        category:facility_categories(name, display_name)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category.name', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching facilities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch facility photos' },
        { status: 500 }
      )
    }

    // Group facilities by category and transform to match the expected Photo interface
    const groupedFacilities = data.reduce((acc: any, facility: any) => {
      const categoryName = facility.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      
      // Transform database structure to match the existing Photo interface
      acc[categoryName].push({
        photoIndex: facility.display_order,
        src: facility.image_url,
        original: facility.image_url,
        width: facility.width,
        height: facility.height,
        caption: facility.caption,
        alt: facility.alt_text,
      })
      
      return acc
    }, {})

    return NextResponse.json({ 
      data: groupedFacilities,
      categories: Array.from(new Set(data.map((facility: any) => facility.category.name)))
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}