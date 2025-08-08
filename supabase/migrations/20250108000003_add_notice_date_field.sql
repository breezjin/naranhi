-- Add notice_date field to notices table
-- This represents the official notice date separate from publication date

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