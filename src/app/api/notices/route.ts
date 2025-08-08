import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// GET /api/notices - Public endpoint to fetch published notices for frontend
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    // Optional filters
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Base query for published notices only
    let query = supabase
      .from('notices')
      .select(`
        id,
        title,
        slug,
        plain_text,
        notice_date,
        published_at,
        created_at,
        view_count,
        tags,
        priority,
        category:notice_categories(name, display_name)
      `)
      .eq('status', 'published')
      .order('notice_date', { ascending: false, nullsFirst: false })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category.name', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching notices:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notices' },
        { status: 500 }
      )
    }

    // Transform data to match the frontend interface expectations
    const transformedNotices = data.map((notice: any) => ({
      id: notice.id,
      title: notice.title,
      slug: notice.slug,
      excerpt: notice.plain_text && notice.plain_text.length > 150 
        ? notice.plain_text.substring(0, 150) + '...' 
        : notice.plain_text, // Use plain text for excerpt
      notice_date: notice.notice_date,
      published_at: notice.published_at,
      created_at: notice.created_at,
      view_count: notice.view_count || 0,
      tags: notice.tags || [],
      priority: notice.priority || 0,
      category: notice.category
    }))

    return NextResponse.json({
      data: transformedNotices,
      meta: {
        total: transformedNotices.length,
        offset,
        limit
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}