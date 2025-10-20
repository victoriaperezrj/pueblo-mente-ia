import { TrendingUp, DollarSign, Users, Target, ArrowUpRight, BarChart3 } from "lucide-react";
import { KPICard } from "@/components/empresa/KPICard";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function NegocioDashboard() {
  // Mock data - versión simplificada
  const kpis = [
    { label: "MRR", value: "$8,450", delta: "+18.2%", trend: "up" as const },
    { label: "Clientes Activos", value: "43", delta: "+5", trend: "up" as const },
    { label: "Ticket Promedio", value: "$196", delta: "+8.5%", trend: "up" as const },
    { label: "Gastos Mensuales", value: "$3,200", delta: "-5.1%", trend: "down" as const },
  ];

  const ventasMensuales = [
    { mes: "Ene", ventas: 6200 },
    { mes: "Feb", ventas: 6800 },
    { mes: "Mar", ventas: 7200 },
    { mes: "Abr", ventas: 7600 },
    { mes: "May", ventas: 8100 },
    { mes: "Jun", ventas: 8450 },
  ];

  const canales = [
    { nombre: "Tienda Online", porcentaje: 45, monto: "$3,800" },
    { nombre: "Punto de Venta", porcentaje: 35, monto: "$2,960" },
    { nombre: "WhatsApp", porcentaje: 20, monto: "$1,690" },
  ];

  return (
    <div className="min-h-screen bg-apple-gray-50 relative overflow-hidden">
      {/* Animated background waves */}
      <div className="wave-bg opacity-[0.04]" />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-apple-gray-900">Dashboard Negocio</h1>
                <p className="text-sm text-apple-gray-600">Control simple y efectivo</p>
              </div>
            </div>
            <Button variant="default" className="hover-lift">
              <BarChart3 className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-in-scroll">
              {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>

            {/* Ventas Trend */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll hover-card-subtle">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-6">
                Evolución de Ventas
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 13 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 13 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    dot={{ fill: "#2563EB", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Canales de Venta */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll hover-card-subtle">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-6">
                Ventas por Canal
              </h3>
              <div className="space-y-4">
                {canales.map((canal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-apple-gray-700">
                        {canal.nombre}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-apple-gray-600">
                          {canal.porcentaje}%
                        </span>
                        <span className="text-sm font-semibold text-apple-gray-900">
                          {canal.monto}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${canal.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CRM Preview */}
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6 border border-secondary/10 fade-in-scroll">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-apple-gray-900 mb-2">
                    Pipeline de Ventas
                  </h4>
                  <p className="text-sm text-apple-gray-600 mb-4">
                    Tenés <strong>12 leads</strong> en proceso, con 5 oportunidades calientes valoradas en <strong>$4,200</strong>.
                  </p>
                  <Button variant="default" size="sm">
                    Ver CRM
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll">
              <h4 className="font-semibold text-apple-gray-900 mb-4">Acciones Rápidas</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">
                      Registrar venta
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">
                      Nuevo cliente
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange/10 rounded-lg">
                      <Target className="w-4 h-4 text-orange" />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">
                      Ver gastos
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll">
              <h4 className="font-semibold text-apple-gray-900 mb-4">Meta Mensual</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-apple-gray-600">Progreso</span>
                    <span className="text-sm font-semibold text-primary">84%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: "84%" }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-apple-gray-500">$8,450</span>
                    <span className="text-xs text-apple-gray-500">$10,000</span>
                  </div>
                </div>
                <p className="text-xs text-apple-gray-600">
                  Faltan <strong>$1,550</strong> para alcanzar tu meta. ¡Vas muy bien!
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 fade-in-scroll">
              <h4 className="font-semibold text-apple-gray-900 mb-4">Este Mes</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Ventas realizadas</span>
                  <span className="font-semibold text-apple-gray-900">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Nuevos clientes</span>
                  <span className="font-semibold text-apple-gray-900">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Tasa conversión</span>
                  <span className="font-semibold text-apple-gray-900">12.5%</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
