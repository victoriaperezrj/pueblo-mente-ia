-- =====================================================
-- ERP MODELS FOR PUEBLO MENTE IA
-- Modelos de datos para Cuentas Corrientes, Stock y Tesorería
-- =====================================================

-- =====================================================
-- 1. CLIENTES Y PROVEEDORES (CRM/FINANCIERO)
-- =====================================================

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Datos básicos
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  tax_id VARCHAR(20), -- CUIT/CUIL
  tax_condition VARCHAR(50), -- Responsable Inscripto, Monotributista, etc.

  -- Contacto
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),

  -- Dirección
  address VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Argentina',

  -- Comercial
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 0, -- días de plazo
  price_list VARCHAR(50) DEFAULT 'default',

  -- Saldos
  current_balance DECIMAL(15,2) DEFAULT 0, -- Saldo actual (positivo = nos debe)

  -- Metadata
  notes TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Datos básicos
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  tax_id VARCHAR(20),
  tax_condition VARCHAR(50),

  -- Contacto
  email VARCHAR(255),
  phone VARCHAR(50),
  contact_name VARCHAR(255),

  -- Dirección
  address VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),

  -- Comercial
  payment_terms INTEGER DEFAULT 0,

  -- Saldos
  current_balance DECIMAL(15,2) DEFAULT 0, -- Saldo actual (positivo = le debemos)

  -- Metadata
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MOVIMIENTOS DE CUENTA CORRIENTE
-- =====================================================

-- Tipos de documentos/movimientos
CREATE TYPE document_type AS ENUM (
  'invoice',      -- Factura
  'credit_note',  -- Nota de crédito
  'debit_note',   -- Nota de débito
  'receipt',      -- Recibo
  'payment',      -- Pago
  'adjustment'    -- Ajuste
);

-- Movimientos de Cuenta Corriente de Clientes
CREATE TABLE IF NOT EXISTS client_account_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- Documento
  document_type document_type NOT NULL,
  document_number VARCHAR(50),
  document_date DATE NOT NULL,
  due_date DATE,

  -- Montos
  debit DECIMAL(15,2) DEFAULT 0,   -- Lo que nos debe (facturas)
  credit DECIMAL(15,2) DEFAULT 0,  -- Lo que pagó (recibos)
  balance DECIMAL(15,2) DEFAULT 0, -- Saldo después del movimiento

  -- Detalles
  description TEXT,
  reference VARCHAR(255),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimientos de Cuenta Corriente de Proveedores
CREATE TABLE IF NOT EXISTS supplier_account_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,

  -- Documento
  document_type document_type NOT NULL,
  document_number VARCHAR(50),
  document_date DATE NOT NULL,
  due_date DATE,

  -- Montos
  debit DECIMAL(15,2) DEFAULT 0,   -- Lo que pagamos
  credit DECIMAL(15,2) DEFAULT 0,  -- Lo que nos facturan
  balance DECIMAL(15,2) DEFAULT 0,

  -- Detalles
  description TEXT,
  reference VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCTOS Y STOCK
-- =====================================================

-- Categorías de productos
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificación
  sku VARCHAR(100),
  barcode VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),

  -- Precios
  cost_price DECIMAL(15,2) DEFAULT 0,
  sale_price DECIMAL(15,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 21.00, -- IVA en Argentina

  -- Stock
  current_stock DECIMAL(15,3) DEFAULT 0,
  min_stock DECIMAL(15,3) DEFAULT 0,
  max_stock DECIMAL(15,3) DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'unidad', -- unidad, kg, litro, etc.

  -- Proveedor principal
  main_supplier_id UUID REFERENCES suppliers(id),

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  is_service BOOLEAN DEFAULT false, -- true si es servicio (no maneja stock)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimientos de Stock
CREATE TYPE stock_movement_type AS ENUM (
  'purchase',     -- Compra
  'sale',         -- Venta
  'adjustment',   -- Ajuste manual
  'transfer',     -- Transferencia entre depósitos
  'return',       -- Devolución
  'production',   -- Producción
  'consumption'   -- Consumo interno
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,

  -- Movimiento
  movement_type stock_movement_type NOT NULL,
  quantity DECIMAL(15,3) NOT NULL, -- positivo = entrada, negativo = salida
  unit_cost DECIMAL(15,2),

  -- Stock resultante
  stock_before DECIMAL(15,3),
  stock_after DECIMAL(15,3),

  -- Referencia al documento origen
  reference_type VARCHAR(50), -- 'purchase_order', 'sale', etc.
  reference_id UUID,

  -- Detalles
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. COMPRAS
-- =====================================================

CREATE TYPE purchase_status AS ENUM (
  'draft',      -- Borrador
  'pending',    -- Pendiente de aprobación
  'approved',   -- Aprobada
  'received',   -- Recibida
  'cancelled'   -- Cancelada
);

-- Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),

  -- Documento
  order_number VARCHAR(50),
  order_date DATE NOT NULL,
  expected_date DATE,

  -- Estado
  status purchase_status DEFAULT 'draft',

  -- Totales
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detalle de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),

  description VARCHAR(255),
  quantity DECIMAL(15,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00,

  subtotal DECIMAL(15,2),
  tax_amount DECIMAL(15,2),
  total DECIMAL(15,2),

  -- Recepción
  quantity_received DECIMAL(15,3) DEFAULT 0
);

-- =====================================================
-- 5. TESORERÍA (Solo estructura de datos)
-- =====================================================

-- Cuentas bancarias/cajas
CREATE TABLE IF NOT EXISTS treasury_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50), -- 'bank', 'cash', 'digital_wallet'
  bank_name VARCHAR(255),
  account_number VARCHAR(100),
  cbu VARCHAR(30),

  currency VARCHAR(3) DEFAULT 'ARS',
  current_balance DECIMAL(15,2) DEFAULT 0,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimientos de Tesorería
CREATE TYPE treasury_movement_type AS ENUM (
  'income',       -- Ingreso
  'expense',      -- Egreso
  'transfer_in',  -- Transferencia entrada
  'transfer_out'  -- Transferencia salida
);

CREATE TABLE IF NOT EXISTS treasury_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES treasury_accounts(id) ON DELETE CASCADE,

  -- Movimiento
  movement_type treasury_movement_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2),

  -- Fecha
  movement_date DATE NOT NULL,

  -- Categorización
  category VARCHAR(100),
  subcategory VARCHAR(100),

  -- Referencia
  reference_type VARCHAR(50),
  reference_id UUID,

  -- Detalles
  description TEXT,
  payee VARCHAR(255), -- A quién se le paga o de quién se recibe

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_tax_id ON clients(tax_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_client_movements_client ON client_account_movements(client_id);
CREATE INDEX IF NOT EXISTS idx_supplier_movements_supplier ON supplier_account_movements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_treasury_movements_account ON treasury_movements(account_id);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_account_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_account_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (los usuarios solo ven sus propios datos)
CREATE POLICY clients_policy ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY suppliers_policy ON suppliers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY products_policy ON products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY stock_movements_policy ON stock_movements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY client_movements_policy ON client_account_movements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY supplier_movements_policy ON supplier_account_movements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY treasury_accounts_policy ON treasury_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY treasury_movements_policy ON treasury_movements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY purchase_orders_policy ON purchase_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY product_categories_policy ON product_categories FOR ALL USING (auth.uid() = user_id);
