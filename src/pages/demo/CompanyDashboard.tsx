import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, DollarSign, Users, MapPin, TrendingUp, Briefcase, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState("todas");

  const branches = [
    { id: "todas", name: "Todas las Sucursales" },
    { id: "caba", name: "CABA - Centro" },
    { id: "norte", name: "Zona Norte" },
    { id: "sur", name: "Zona Sur" },
  ];

  const stats = [
    {
      title: "Ventas Totales",
      value: "$2.5M",
      change: "+12%",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Empleados",
      value: "45",
      change: "+3",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Sucursales",
      value: "3",
      change: "Activas",
      icon: MapPin,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Margen Neto",
      value: "28%",
      change: "+5%",
      icon: TrendingUp,
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  const teamMembers = [
    { name: "María González", role: "Gerente General", branch: "CABA" },
    { name: "Juan Pérez", role: "Jefe de Ventas", branch: "Zona Norte" },
    { name: "Ana Martínez", role: "Contadora", branch: "CABA" },
    { name: "Carlos López", role: "Supervisor", branch: "Zona Sur" },
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
              <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Empresarial</h1>
              <p className="text-white/60">Gestión integral para PyMEs (3+ años)</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold">
            Modo Demo
          </div>
        </motion.div>

        {/* Branch Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-white/10">
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-green-400" />
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-64 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">{stat.change}</span>
                </div>
                <p className="text-white/60 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Gestión de Equipo
              </h2>
              <div className="space-y-3">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{member.name}</p>
                        <p className="text-white/60 text-sm">{member.role}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        {member.branch}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Automation & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Automatización con IA
              </h2>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generar Reporte de Ventas
                </Button>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Análisis de Rentabilidad
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Optimizar Recursos Humanos
                </Button>
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white justify-start">
                  <Building2 className="w-4 h-4 mr-2" />
                  Plan de Expansión
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
