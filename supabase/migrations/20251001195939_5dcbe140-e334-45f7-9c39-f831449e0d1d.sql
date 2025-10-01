-- Add contact_visibility to businesses table
CREATE TYPE contact_visibility AS ENUM ('public', 'marketplace_only', 'private');

ALTER TABLE public.businesses 
ADD COLUMN contact_visibility contact_visibility NOT NULL DEFAULT 'marketplace_only';

-- Create business_connections table
CREATE TABLE public.business_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  target_business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
  message text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(requester_business_id, target_business_id)
);

-- Create business_messages table
CREATE TABLE public.business_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES public.business_connections(id) ON DELETE CASCADE NOT NULL,
  sender_business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.business_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_messages ENABLE ROW LEVEL SECURITY;

-- Drop public policies for marketplace tables
DROP POLICY IF EXISTS "Everyone can view active listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Everyone can view open requests" ON public.marketplace_requests;

-- Create authenticated-only policies for marketplace_listings
CREATE POLICY "Authenticated users can view active listings"
ON public.marketplace_listings
FOR SELECT
TO authenticated
USING (active = true);

-- Create authenticated-only policies for marketplace_requests
CREATE POLICY "Authenticated users can view open requests"
ON public.marketplace_requests
FOR SELECT
TO authenticated
USING (status = 'open');

-- RLS policies for business_connections
CREATE POLICY "Users can view own connections"
ON public.business_connections
FOR SELECT
TO authenticated
USING (
  requester_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  ) OR
  target_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create connection requests"
ON public.business_connections
FOR INSERT
TO authenticated
WITH CHECK (
  requester_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Target users can update connection status"
ON public.business_connections
FOR UPDATE
TO authenticated
USING (
  target_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- RLS policies for business_messages
CREATE POLICY "Users can view messages from own connections"
ON public.business_messages
FOR SELECT
TO authenticated
USING (
  connection_id IN (
    SELECT id FROM public.business_connections
    WHERE requester_business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    ) OR target_business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can send messages in accepted connections"
ON public.business_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  ) AND
  connection_id IN (
    SELECT id FROM public.business_connections
    WHERE status = 'accepted' AND (
      requester_business_id IN (
        SELECT id FROM public.businesses WHERE user_id = auth.uid()
      ) OR
      target_business_id IN (
        SELECT id FROM public.businesses WHERE user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can mark received messages as read"
ON public.business_messages
FOR UPDATE
TO authenticated
USING (
  connection_id IN (
    SELECT id FROM public.business_connections
    WHERE requester_business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    ) OR target_business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  ) AND sender_business_id NOT IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Add trigger for updated_at on business_connections
CREATE TRIGGER update_business_connections_updated_at
BEFORE UPDATE ON public.business_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();