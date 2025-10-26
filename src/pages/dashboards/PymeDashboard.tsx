import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, Target, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/layout/Navbar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { quarter: "Q1", revenue: 450000 },
  { quarter: "Q2", revenue: 520000 },
  { quarter: "Q3", revenue: 580000 },
  { quarter: "Q4", revenue: 650000 },
];

const growthData = [
  { month: "Jul", growth: 8 },
  { month: "Ago", growth: 12 },
  { month: "Sep", growth: 15 },
  { month: "Oct", growth: 18 },
];

const teamMembers = [
  { name: "María González", role: "Gerente General", status: "Activo", performance: 95 },
  { name: "Carlos Rodríguez", role: "Jefe de Ventas", status: "Activo", performance: 88 },
  { name: "Ana Martínez", role: "Marketing", status: "Activo", performance: 92 },
  { name: "Juan Pérez", role: "Operaciones", status: "Activo", performance: 85 },
];

const okrs = [
  { title: "Aumentar facturación 30%", progress: 65 },
  { title: "Reducir costos operativos 15%", progress: 40 },
  { title: "Mejorar satisfacción cliente a 90%", progress: 75 },
];

export default function PymeDashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const metrics = [
    {
      title: "Facturación Mensual",
      value: "$650,000",
      change: "+12%",
      icon: DollarSign,
    },
    {
      title: "Empleados",
      value: "24",
      change: "+2 este mes",
      icon: Users,
    },
    {
      title: "OKRs Cumplidos",
      value: "60%",
      change: "3 de 5",
      icon: Target,
    },
    {
      title: "Crecimiento Anual",
      value: "18%",
      change: "+3% vs anterior",
      icon: TrendingUp,
    },
  ];

  const tools = [
    {
      title: "Dashboard en Tiempo Real",
      description: "Métricas actualizadas al instante",
      route: "/tools/realtime-dashboard",
    },
    {
      title: "Estructurador de Equipos",
      description: "Organiza roles y responsabilidades",
      route: "/tools/team-structurer",
    },
    {
      title: "Sistema de KPIs",
      description: "Define y trackea tus objetivos",
      route: "/tools/kpi-system",
    },
    {
      title: "Planificador Estratégico",
      description: "Plan a 1, 3 y 5 años",
      route: "/tools/strategic-planner",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-pyme/5 py-12">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Dashboard Ejecutivo{profile?.full_name ? ` - ${profile.full_name}` : ""}
              </h1>
              <p className="text-lg text-muted-foreground">
                Visión estratégica de tu empresa
              </p>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-[hsl(var(--success))] mt-1">
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="kpis">KPIs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Facturación por Trimestre</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="hsl(var(--pyme))" 
                              fill="hsl(var(--pyme))"
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Crecimiento Mensual (%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="growth" fill="hsl(var(--business))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Equipo</CardTitle>
                      <CardDescription>Miembros clave de la organización</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">Performance</p>
                                <Progress value={member.performance} className="w-24 h-2" />
                              </div>
                              <span className="text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] px-3 py-1 rounded-full">
                                {member.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kpis" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Objetivos y Resultados Clave (OKRs)</CardTitle>
                      <CardDescription>Progreso de tus objetivos estratégicos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {okrs.map((okr, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{okr.title}</p>
                              <span className="text-sm text-muted-foreground">{okr.progress}%</span>
                            </div>
                            <Progress value={okr.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Herramientas Enterprise</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate(tool.route)}
                      >
                        Abrir
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
