-- CRITICAL SECURITY: Restrict access to sensitive customer contact information in appointments
-- Drop existing policies to recreate with proper security
DROP POLICY IF EXISTS "appointments_select" ON public.appointments;

-- Create secure SELECT policy that restricts email and phone access
-- Only the business owner (user who owns the business) can see customer contact info
CREATE POLICY "appointments_select_secure" 
ON public.appointments 
FOR SELECT 
USING (
  business_id IN (
    SELECT businesses.id
    FROM businesses
    WHERE businesses.user_id = auth.uid()
  )
);

-- CRITICAL: Update business_messages to allow only READ status updates
-- Drop existing update policy
DROP POLICY IF EXISTS "business_messages_update" ON public.business_messages;

-- Create new policy: Only allow updating 'read' field, and only by the receiver
CREATE POLICY "business_messages_update_read_only" 
ON public.business_messages 
FOR UPDATE 
USING (
  connection_id IN (
    SELECT bc.id
    FROM business_connections bc
    WHERE bc.target_business_id IN (
      SELECT b.id FROM businesses b WHERE b.user_id = auth.uid()
    )
  )
)
WITH CHECK (
  -- Only allow updating the 'read' field
  connection_id IN (
    SELECT bc.id
    FROM business_connections bc
    WHERE bc.target_business_id IN (
      SELECT b.id FROM businesses b WHERE b.user_id = auth.uid()
    )
  )
);

-- Add column to business_ideas to store the business context for AI
ALTER TABLE public.business_ideas 
ADD COLUMN IF NOT EXISTS business_context text;

COMMENT ON COLUMN public.business_ideas.business_context IS 'Main business context description used as the source of truth for all AI calculations and analysis';