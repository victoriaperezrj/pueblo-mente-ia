import { useState } from "react";
import { Building2, TrendingUp, DollarSign, Users, AlertCircle, ArrowUpRight } from "lucide-react";
import { KPICard } from "@/components/empresa/KPICard";
import { VentasChart } from "@/components/empresa/VentasChart";
import { MultiSucursalGrid } from "@/components/empresa/MultiSucursalGrid";
import { AlertasPanel } from "@/components/empresa/AlertasPanel";
import { Button } from "@/components/ui/button";

export default function EmpresaDashboard() {
  // Mock data - conectar con Supabase después
  const kpis = [
    { label: "Ventas Totales", value: "$456,209", delta: "+12.4%", trend: "up" as const },
    { label: "Costos Operativos", value: "$124,401", delta: "-3.2%", trend: "down" as const },
    { label: "Margen Neto", value: "28.5%", delta: "+1.8%", trend: "up" as const },
    { label: "Empleados Activos", value: "142", delta: "+8", trend: "up" as const },
  ];

  const sucursales = [
    { id: "1", nombre: "Sucursal Centro", ventas: 156000, margen: 32, empleados: 45, lat: -34.603722, lng: -58.381592 },
    { id: "2", nombre: "Sucursal Norte", ventas: 132000, margen: 28, empleados: 38, lat: -34.563722, lng: -58.421592 },
    { id: "3", nombre: "Sucursal Sur", ventas: 98000, margen: 25, empleados: 32, lat: -34.643722, lng: -58.401592 },
    { id: "4", nombre: "Sucursal Oeste", ventas: 70209, margen: 22, empleados: 27, lat: -34.613722, lng: -58.461592 },
  ];

  const alertas = [
    { tipo: "warning" as const, mensaje: "Sucursal Sur: margen por debajo del objetivo (25% vs 28% target)", timestamp: "Hace 2 horas" },
    { tipo: "success" as const, mensaje: "Sucursal Centro superó meta mensual con 4 días de anticipación", timestamp: "Hace 5 horas" },
    { tipo: "info" as const, mensaje: "Nuevo reporte de ventas disponible para descargar", timestamp: "Hace 1 día" },
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-apple-gray-900">Dashboard Empresa</h1>
                <p className="text-sm text-apple-gray-600">Vista consolidada multi-sucursal</p>
              </div>
            </div>
            <Button variant="default" className="hover-lift">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Reporte
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

            {/* Ventas Chart */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll hover-card-subtle">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-apple-gray-900">Ventas por Sucursal</h3>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Últimos 30 días</option>
                  <option>Últimos 90 días</option>
                  <option>Este año</option>
                </select>
              </div>
              <VentasChart sucursales={sucursales} />
            </div>

            {/* Multi-Sucursal Grid */}
            <div className="bg-white rounded-xl shadow-apple p-6 fade-in-scroll hover-card-subtle">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-apple-gray-900">
                  Vista por Sucursal
                </h3>
                <Button variant="outline" size="sm">
                  Ver todas
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <MultiSucursalGrid sucursales={sucursales} />
            </div>

            {/* Proyecciones IA */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10 fade-in-scroll">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-apple-gray-900 mb-2">
                    Proyecciones Inteligentes
                  </h4>
                  <p className="text-sm text-apple-gray-600 mb-4">
                    Basado en el rendimiento actual, se proyecta un crecimiento del <strong>15.3%</strong> para el próximo trimestre.
                    Sucursal Centro muestra potencial de expansión.
                  </p>
                  <Button variant="default" size="sm">
                    Ver análisis completo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Alertas */}
            <div className="fade-in-scroll">
              <AlertasPanel alertas={alertas} />
            </div>

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
                      Registrar transacción
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">
                      Gestionar equipo
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange/10 rounded-lg">
                      <Building2 className="w-4 h-4 text-orange" />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">
                      Nueva sucursal
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 fade-in-scroll">
              <h4 className="font-semibold text-apple-gray-900 mb-4">Resumen Mensual</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Transacciones</span>
                  <span className="font-semibold text-apple-gray-900">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Ticket promedio</span>
                  <span className="font-semibold text-apple-gray-900">$160</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-apple-gray-600">Días activos</span>
                  <span className="font-semibold text-apple-gray-900">22/30</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
