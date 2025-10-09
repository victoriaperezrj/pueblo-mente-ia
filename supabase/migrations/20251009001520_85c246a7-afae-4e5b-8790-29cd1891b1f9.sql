-- Actualizar tabla profiles para usar el nuevo enum app_role

-- 1. Remover la columna user_type antigua si existe
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS user_type;

-- 2. Agregar nueva columna user_type con el tipo app_role
ALTER TABLE public.profiles 
  ADD COLUMN user_type public.app_role;