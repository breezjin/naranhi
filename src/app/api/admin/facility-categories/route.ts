import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/facility-categories - Fetch all facility categories
export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('facility_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching facility categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch facility categories' },
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