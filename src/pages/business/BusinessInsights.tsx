import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  clientsService,
  productsService,
  treasuryService,
  erpStatsService
} from '@/services/erpService';
import { bcraService } from '@/services/apiIntegrations';

interface BusinessMetrics {
  totalReceivables: number;
  totalPayables: number;
  netPosition: number;
  stockValue: number;
  lowStockCount: number;
  cashBalance: number;
  bankBalance: number;
  totalBalance: number;
  clientsCount: number;
  productsCount: number;
  usdRate: number;
}

interface AIInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function BusinessInsights() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalReceivables: 0,
    totalPayables: 0,
    netPosition: 0,
    stockValue: 0,
    lowStockCount: 0,
    cashBalance: 0,
    bankBalance: 0,
    totalBalance: 0,
    clientsCount: 0,
    productsCount: 0,
    usdRate: 0
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    loadBusinessMetrics();
  }, []);

  const loadBusinessMetrics = async () => {
    try {
      setLoading(true);

      // Load all ERP data in parallel
      const [
        erpStats,
        clients,
        products,
        accounts,
        usdRateData
      ] = await Promise.all([
        erpStatsService.getOverview(),
        clientsService.getAll(),
        productsService.getAll(),
        treasuryService.getAllAccounts(),
        bcraService.getUSDRate()
      ]);

      const cashBalance = accounts
        .filter(a => a.account_type === 'cash' && a.is_active)
        .reduce((sum, a) => sum + a.current_balance, 0);

      const bankBalance = accounts
        .filter(a => a.account_type === 'bank' && a.is_active)
        .reduce((sum, a) => sum + a.current_balance, 0);

      const totalBalance = accounts
        .filter(a => a.is_active)
        .reduce((sum, a) => sum + a.current_balance, 0);

      setMetrics({
        totalReceivables: erpStats.totalReceivables,
        totalPayables: erpStats.totalPayables,
        netPosition: erpStats.netPosition,
        stockValue: erpStats.stockValue,
        lowStockCount: erpStats.lowStockCount,
        cashBalance,
        bankBalance,
        totalBalance,
        clientsCount: clients.length,
        productsCount: products.length,
        usdRate: usdRateData.venta
      });

      // Auto-generate insights after loading data
      generateAIInsights({
        ...erpStats,
        cashBalance,
        bankBalance,
        totalBalance,
        clientsCount: clients.length,
        productsCount: products.length
      });
    } catch (error) {
      console.error('Error loading business metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async (data: any) => {
    setGeneratingInsights(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInsights: AIInsight[] = [];

    // Cash flow analysis
    if (data.cashBalance < data.totalReceivables * 0.1) {
      newInsights.push({
        type: 'warning',
        title: 'Liquidez Baja',
        description: `Tu efectivo en caja ($${data.cashBalance.toLocaleString()}) es menor al 10% de tus cuentas por cobrar. Considera acelerar la cobranza.`,
        action: 'Ver Cuentas Corrientes',
        priority: 'high'
      });
    }

    // Stock alerts
    if (data.lowStockCount > 0) {
      newInsights.push({
        type: 'danger',
        title: 'Stock Crítico',
        description: `Tienes ${data.lowStockCount} producto${data.lowStockCount > 1 ? 's' : ''} con stock bajo el mínimo. Planifica tu reabastecimiento.`,
        action: 'Ver Inventario',
        priority: 'high'
      });
    }

    // Working capital
    const workingCapital = data.totalBalance + data.totalReceivables - data.totalPayables;
    if (workingCapital > 0) {
      newInsights.push({
        type: 'success',
        title: 'Capital de Trabajo Positivo',
        description: `Tu capital de trabajo es de $${workingCapital.toLocaleString()}. Tienes una buena posición financiera a corto plazo.`,
        priority: 'low'
      });
    } else {
      newInsights.push({
        type: 'danger',
        title: 'Capital de Trabajo Negativo',
        description: `Tu capital de trabajo es negativo ($${Math.abs(workingCapital).toLocaleString()}). Considera reducir gastos o aumentar ingresos.`,
        action: 'Ver Tesorería',
        priority: 'high'
      });
    }

    // Inventory turnover
    const inventoryTurnoverMonths = data.stockValue / (data.totalReceivables || 1);
    if (inventoryTurnoverMonths > 3) {
      newInsights.push({
        type: 'warning',
        title: 'Rotación de Inventario Lenta',
        description: `Tu inventario representa ${inventoryTurnoverMonths.toFixed(1)} meses de ventas. Considera optimizar tu mix de productos.`,
        action: 'Analizar Productos',
        priority: 'medium'
      });
    }

    // Receivables vs Payables
    if (data.totalReceivables > data.totalPayables * 1.5) {
      newInsights.push({
        type: 'info',
        title: 'Oportunidad de Negociación',
        description: `Cobras $${data.totalReceivables.toLocaleString()} pero debes $${data.totalPayables.toLocaleString()}. Negocia mejores plazos con proveedores.`,
        priority: 'medium'
      });
    }

    // Growth opportunity
    if (data.clientsCount < 10) {
      newInsights.push({
        type: 'info',
        title: 'Oportunidad de Crecimiento',
        description: `Solo tienes ${data.clientsCount} clientes registrados. Enfócate en adquirir nuevos clientes para escalar tu negocio.`,
        action: 'Estrategia de Marketing',
        priority: 'medium'
      });
    }

    setInsights(newInsights);
    setGeneratingInsights(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Insights de Negocio
          </h1>
          <p className="text-text-secondary">
            Panel integral con análisis inteligente de tu negocio
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Analizando datos del negocio...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Balance */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Efectivo Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${metrics.totalBalance.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        ≈ USD ${(metrics.totalBalance / metrics.usdRate).toFixed(0)}
                      </p>
                    </div>
                    <Wallet className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Receivables */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">A Cobrar</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${metrics.totalReceivables.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {metrics.clientsCount} clientes
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Stock Value */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Valor Stock</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${metrics.stockValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {metrics.productsCount} productos
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Net Position */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Posición Neta</p>
                      <p className={`text-2xl font-bold ${
                        metrics.netPosition >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(metrics.netPosition).toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {metrics.netPosition >= 0 ? 'Positiva' : 'Negativa'}
                      </p>
                    </div>
                    {metrics.netPosition >= 0 ? (
                      <ArrowUpRight className="w-8 h-8 text-green-500 opacity-50" />
                    ) : (
                      <ArrowDownRight className="w-8 h-8 text-red-500 opacity-50" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Liquidity Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Liquidez</CardTitle>
                  <CardDescription>Composición de tu efectivo disponible</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">En Bancos</span>
                        <span className="font-semibold">${metrics.bankBalance.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(metrics.bankBalance / metrics.totalBalance) * 100}
                        className="h-2 bg-blue-100"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">En Efectivo</span>
                        <span className="font-semibold">${metrics.cashBalance.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(metrics.cashBalance / metrics.totalBalance) * 100}
                        className="h-2 bg-green-100"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Recomendación de Liquidez
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Mantén al menos 20% de tu efectivo en caja para operaciones diarias
                          y el resto en cuenta bancaria para generar intereses.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Working Capital */}
              <Card>
                <CardHeader>
                  <CardTitle>Capital de Trabajo</CardTitle>
                  <CardDescription>Recursos disponibles para operaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-700">Activos Corrientes</p>
                        <p className="text-xl font-bold text-green-900">
                          ${(metrics.totalBalance + metrics.totalReceivables).toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm text-red-700">Pasivos Corrientes</p>
                        <p className="text-xl font-bold text-red-900">
                          ${metrics.totalPayables.toLocaleString()}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div>
                        <p className="text-sm text-blue-700">Capital de Trabajo Neto</p>
                        <p className="text-2xl font-bold text-blue-900">
                          ${(metrics.totalBalance + metrics.totalReceivables - metrics.totalPayables).toLocaleString()}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Sparkles className="w-5 h-5" />
                      Insights Inteligentes
                    </CardTitle>
                    <CardDescription>
                      Análisis automático y recomendaciones para mejorar tu negocio
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => loadBusinessMetrics()}
                    disabled={generatingInsights}
                    variant="outline"
                    size="sm"
                  >
                    {generatingInsights ? 'Analizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {generatingInsights ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Generando insights...</p>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                    <p className="text-text-secondary">No hay insights disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              <Badge variant={insight.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                                {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-secondary mb-2">
                              {insight.description}
                            </p>
                            {insight.action && (
                              <Button size="sm" variant="link" className="h-auto p-0 text-xs">
                                {insight.action} →
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
