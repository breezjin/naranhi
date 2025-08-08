import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// GET /api/notices/[id] - Public endpoint to fetch a single notice for frontend
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient()

    // Fetch the notice with category information
    const { data: notice, error } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        slug,
        content,
        html_content,
        plain_text,
        notice_date,
        published_at,
        created_at,
        updated_at,
        view_count,
        tags,
        priority,
        meta_title,
        meta_description,
        category:notice_categories(name, display_name)
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return NextResponse.json(
          { error: 'Notice not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching notice:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notice' },
        { status: 500 }
      )
    }

    // Increment view count
    try {
      await supabase
        .from('notices')
        .update({ view_count: notice.view_count + 1 })
        .eq('id', id)
    } catch (viewError) {
      // View count update failure shouldn't prevent the notice from being returned
      console.warn('Failed to update view count:', viewError)
    }

    // Transform the data for frontend consumption
    const transformedNotice = {
      id: notice.id,
      title: notice.title,
      slug: notice.slug,
      content: notice.html_content || notice.content,
      plain_text: notice.plain_text,
      excerpt: notice.plain_text && notice.plain_text.length > 150 
        ? notice.plain_text
            .replace(/\[이미지[^\]]*\]/g, '') // Remove [이미지...] tags
            .replace(/image\s*:/gi, '') // Remove image: prefixes  
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
            .substring(0, 150) + '...'
        : notice.plain_text?.replace(/\[이미지[^\]]*\]/g, '').replace(/image\s*:/gi, '').trim(),
      notice_date: notice.notice_date,
      published_at: notice.published_at,
      created_at: notice.created_at,
      updated_at: notice.updated_at,
      view_count: notice.view_count + 1, // Return the incremented count
      tags: notice.tags || [],
      priority: notice.priority || 0,
      meta_title: notice.meta_title,
      meta_description: notice.meta_description,
      category: notice.category
    }

    return NextResponse.json({ data: transformedNotice })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}