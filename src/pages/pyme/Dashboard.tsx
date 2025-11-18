import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Package,
  Building2,
  Target,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';

export default function PymeDashboard() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      const businessId = businesses.id;

      const [salesData, customersData, productsData] = await Promise.all([
        supabase.from('sales').select('total_amount').eq('business_id', businessId),
        supabase.from('customers').select('id', { count: 'exact' }).eq('business_id', businessId),
        supabase.from('products').select('id', { count: 'exact' }).eq('business_id', businessId)
      ]);

      const totalRevenue = salesData.data?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

      setStats({
        totalRevenue,
        totalCustomers: customersData.count || 0,
        totalProducts: productsData.count || 0,
        monthlyGrowth: 12.5 // Placeholder
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Error al cargar datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      title: 'Análisis Financiero',
      icon: BarChart3,
      color: 'from-enterprise-500 to-enterprise-600',
      path: '/analytics',
      description: 'Reportes y métricas avanzadas'
    },
    {
      title: 'Gestión de Equipo',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/pyme/team-management',
      description: 'RRHH y gestión de personal'
    },
    {
      title: 'Planificación Estratégica',
      icon: Target,
      color: 'from-green-500 to-green-600',
      path: '/pyme/strategic-planning',
      description: 'Objetivos y OKRs'
    },
    {
      title: 'Análisis de Mercado IA',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      path: '/pyme/market-analysis',
      description: 'Insights de competencia'
    },
    {
      title: 'Marketplace B2B',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      path: '/marketplace',
      description: 'Conectar con proveedores'
    },
    {
      title: 'CRM Avanzado',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      path: '/business/crm',
      description: 'Gestión de clientes'
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Dashboard Ejecutivo
            </h1>
            <p className="text-text-secondary">
              Panel de control para tu PYME
            </p>
          </div>
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
          >
            Configuración
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-enterprise-500 to-enterprise-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              ${stats.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary">Ingresos Totales</p>
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
            <p className="text-sm text-text-secondary">Clientes Activos</p>
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
            <p className="text-sm text-text-secondary">Productos/Servicios</p>
          </Card>

          <Card className="p-6 hover:shadow-hard transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              +{stats.monthlyGrowth}%
            </h3>
            <p className="text-sm text-text-secondary">Crecimiento Mensual</p>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Módulos Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-hard transition-all cursor-pointer group"
                  onClick={() => navigate(module.path)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {module.description}
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
