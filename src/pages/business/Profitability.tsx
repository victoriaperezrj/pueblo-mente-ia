import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Package,
  AlertCircle,
  Award,
  Target,
  Percent
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProductProfitability {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  units_sold: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export default function Profitability() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductProfitability[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgMargin: 0,
    bestProduct: '',
    worstProduct: ''
  });

  useEffect(() => {
    loadProfitabilityData();
  }, []);

  const loadProfitabilityData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!businesses) {
        setLoading(false);
        return;
      }

      setBusinessId(businesses.id);

      // Obtener productos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businesses.id)
        .eq('active', true);

      if (productsError) throw productsError;

      // Obtener ventas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('items')
        .eq('business_id', businesses.id);

      if (salesError) throw salesError;

      // Calcular rentabilidad por producto
      const productSales = new Map<string, { quantity: number; revenue: number }>();

      salesData?.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item: any) => {
            const current = productSales.get(item.product_name) || { quantity: 0, revenue: 0 };
            productSales.set(item.product_name, {
              quantity: current.quantity + item.quantity,
              revenue: current.revenue + (item.quantity * item.price)
            });
          });
        }
      });

      const profitabilityData: ProductProfitability[] = productsData?.map(product => {
        const sales = productSales.get(product.name) || { quantity: 0, revenue: 0 };
        const cost = sales.quantity * Number(product.cost_price);
        const profit = sales.revenue - cost;
        const margin = sales.revenue > 0 ? (profit / sales.revenue) * 100 : 0;

        return {
          id: product.id,
          name: product.name,
          category: product.category || 'Sin categoría',
          cost_price: Number(product.cost_price),
          selling_price: Number(product.selling_price),
          units_sold: sales.quantity,
          revenue: sales.revenue,
          cost,
          profit,
          margin
        };
      }).sort((a, b) => b.profit - a.profit) || [];

      // Calcular totales
      const totalRevenue = profitabilityData.reduce((acc, p) => acc + p.revenue, 0);
      const totalCost = profitabilityData.reduce((acc, p) => acc + p.cost, 0);
      const totalProfit = totalRevenue - totalCost;
      const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      
      const best = profitabilityData[0];
      const worst = profitabilityData[profitabilityData.length - 1];

      setProducts(profitabilityData);
      setTotalStats({
        totalRevenue,
        totalCost,
        totalProfit,
        avgMargin,
        bestProduct: best?.name || 'N/A',
        worstProduct: worst?.name || 'N/A'
      });
    } catch (error) {
      console.error('Error loading profitability:', error);
      showToast('Error al cargar datos de rentabilidad', 'error');
    } finally {
      setLoading(false);
    }
  };

  const topProducts = products.slice(0, 5);
  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += p.profit;
    } else {
      acc.push({ name: p.category, value: p.profit });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {ToastComponent}
      
      <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Análisis de Rentabilidad
            </h1>
            <p className="text-text-secondary">
              Identifica qué productos generan más ganancias
            </p>
          </div>
          <Button onClick={() => navigate('/business/dashboard')}>
            Volver
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-business-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                ${totalStats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-text-secondary">Ingresos Totales</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">
                ${totalStats.totalProfit.toLocaleString()}
              </h3>
              <p className="text-sm text-text-secondary">Ganancia Total</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Percent className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                {totalStats.avgMargin.toFixed(1)}%
              </h3>
              <p className="text-sm text-text-secondary">Margen Promedio</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-text-primary truncate">
                {totalStats.bestProduct}
              </h3>
              <p className="text-sm text-text-secondary">Producto Estrella</p>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Products */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Top 5 Productos por Ganancia
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                />
                <Bar 
                  dataKey="profit" 
                  fill="hsl(var(--business))"
                  name="Ganancia"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Categories */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Ganancia por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Detalle por Producto
          </h3>
          
          <div className="space-y-3">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary">{product.name}</h4>
                    <p className="text-sm text-text-secondary">{product.category}</p>
                  </div>
                  <Badge 
                    variant={product.margin > 30 ? 'default' : product.margin > 15 ? 'secondary' : 'destructive'}
                  >
                    {product.margin.toFixed(1)}% margen
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-text-tertiary">Unidades</p>
                    <p className="font-semibold">{product.units_sold}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Ingresos</p>
                    <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Costo</p>
                    <p className="font-semibold">${product.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Ganancia</p>
                    <p className={`font-semibold ${product.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${product.profit.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-tertiary">
                    <span>Contribución a ganancia total</span>
                    <span>
                      {((product.profit / totalStats.totalProfit) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(product.profit / totalStats.totalProfit) * 100} 
                    className="h-2"
                  />
                </div>

                {product.margin < 15 && (
                  <div className="mt-3 flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Margen bajo. Considera aumentar el precio o reducir costos.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                No hay datos suficientes
              </h3>
              <p className="text-text-secondary">
                Necesitas tener productos y ventas registradas para ver el análisis
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
