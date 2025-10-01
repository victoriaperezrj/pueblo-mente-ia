-- Add user_type column to profiles table
CREATE TYPE user_type AS ENUM ('entrepreneur', 'business_owner');

ALTER TABLE public.profiles 
ADD COLUMN user_type user_type;

-- Add index for faster queries
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);