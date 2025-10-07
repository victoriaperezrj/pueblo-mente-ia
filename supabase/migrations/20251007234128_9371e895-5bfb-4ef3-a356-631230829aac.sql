-- ==========================================
-- SECURITY FIX: appointments_safe RLS + Rate Limiting
-- ==========================================

-- 1. Drop and recreate appointments_safe view with security_invoker
DROP VIEW IF EXISTS appointments_safe;

CREATE VIEW appointments_safe WITH (security_invoker = true) AS
SELECT 
  id,
  business_id,
  customer_name,
  customer_email,
  customer_phone,
  appointment_date,
  start_time,
  end_time,
  status,
  notes,
  created_at,
  updated_at
FROM appointments;

-- 2. Create rate limiting table for API calls
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR NOT NULL,
  endpoint VARCHAR DEFAULT 'analyze-business-idea',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_time 
ON api_rate_limits(ip_address, endpoint, created_at);

-- 3. Auto-cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM api_rate_limits 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- 4. Enable RLS on rate limits table
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access on rate limits"
ON api_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Remove pending_role trigger if it exists (security: roles should be server-side)
-- This prevents client-side role manipulation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;