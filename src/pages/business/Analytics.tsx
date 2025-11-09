import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SalesData {
  date: string;
  total: number;
  quantity: number;
}

export default function Analytics() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topProduct: '',
    revenueGrowth: 0,
    ordersGrowth: 0
  });

  const [salesByDay, setSalesByDay] = useState<SalesData[]>([]);
  const [salesByProduct, setSalesByProduct] = useState<any[]>([]);
  const [salesByPaymentMethod, setSalesByPaymentMethod] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
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

      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Obtener ventas del período
      const { data: sales, error } = await supabase
        .from('sales')
        .select('*')
        .eq('business_id', businesses.id)
        .gte('sale_date', startDate.toISOString())
        .order('sale_date', { ascending: true });

      if (error) throw error;

      // Calcular estadísticas
      const totalRevenue = sales?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;
      const totalOrders = sales?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Ventas por día
      const salesByDayMap = new Map<string, { total: number; quantity: number }>();
      sales?.forEach(sale => {
        const date = new Date(sale.sale_date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
        const current = salesByDayMap.get(date) || { total: 0, quantity: 0 };
        salesByDayMap.set(date, {
          total: current.total + Number(sale.total_amount),
          quantity: current.quantity + 1
        });
      });

      const salesByDayArray = Array.from(salesByDayMap.entries()).map(([date, data]) => ({
        date,
        total: data.total,
        quantity: data.quantity
      }));

      // Ventas por producto
      const productSales = new Map<string, number>();
      sales?.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item: any) => {
            const current = productSales.get(item.product_name) || 0;
            productSales.set(item.product_name, current + (item.quantity * item.price));
          });
        }
      });

      const salesByProductArray = Array.from(productSales.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Ventas por método de pago
      const paymentMethodSales = new Map<string, number>();
      sales?.forEach(sale => {
        const current = paymentMethodSales.get(sale.payment_method) || 0;
        paymentMethodSales.set(sale.payment_method, current + Number(sale.total_amount));
      });

      const salesByPaymentMethodArray = Array.from(paymentMethodSales.entries())
        .map(([name, value]) => ({ name, value }));

      setStats({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        topProduct: salesByProductArray[0]?.name || 'N/A',
        revenueGrowth: 12.5, // Placeholder
        ordersGrowth: 8.3 // Placeholder
      });

      setSalesByDay(salesByDayArray);
      setSalesByProduct(salesByProductArray);
      setSalesByPaymentMethod(salesByPaymentMethodArray);
    } catch (error) {
      console.error('Error loading analytics:', error);
      showToast('Error al cargar analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

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
              Analytics de Ventas
            </h1>
            <p className="text-text-secondary">
              Análisis detallado de tu rendimiento comercial
            </p>
          </div>
          <div className="flex gap-3">
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <TabsList>
                <TabsTrigger value="7days">7 días</TabsTrigger>
                <TabsTrigger value="30days">30 días</TabsTrigger>
                <TabsTrigger value="90days">90 días</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => navigate('/business/dashboard')}>
              Volver
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-business-500" />
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{stats.revenueGrowth}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-text-secondary">Ingresos Totales</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-8 h-8 text-blue-500" />
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{stats.ordersGrowth}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                {stats.totalOrders}
              </h3>
              <p className="text-sm text-text-secondary">Órdenes Totales</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                ${stats.avgOrderValue.toFixed(0)}
              </h3>
              <p className="text-sm text-text-secondary">Ticket Promedio</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-text-primary truncate">
                {stats.topProduct}
              </h3>
              <p className="text-sm text-text-secondary">Producto Top</p>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas por Día */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Evolución de Ventas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--business))" 
                  strokeWidth={2}
                  name="Ventas ($)"
                  dot={{ fill: 'hsl(var(--business))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Órdenes por Día */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Cantidad de Órdenes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--text-secondary))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="quantity" 
                  fill="hsl(var(--business))" 
                  name="Órdenes"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Productos */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Top 5 Productos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByProduct} layout="vertical">
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
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--business))"
                  name="Ventas ($)"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Métodos de Pago */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Ventas por Método de Pago
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
