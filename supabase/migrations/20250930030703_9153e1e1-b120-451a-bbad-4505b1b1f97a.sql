-- Enable RLS on regulatory_info (this is public data, so everyone can read it)
ALTER TABLE public.regulatory_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view regulatory info"
ON public.regulatory_info
FOR SELECT
USING (true);