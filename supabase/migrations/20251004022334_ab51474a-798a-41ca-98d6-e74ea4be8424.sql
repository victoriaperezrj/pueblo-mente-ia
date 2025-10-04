-- Drop existing policies to recreate them with correct names and logic
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can create own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

DROP POLICY IF EXISTS "Users can view own sales" ON sales;
DROP POLICY IF EXISTS "Users can create own sales" ON sales;
DROP POLICY IF EXISTS "Users can update own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON sales;

DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can create own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;

DROP POLICY IF EXISTS "Users can view own movements" ON inventory_movements;
DROP POLICY IF EXISTS "Users can create own movements" ON inventory_movements;
DROP POLICY IF EXISTS "Users can update own movements" ON inventory_movements;
DROP POLICY IF EXISTS "Users can delete own movements" ON inventory_movements;

DROP POLICY IF EXISTS "Authenticated users can view active listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Users can create own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Users can update own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON marketplace_listings;

DROP POLICY IF EXISTS "Authenticated users can view open requests" ON marketplace_requests;
DROP POLICY IF EXISTS "Users can create own requests" ON marketplace_requests;
DROP POLICY IF EXISTS "Users can update own requests" ON marketplace_requests;
DROP POLICY IF EXISTS "Users can delete own requests" ON marketplace_requests;

DROP POLICY IF EXISTS "Users can view own connections" ON business_connections;
DROP POLICY IF EXISTS "Users can create connection requests" ON business_connections;
DROP POLICY IF EXISTS "Target users can update connection status" ON business_connections;

DROP POLICY IF EXISTS "Users can view messages from own connections" ON business_messages;
DROP POLICY IF EXISTS "Users can send messages in accepted connections" ON business_messages;
DROP POLICY IF EXISTS "Users can mark received messages as read" ON business_messages;

DROP POLICY IF EXISTS "Users can view own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;

DROP POLICY IF EXISTS "Users can view own ideas" ON business_ideas;
DROP POLICY IF EXISTS "Users can create own ideas" ON business_ideas;
DROP POLICY IF EXISTS "Users can update own ideas" ON business_ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON business_ideas;

DROP POLICY IF EXISTS "Users can view own progress" ON business_plan_progress;
DROP POLICY IF EXISTS "Users can create own progress" ON business_plan_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON business_plan_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON business_plan_progress;

-- Ensure RLS is enabled on all tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_progress ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "appointments_select" ON appointments FOR SELECT 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "appointments_insert" ON appointments FOR INSERT 
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "appointments_update" ON appointments FOR UPDATE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "appointments_delete" ON appointments FOR DELETE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Customers policies
CREATE POLICY "customers_select" ON customers FOR SELECT 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "customers_insert" ON customers FOR INSERT 
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "customers_update" ON customers FOR UPDATE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "customers_delete" ON customers FOR DELETE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Sales policies
CREATE POLICY "sales_select" ON sales FOR SELECT 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "sales_insert" ON sales FOR INSERT 
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "sales_update" ON sales FOR UPDATE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "sales_delete" ON sales FOR DELETE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Products policies
CREATE POLICY "products_select" ON products FOR SELECT 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "products_insert" ON products FOR INSERT 
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "products_update" ON products FOR UPDATE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "products_delete" ON products FOR DELETE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Expenses policies
CREATE POLICY "expenses_select" ON expenses FOR SELECT 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "expenses_insert" ON expenses FOR INSERT 
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "expenses_update" ON expenses FOR UPDATE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "expenses_delete" ON expenses FOR DELETE 
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Inventory movements policies
CREATE POLICY "inventory_movements_select" ON inventory_movements FOR SELECT 
USING (product_id IN (SELECT id FROM products WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

CREATE POLICY "inventory_movements_insert" ON inventory_movements FOR INSERT 
WITH CHECK (product_id IN (SELECT id FROM products WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

CREATE POLICY "inventory_movements_update" ON inventory_movements FOR UPDATE 
USING (product_id IN (SELECT id FROM products WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

CREATE POLICY "inventory_movements_delete" ON inventory_movements FOR DELETE 
USING (product_id IN (SELECT id FROM products WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

-- Marketplace listings policies
CREATE POLICY "marketplace_listings_select" ON marketplace_listings FOR SELECT 
USING (seller_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_listings_insert" ON marketplace_listings FOR INSERT 
WITH CHECK (seller_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_listings_update" ON marketplace_listings FOR UPDATE 
USING (seller_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_listings_delete" ON marketplace_listings FOR DELETE 
USING (seller_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Marketplace requests policies
CREATE POLICY "marketplace_requests_select" ON marketplace_requests FOR SELECT 
USING (buyer_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_requests_insert" ON marketplace_requests FOR INSERT 
WITH CHECK (buyer_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_requests_update" ON marketplace_requests FOR UPDATE 
USING (buyer_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_requests_delete" ON marketplace_requests FOR DELETE 
USING (buyer_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Business connections policies
CREATE POLICY "business_connections_select" ON business_connections FOR SELECT 
USING (
  requester_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) 
  OR target_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

CREATE POLICY "business_connections_insert" ON business_connections FOR INSERT 
WITH CHECK (requester_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "business_connections_update" ON business_connections FOR UPDATE 
USING (
  requester_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) 
  OR target_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

CREATE POLICY "business_connections_delete" ON business_connections FOR DELETE 
USING (requester_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Business messages policies
CREATE POLICY "business_messages_select" ON business_messages FOR SELECT 
USING (
  connection_id IN (
    SELECT id FROM business_connections 
    WHERE requester_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) 
    OR target_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  )
);

CREATE POLICY "business_messages_insert" ON business_messages FOR INSERT 
WITH CHECK (sender_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "business_messages_delete" ON business_messages FOR DELETE 
USING (sender_business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Businesses policies
CREATE POLICY "businesses_select" ON businesses FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "businesses_insert" ON businesses FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "businesses_update" ON businesses FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "businesses_delete" ON businesses FOR DELETE 
USING (user_id = auth.uid());

-- Business ideas policies
CREATE POLICY "business_ideas_select" ON business_ideas FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "business_ideas_insert" ON business_ideas FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "business_ideas_update" ON business_ideas FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "business_ideas_delete" ON business_ideas FOR DELETE 
USING (user_id = auth.uid());

-- Business plan progress policies
CREATE POLICY "business_plan_progress_select" ON business_plan_progress FOR SELECT 
USING (idea_id IN (SELECT id FROM business_ideas WHERE user_id = auth.uid()));

CREATE POLICY "business_plan_progress_insert" ON business_plan_progress FOR INSERT 
WITH CHECK (idea_id IN (SELECT id FROM business_ideas WHERE user_id = auth.uid()));

CREATE POLICY "business_plan_progress_update" ON business_plan_progress FOR UPDATE 
USING (idea_id IN (SELECT id FROM business_ideas WHERE user_id = auth.uid()));

CREATE POLICY "business_plan_progress_delete" ON business_plan_progress FOR DELETE 
USING (idea_id IN (SELECT id FROM business_ideas WHERE user_id = auth.uid()));