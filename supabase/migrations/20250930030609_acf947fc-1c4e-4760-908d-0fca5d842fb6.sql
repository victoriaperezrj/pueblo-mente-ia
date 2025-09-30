-- Crear tabla regulatory_info
CREATE TABLE IF NOT EXISTS public.regulatory_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province TEXT NOT NULL,
  business_type TEXT,
  permit_name TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  cost_estimate_ars INTEGER,
  processing_days INTEGER,
  official_link TEXT,
  description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para regulatory_info
CREATE INDEX idx_regulatory_info_province ON public.regulatory_info(province);
CREATE INDEX idx_regulatory_info_business_type ON public.regulatory_info(business_type);

-- Poblar regulatory_info con datos de San Luis
INSERT INTO public.regulatory_info (province, business_type, permit_name, required, cost_estimate_ars, processing_days, official_link, description) VALUES
('San Luis', 'Panadería', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Panadería', 'Habilitación Bromatológica', true, 25000, 30, 'https://sanluis.gob.ar', 'Habilitación municipal para manipulación de alimentos'),
('San Luis', 'Panadería', 'Matrícula Municipal', true, 45000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Peluquería', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Peluquería', 'Habilitación Sanitaria', true, 20000, 20, 'https://sanluis.gob.ar', 'Habilitación municipal para servicios de belleza'),
('San Luis', 'Restaurante', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Restaurante', 'Habilitación Bromatológica', true, 30000, 35, 'https://sanluis.gob.ar', 'Habilitación municipal para manipulación de alimentos'),
('San Luis', 'Restaurante', 'Matrícula Municipal', true, 50000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Kiosco', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Kiosco', 'Matrícula Municipal', true, 35000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Verdulería', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Verdulería', 'Habilitación Bromatológica', true, 20000, 25, 'https://sanluis.gob.ar', 'Habilitación municipal para venta de alimentos frescos'),
('San Luis', 'Verdulería', 'Matrícula Municipal', true, 40000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Ferretería', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Ferretería', 'Matrícula Municipal', true, 45000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Taller Mecánico', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Taller Mecánico', 'Habilitación Ambiental', true, 35000, 40, 'https://sanluis.gob.ar', 'Habilitación para manejo de residuos peligrosos'),
('San Luis', 'Taller Mecánico', 'Matrícula Municipal', true, 50000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad'),
('San Luis', 'Librería', 'Inscripción AFIP Monotributo', true, 0, 1, 'https://www.afip.gob.ar/monotributo/', 'Registro obligatorio en AFIP como monotributista'),
('San Luis', 'Librería', 'Matrícula Municipal', true, 35000, 15, 'https://sanluis.gob.ar', 'Registro del local comercial en la municipalidad');

-- Crear tablas marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_per_unit DECIMAL,
  min_quantity INTEGER,
  location TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.marketplace_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_needed TEXT NOT NULL,
  quantity INTEGER,
  max_budget DECIMAL,
  deadline DATE,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for marketplace_listings
CREATE POLICY "Everyone can view active listings"
ON public.marketplace_listings
FOR SELECT
USING (active = true);

CREATE POLICY "Users can create own listings"
ON public.marketplace_listings
FOR INSERT
WITH CHECK (
  seller_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own listings"
ON public.marketplace_listings
FOR UPDATE
USING (
  seller_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own listings"
ON public.marketplace_listings
FOR DELETE
USING (
  seller_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- RLS policies for marketplace_requests
CREATE POLICY "Everyone can view open requests"
ON public.marketplace_requests
FOR SELECT
USING (status = 'open');

CREATE POLICY "Users can create own requests"
ON public.marketplace_requests
FOR INSERT
WITH CHECK (
  buyer_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own requests"
ON public.marketplace_requests
FOR UPDATE
USING (
  buyer_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own requests"
ON public.marketplace_requests
FOR DELETE
USING (
  buyer_business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Crear índices para marketplace
CREATE INDEX idx_marketplace_listings_seller ON public.marketplace_listings(seller_business_id);
CREATE INDEX idx_marketplace_listings_category ON public.marketplace_listings(category);
CREATE INDEX idx_marketplace_listings_active ON public.marketplace_listings(active) WHERE active = true;
CREATE INDEX idx_marketplace_requests_buyer ON public.marketplace_requests(buyer_business_id);
CREATE INDEX idx_marketplace_requests_status ON public.marketplace_requests(status);

-- Comentarios
COMMENT ON TABLE public.regulatory_info IS 'Información regulatoria por provincia y tipo de negocio';
COMMENT ON TABLE public.marketplace_listings IS 'Publicaciones de productos/servicios en el marketplace B2B';
COMMENT ON TABLE public.marketplace_requests IS 'Solicitudes de compra en el marketplace B2B';