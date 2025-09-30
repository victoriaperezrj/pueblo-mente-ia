-- Create outbox_events table for event-driven architecture
CREATE TABLE IF NOT EXISTS public.outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  aggregate_id UUID NOT NULL,
  aggregate_type TEXT NOT NULL, -- 'sale', 'inventory', 'customer', etc.
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own events"
ON public.outbox_events
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own events"
ON public.outbox_events
FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_outbox_events_business_id ON public.outbox_events(business_id);
CREATE INDEX idx_outbox_events_processed ON public.outbox_events(processed) WHERE processed = FALSE;
CREATE INDEX idx_outbox_events_type ON public.outbox_events(event_type);
CREATE INDEX idx_outbox_events_created_at ON public.outbox_events(created_at DESC);

-- Add comment
COMMENT ON TABLE public.outbox_events IS 'Event store for event-driven architecture - enables future integrations with enterprise systems';