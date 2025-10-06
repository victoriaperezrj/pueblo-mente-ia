-- Eliminar la vista problemática que usa SECURITY DEFINER
DROP VIEW IF EXISTS appointments_safe;

-- No necesitamos una vista separada. 
-- En su lugar, las consultas del frontend simplemente no deben
-- seleccionar los campos customer_email y customer_phone
-- cuando no sean necesarios.

-- Las políticas RLS existentes ya protegen el acceso a appointments.