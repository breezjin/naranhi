# Database Migration Instructions

## Issue
The notice creation is failing with error: `"Could not find the 'notice_date' column of 'notices' in the schema cache"`

## Solution
Run the following SQL script in your Supabase SQL Editor:

### Migration SQL

```sql
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

-- Add comment for documentation
COMMENT ON COLUMN notices.notice_date IS 'Official notice date for display purposes, separate from publication timestamp';
```

### How to Apply

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/projects
2. Select your project: `zdthxekwgqcsqryszavw`
3. Navigate to the SQL Editor
4. Create a new query
5. Copy and paste the above SQL
6. Click "Run" to execute the migration

### Verification

After running the migration, you can verify it worked by checking:

```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notices' AND column_name = 'notice_date';

-- Check existing data
SELECT id, title, notice_date, published_at, created_at 
FROM notices 
LIMIT 5;
```

### After Migration

Once the migration is complete, the notice creation and editing functionality will work properly with the new `notice_date` field.