import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { logError } from '@/utils/logger'

// POST /api/admin/migrate/notice-date - Run notice_date migration
export async function POST() {
  try {
    const supabase = createAdminClient()
    
    // Check if migration is already applied
    const { data: columnCheck, error: columnError } = await supabase
      .rpc('check_column_exists', {
        table_name: 'notices',
        column_name: 'notice_date'
      })
      .single()
    
    if (columnError && !columnError.message.includes('function check_column_exists')) {
      // If the RPC doesn't exist, check manually
      const { data: existingColumns } = await supabase
        .from('notices')
        .select('notice_date')
        .limit(1)
      
      if (existingColumns !== null) {
        return NextResponse.json({ 
          success: true, 
          message: 'Migration already applied - notice_date column exists' 
        })
      }
    }
    
    console.log('Applying notice_date migration...')
    
    // Apply the migration SQL
    const migrationSQL = `
      -- Add the notice_date column
      ALTER TABLE notices ADD COLUMN IF NOT EXISTS notice_date DATE;
      
      -- Add index for notice_date
      CREATE INDEX IF NOT EXISTS idx_notices_notice_date ON notices(notice_date DESC);
      
      -- Update existing notices to have notice_date set to published_at date
      UPDATE notices 
      SET notice_date = DATE(published_at) 
      WHERE notice_date IS NULL AND published_at IS NOT NULL;
      
      -- For draft notices, set notice_date to today
      UPDATE notices 
      SET notice_date = CURRENT_DATE 
      WHERE notice_date IS NULL AND status = 'draft';
    `
    
    // Execute migration in transaction
    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      query: migrationSQL 
    })
    
    if (migrationError) {
      // Try alternative approach with individual queries
      console.log('Trying individual migration steps...')
      
      // Step 1: Add column
      const { error: addColumnError } = await supabase
        .from('notices')
        .select('id')
        .limit(0)
      
      if (addColumnError && addColumnError.message.includes("notice_date")) {
        throw new Error('Column already exists or migration partially applied')
      }
      
      // Since we can't run DDL directly, we need to use the SQL editor or direct database access
      throw new Error('Database migration requires direct SQL access. Please run the migration manually in Supabase SQL editor.')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed successfully' 
    })
    
  } catch (error) {
    logError('Migration error', error, { component: 'NoticeDateMigration', action: 'POST' })
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
      instructions: `
        Please run this SQL manually in Supabase SQL editor:
        
        -- Add the notice_date column
        ALTER TABLE notices ADD COLUMN IF NOT EXISTS notice_date DATE;
        
        -- Add index for notice_date  
        CREATE INDEX IF NOT EXISTS idx_notices_notice_date ON notices(notice_date DESC);
        
        -- Update existing notices to have notice_date set to published_at date
        UPDATE notices 
        SET notice_date = DATE(published_at) 
        WHERE notice_date IS NULL AND published_at IS NOT NULL;
        
        -- For draft notices, set notice_date to today
        UPDATE notices 
        SET notice_date = CURRENT_DATE 
        WHERE notice_date IS NULL AND status = 'draft';
      `
    }, { status: 500 })
  }
}