import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/facilities/[id] - Fetch single facility photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('facility_photos')
      .select(`
        *,
        category:facility_categories(name, display_name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching facility photo:', error)
      return NextResponse.json(
        { error: 'Facility photo not found' },
        { status: 404 }
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

// PUT /api/admin/facilities/[id] - Update facility photo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.image_url || !body.alt_text || !body.category_id) {
      return NextResponse.json(
        { error: 'Title, image URL, alt text, and category are required' },
        { status: 400 }
      )
    }

    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('facility_photos')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:facility_categories(name, display_name)
      `)
      .single()

    if (error) {
      console.error('Error updating facility photo:', error)
      return NextResponse.json(
        { error: 'Failed to update facility photo' },
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

// DELETE /api/admin/facilities/[id] - Delete facility photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Check if facility photo exists
    const { data: existingPhoto, error: fetchError } = await supabase
      .from('facility_photos')
      .select('title')
      .eq('id', id)
      .single()

    if (fetchError || !existingPhoto) {
      return NextResponse.json(
        { error: 'Facility photo not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('facility_photos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting facility photo:', error)
      return NextResponse.json(
        { error: 'Failed to delete facility photo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: `Facility photo "${existingPhoto.title}" deleted successfully` 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}