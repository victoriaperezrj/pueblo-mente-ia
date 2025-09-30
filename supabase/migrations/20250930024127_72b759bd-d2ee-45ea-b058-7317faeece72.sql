-- Create appointments table for managing business appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  service TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own appointments"
ON public.appointments
FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own appointments"
ON public.appointments
FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_appointments_business_date ON public.appointments(business_id, appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);