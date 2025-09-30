-- Add UPDATE and DELETE RLS policies to inventory_movements table

-- Allow users to update movements for their own products
CREATE POLICY "Users can update own movements" 
ON public.inventory_movements
FOR UPDATE
USING (
  product_id IN (
    SELECT products.id 
    FROM products
    WHERE products.business_id IN (
      SELECT businesses.id 
      FROM businesses
      WHERE businesses.user_id = auth.uid()
    )
  )
);

-- Allow users to delete movements for their own products
CREATE POLICY "Users can delete own movements" 
ON public.inventory_movements
FOR DELETE
USING (
  product_id IN (
    SELECT products.id 
    FROM products
    WHERE products.business_id IN (
      SELECT businesses.id 
      FROM businesses
      WHERE businesses.user_id = auth.uid()
    )
  )
);