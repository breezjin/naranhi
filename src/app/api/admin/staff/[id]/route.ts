import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/staff/[id] - Fetch single staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('staff_members')
      .select(`
        *,
        category:staff_categories(name, display_name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching staff member:', error)
      return NextResponse.json(
        { error: 'Staff member not found' },
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

// PUT /api/admin/staff/[id] - Update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
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
      specialty: body.specialty || null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('staff_members')
      .update(cleanData)
      .eq('id', id)
      .select(`
        *,
        category:staff_categories(name, display_name)
      `)
      .single()

    if (error) {
      console.error('Error updating staff member:', error)
      return NextResponse.json(
        { error: 'Failed to update staff member' },
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

// DELETE /api/admin/staff/[id] - Delete staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Check if staff member exists
    const { data: existingStaff, error: fetchError } = await supabase
      .from('staff_members')
      .select('name')
      .eq('id', id)
      .single()

    if (fetchError || !existingStaff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting staff member:', error)
      return NextResponse.json(
        { error: 'Failed to delete staff member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: `Staff member "${existingStaff.name}" deleted successfully` 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}