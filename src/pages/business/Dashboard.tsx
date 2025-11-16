import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingAppointments: 0,
    lowStockProducts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener el business del usuario
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

      const businessId = businesses.id;

      // Cargar estadísticas en paralelo
      const [salesData, customersData, productsData, appointmentsData] = await Promise.all([
        supabase.from('sales').select('total_amount', { count: 'exact' }).eq('business_id', businessId),
        supabase.from('customers').select('id', { count: 'exact' }).eq('business_id', businessId),
        supabase.from('products').select('id, current_stock, min_stock', { count: 'exact' }).eq('business_id', businessId),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('business_id', businessId).eq('status', 'pending')
      ]);

      const totalSales = salesData.data?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;
      const lowStock = productsData.data?.filter(p => Number(p.current_stock) <= Number(p.min_stock)).length || 0;

      setStats({
        totalSales,
        totalCustomers: customersData.count || 0,
        totalProducts: productsData.count || 0,
        pendingAppointments: appointmentsData.count || 0,
        lowStockProducts: lowStock
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Error al cargar datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'CRM Completo',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/business/crm',
      description: 'Gestión avanzada de clientes'
    },
    {
      title: 'Analytics de Ventas',
      icon: TrendingUp,
      color: 'from-business-500 to-business-600',
      path: '/business/analytics',
      description: 'Reportes detallados'
    },
    {
      title: 'Marketing Automation',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      path: '/business/marketing-automation',
      description: 'Campañas automatizadas'
    },
    {
      title: 'Inventario',
      icon: Package,
      color: 'from-teal-500 to-teal-600',
      path: '/business/inventory',
      description: 'Control de stock'
    },
    {
      title: 'Rentabilidad',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      path: '/business/profitability',
      description: 'Análisis de ganancias'
    },
    {
      title: 'Optimizador de Precios IA',
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      path: '/business/price-optimizer',
      description: 'Precios óptimos con IA'
    },
    {
      title: 'Nueva Venta',
      icon: ShoppingCart,
      color: 'from-pink-500 to-pink-600',
      path: '/sales',
      description: 'Registrar venta'
    }
  ];

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
              Dashboard de Negocio
            </h1>
            <p className="text-text-secondary">
              Gestiona tu negocio de forma eficiente
            </p>
          </div>
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
          >
            Configuración
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-business-500 to-business-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              ${stats.totalSales.toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary">Ventas Totales</p>
          </Card>

          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.totalCustomers}
            </h3>
            <p className="text-sm text-text-secondary">Clientes</p>
          </Card>

          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.totalProducts}
            </h3>
            <p className="text-sm text-text-secondary">Productos</p>
          </Card>

          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.pendingAppointments}
            </h3>
            <p className="text-sm text-text-secondary">Turnos Pendientes</p>
          </Card>
        </div>

        {/* Alerts */}
        {stats.lowStockProducts > 0 && (
          <Card className="p-4 bg-warning/10 border-warning">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div>
                <h4 className="font-semibold text-text-primary">
                  Stock Bajo
                </h4>
                <p className="text-sm text-text-secondary">
                  {stats.lowStockProducts} producto{stats.lowStockProducts !== 1 ? 's' : ''} con stock bajo
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => navigate('/inventory')}
              >
                Ver Inventario
              </Button>
            </div>
          </Card>
        )}

        {/* Ecosystem Tools */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Herramientas del Ecosistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-hard transition-all cursor-pointer group"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {action.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
