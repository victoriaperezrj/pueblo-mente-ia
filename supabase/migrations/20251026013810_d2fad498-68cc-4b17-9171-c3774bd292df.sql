-- Update onboarding_data table to match the correct user_type enum
ALTER TABLE onboarding_data DROP CONSTRAINT IF EXISTS onboarding_data_stage_check;
ALTER TABLE onboarding_data 
  ADD CONSTRAINT onboarding_data_stage_check 
  CHECK (stage IN ('entrepreneur', 'business', 'pyme_enterprise'));