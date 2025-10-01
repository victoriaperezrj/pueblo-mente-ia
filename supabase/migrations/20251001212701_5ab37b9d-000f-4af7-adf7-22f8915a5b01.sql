-- Create business_plan_progress table
CREATE TABLE public.business_plan_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(idea_id, task_id)
);

-- Enable RLS
ALTER TABLE public.business_plan_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own progress"
  ON public.business_plan_progress
  FOR SELECT
  USING (idea_id IN (
    SELECT id FROM public.business_ideas WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own progress"
  ON public.business_plan_progress
  FOR INSERT
  WITH CHECK (idea_id IN (
    SELECT id FROM public.business_ideas WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own progress"
  ON public.business_plan_progress
  FOR UPDATE
  USING (idea_id IN (
    SELECT id FROM public.business_ideas WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own progress"
  ON public.business_plan_progress
  FOR DELETE
  USING (idea_id IN (
    SELECT id FROM public.business_ideas WHERE user_id = auth.uid()
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_business_plan_progress_updated_at
  BEFORE UPDATE ON public.business_plan_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();