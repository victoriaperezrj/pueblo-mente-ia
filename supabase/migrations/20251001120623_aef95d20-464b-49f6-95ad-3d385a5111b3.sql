-- Add missing DELETE policy for business_ideas table
CREATE POLICY "Users can delete own ideas"
  ON business_ideas FOR DELETE
  USING (auth.uid() = user_id);