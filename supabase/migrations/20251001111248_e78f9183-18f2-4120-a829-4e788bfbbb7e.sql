-- Create business_ideas table for entrepreneur onboarding
CREATE TABLE IF NOT EXISTS public.business_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_description TEXT NOT NULL,
  location TEXT NOT NULL,
  industry TEXT NOT NULL,
  validation_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.business_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own ideas"
  ON public.business_ideas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ideas"
  ON public.business_ideas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON public.business_ideas
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_business_ideas_updated_at
  BEFORE UPDATE ON public.business_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();