/**
 * ERP Service - Gestión de Clientes, Stock y Tesorería
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface Client {
  id: string;
  user_id: string;
  name: string;
  business_name?: string;
  tax_id?: string;
  tax_condition?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  credit_limit: number;
  payment_terms: number;
  current_balance: number;
  notes?: string;
  tags?: string[];
  is_active: boolean;
  created_at: string;
}

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  business_name?: string;
  tax_id?: string;
  email?: string;
  phone?: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  sku?: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id?: string;
  cost_price: number;
  sale_price: number;
  tax_rate: number;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  is_active: boolean;
  is_service: boolean;
  created_at: string;
}

export interface AccountMovement {
  id: string;
  client_id?: string;
  supplier_id?: string;
  document_type: string;
  document_number?: string;
  document_date: string;
  due_date?: string;
  debit: number;
  credit: number;
  balance: number;
  description?: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  unit_cost?: number;
  stock_before: number;
  stock_after: number;
  notes?: string;
  created_at: string;
}

// =====================================================
// CLIENTS SERVICE
// =====================================================

export const clientsService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(client: Partial<Client>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('clients')
      .insert({ ...client, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...client, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getMovements(clientId: string): Promise<AccountMovement[]> {
    const { data, error } = await supabase
      .from('client_account_movements')
      .select('*')
      .eq('client_id', clientId)
      .order('document_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addMovement(movement: Partial<AccountMovement> & { client_id: string }): Promise<AccountMovement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Get current client balance
    const client = await this.getById(movement.client_id);
    if (!client) throw new Error('Client not found');

    const newBalance = client.current_balance + (movement.debit || 0) - (movement.credit || 0);

    // Insert movement
    const { data, error } = await supabase
      .from('client_account_movements')
      .insert({
        ...movement,
        user_id: user.id,
        balance: newBalance
      })
      .select()
      .single();

    if (error) throw error;

    // Update client balance
    await this.update(movement.client_id, { current_balance: newBalance });

    return data;
  },

  async getWithPositiveBalance(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .gt('current_balance', 0)
      .order('current_balance', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTotalReceivables(): Promise<number> {
    const { data, error } = await supabase
      .from('clients')
      .select('current_balance')
      .gt('current_balance', 0);

    if (error) throw error;
    return data?.reduce((sum, c) => sum + c.current_balance, 0) || 0;
  }
};

// =====================================================
// PRODUCTS SERVICE
// =====================================================

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(product: Partial<Product>): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async adjustStock(
    productId: string,
    quantity: number,
    movementType: string,
    notes?: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const product = await this.getById(productId);
    if (!product) throw new Error('Product not found');

    const stockBefore = product.current_stock;
    const stockAfter = stockBefore + quantity;

    // Insert movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        user_id: user.id,
        product_id: productId,
        movement_type: movementType,
        quantity,
        stock_before: stockBefore,
        stock_after: stockAfter,
        notes
      });

    if (movementError) throw movementError;

    // Update product stock
    await this.update(productId, { current_stock: stockAfter });
  },

  async getMovements(productId: string): Promise<StockMovement[]> {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getLowStock(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_service', false)
      .filter('current_stock', 'lte', 'min_stock');

    if (error) throw error;
    return data || [];
  },

  async getTotalStockValue(): Promise<number> {
    const { data, error } = await supabase
      .from('products')
      .select('current_stock, cost_price')
      .eq('is_service', false);

    if (error) throw error;
    return data?.reduce((sum, p) => sum + (p.current_stock * p.cost_price), 0) || 0;
  }
};

// =====================================================
// SUPPLIERS SERVICE
// =====================================================

export const suppliersService = {
  async getAll(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(supplier: Partial<Supplier>): Promise<Supplier> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('suppliers')
      .insert({ ...supplier, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTotalPayables(): Promise<number> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('current_balance')
      .gt('current_balance', 0);

    if (error) throw error;
    return data?.reduce((sum, s) => sum + s.current_balance, 0) || 0;
  }
};

// =====================================================
// TREASURY SERVICE
// =====================================================

export interface TreasuryAccount {
  id: string;
  user_id: string;
  name: string;
  account_type: string;
  bank_name?: string;
  account_number?: string;
  cbu?: string;
  currency: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface TreasuryMovement {
  id: string;
  user_id: string;
  account_id: string;
  movement_type: string;
  amount: number;
  balance_after: number;
  movement_date: string;
  category?: string;
  subcategory?: string;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  payee?: string;
  created_at: string;
}

export const treasuryService = {
  async getAllAccounts(): Promise<TreasuryAccount[]> {
    const { data, error } = await supabase
      .from('treasury_accounts')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getAccountById(id: string): Promise<TreasuryAccount | null> {
    const { data, error } = await supabase
      .from('treasury_accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createAccount(account: Partial<TreasuryAccount>): Promise<TreasuryAccount> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('treasury_accounts')
      .insert({ ...account, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, account: Partial<TreasuryAccount>): Promise<TreasuryAccount> {
    const { data, error } = await supabase
      .from('treasury_accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('treasury_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getMovements(accountId: string): Promise<TreasuryMovement[]> {
    const { data, error } = await supabase
      .from('treasury_movements')
      .select('*')
      .eq('account_id', accountId)
      .order('movement_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addMovement(movement: Partial<TreasuryMovement> & { account_id: string }): Promise<TreasuryMovement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Get current account balance
    const account = await this.getAccountById(movement.account_id);
    if (!account) throw new Error('Account not found');

    const amount = movement.amount || 0;
    const movementType = movement.movement_type || 'income';

    let newBalance = account.current_balance;
    if (movementType === 'income' || movementType === 'transfer_in') {
      newBalance += amount;
    } else if (movementType === 'expense' || movementType === 'transfer_out') {
      newBalance -= amount;
    }

    // Insert movement
    const { data, error } = await supabase
      .from('treasury_movements')
      .insert({
        ...movement,
        user_id: user.id,
        balance_after: newBalance
      })
      .select()
      .single();

    if (error) throw error;

    // Update account balance
    await this.updateAccount(movement.account_id, { current_balance: newBalance });

    return data;
  },

  async getTotalBalance(): Promise<number> {
    const { data, error } = await supabase
      .from('treasury_accounts')
      .select('current_balance')
      .eq('is_active', true);

    if (error) throw error;
    return data?.reduce((sum, a) => sum + a.current_balance, 0) || 0;
  },

  async getBalanceByType(accountType: string): Promise<number> {
    const { data, error } = await supabase
      .from('treasury_accounts')
      .select('current_balance')
      .eq('account_type', accountType)
      .eq('is_active', true);

    if (error) throw error;
    return data?.reduce((sum, a) => sum + a.current_balance, 0) || 0;
  }
};

// =====================================================
// DASHBOARD STATS
// =====================================================

export const erpStatsService = {
  async getOverview() {
    const [totalReceivables, totalPayables, stockValue, lowStockCount] = await Promise.all([
      clientsService.getTotalReceivables(),
      suppliersService.getTotalPayables(),
      productsService.getTotalStockValue(),
      productsService.getLowStock().then(p => p.length)
    ]);

    return {
      totalReceivables,
      totalPayables,
      netPosition: totalReceivables - totalPayables,
      stockValue,
      lowStockCount
    };
  }
};
