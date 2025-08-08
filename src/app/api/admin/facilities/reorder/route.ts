import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('email', user.email)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid updates array' },
        { status: 400 }
      )
    }

    // Validate updates format
    for (const update of updates) {
      if (!update.id || typeof update.display_order !== 'number') {
        return NextResponse.json(
          { error: 'Invalid update format. Required: {id: string, display_order: number}' },
          { status: 400 }
        )
      }
    }

    // Batch update facility photos display orders using a transaction-like approach
    const results = []
    for (const update of updates) {
      const { data, error } = await supabase
        .from('facility_photos')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
        .select('id, display_order')

      if (error) {
        console.error('Error updating facility photo order:', error)
        return NextResponse.json(
          { error: `Failed to update facility photo order: ${error.message}` },
          { status: 500 }
        )
      }

      results.push(data?.[0])
    }

    // Log admin activity
    await supabase.from('admin_activity_log').insert({
      admin_user_id: user.id,
      action: 'facility_reorder',
      details: {
        updated_count: updates.length,
        photo_ids: updates.map(u => u.id)
      }
    })

    return NextResponse.json({
      success: true,
      updated: results,
      message: `Successfully updated ${updates.length} facility photos' display order`
    })

  } catch (error) {
    console.error('Facility reorder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}