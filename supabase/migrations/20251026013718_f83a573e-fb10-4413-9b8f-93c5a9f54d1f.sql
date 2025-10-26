-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS user_tools CASCADE;
DROP TABLE IF EXISTS onboarding_data CASCADE;

-- Create onboarding_data table
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('emprendedor', 'negocio', 'pyme')),
  
  -- Campos para emprendedor
  problem_description TEXT,
  target_customer TEXT,
  available_time TEXT,
  initial_budget TEXT,
  
  -- Campos para negocio
  business_type TEXT,
  time_in_business TEXT,
  monthly_customers TEXT,
  main_problem TEXT,
  
  -- Campos para pyme
  company_description TEXT,
  employee_count TEXT,
  monthly_revenue TEXT,
  main_challenge TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_tools table
CREATE TABLE user_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_key TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_key)
);

-- Enable RLS
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_data
CREATE POLICY "Users can view their own onboarding data"
  ON onboarding_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data"
  ON onboarding_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data"
  ON onboarding_data FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_tools
CREATE POLICY "Users can view their own tools"
  ON user_tools FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tools"
  ON user_tools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tools"
  ON user_tools FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_onboarding_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_data_updated_at
  BEFORE UPDATE ON onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_data_updated_at();

-- Add onboarding_completed column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
  END IF;
END $$;