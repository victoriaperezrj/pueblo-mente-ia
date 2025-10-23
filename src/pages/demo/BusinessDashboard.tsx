import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, DollarSign, Users, Package, BarChart3, PieChart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState({
    monthlyRevenue: "",
    monthlyExpenses: "",
    customerCount: "",
    teamSize: "",
  });

  const stats = [
    {
      title: "Facturación Mensual",
      value: businessData.monthlyRevenue || "$0",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      glow: "emerald",
    },
    {
      title: "Gastos Mensuales",
      value: businessData.monthlyExpenses || "$0",
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
      glow: "red",
    },
    {
      title: "Clientes Activos",
      value: businessData.customerCount || "0",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      glow: "blue",
    },
    {
      title: "Tamaño del Equipo",
      value: businessData.teamSize || "0",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      glow: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/business-ai-bot")}
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Negocio</h1>
              <p className="text-white/60">Gestión de negocio validado (1-3 años)</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold">
            Modo Demo
          </div>
        </motion.div>

        {/* Data Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-white/10 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Cargá los Datos de tu Negocio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Facturación Mensual</Label>
                <Input
                  type="text"
                  placeholder="Ej: $500,000"
                  value={businessData.monthlyRevenue}
                  onChange={(e) => setBusinessData({ ...businessData, monthlyRevenue: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <Label className="text-white/80">Gastos Mensuales</Label>
                <Input
                  type="text"
                  placeholder="Ej: $350,000"
                  value={businessData.monthlyExpenses}
                  onChange={(e) => setBusinessData({ ...businessData, monthlyExpenses: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <Label className="text-white/80">Clientes Activos</Label>
                <Input
                  type="number"
                  placeholder="Ej: 150"
                  value={businessData.customerCount}
                  onChange={(e) => setBusinessData({ ...businessData, customerCount: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <Label className="text-white/80">Tamaño del Equipo</Label>
                <Input
                  type="number"
                  placeholder="Ej: 5"
                  value={businessData.teamSize}
                  onChange={(e) => setBusinessData({ ...businessData, teamSize: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-cyan-500"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className={`p-6 bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-${stat.glow}-500/20`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reportes
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white justify-start">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Equipo
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
