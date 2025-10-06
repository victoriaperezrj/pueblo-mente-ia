-- =====================================================
-- CORRECCION DE SEGURIDAD: PROTEGER DATOS SENSIBLES
-- =====================================================

-- 1. Crear vista segura de appointments (sin emails/teléfonos)
CREATE OR REPLACE VIEW appointments_safe AS
SELECT 
  id,
  business_id,
  appointment_date,
  start_time,
  end_time,
  status,
  service,
  notes,
  created_at,
  updated_at
FROM appointments;

-- 2. Corregir policy de profiles - solo usuario propio
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 3. Restringir regulatory_info a usuarios autenticados
DROP POLICY IF EXISTS "Everyone can view regulatory info" ON regulatory_info;

CREATE POLICY "Authenticated users view regulatory info"
ON regulatory_info FOR SELECT
USING (auth.uid() IS NOT NULL);