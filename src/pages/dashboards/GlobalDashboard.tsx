import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Users,
  Globe,
  TrendingUp,
  ArrowRight,
  Building2,
  BarChart3,
  MapPin,
  Sparkles,
  UserCircle,
  Brain,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/layout/Navbar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const globalRevenueData = [
  { quarter: "Q1", revenue: 4500000, profit: 1200000 },
  { quarter: "Q2", revenue: 5200000, profit: 1450000 },
  { quarter: "Q3", revenue: 5800000, profit: 1680000 },
  { quarter: "Q4", revenue: 6500000, profit: 1950000 },
];

const regionData = [
  { name: "Norteamérica", value: 45, color: "#8b5cf6" },
  { name: "Europa", value: 25, color: "#3b82f6" },
  { name: "Latinoamérica", value: 20, color: "#10b981" },
  { name: "Asia-Pacífico", value: 10, color: "#f59e0b" },
];

const subsidiaries = [
  { name: "USA Operations", region: "Norteamérica", revenue: "$2.9M", growth: "+15%", employees: 120 },
  { name: "EU Hub", region: "Europa", revenue: "$1.6M", growth: "+12%", employees: 85 },
  { name: "LATAM Division", region: "Latinoamérica", revenue: "$1.3M", growth: "+22%", employees: 65 },
  { name: "APAC Center", region: "Asia-Pacífico", revenue: "$650K", growth: "+28%", employees: 40 },
];

const strategicInitiatives = [
  { title: "Expansión Mercado Asiático", progress: 45, budget: "$2M", status: "En progreso" },
  { title: "Transformación Digital 2.0", progress: 72, budget: "$3.5M", status: "En progreso" },
  { title: "Adquisición TechStart", progress: 30, budget: "$8M", status: "Evaluación" },
  { title: "Sostenibilidad ESG 2030", progress: 55, budget: "$1.2M", status: "En progreso" },
];

export default function GlobalDashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const metrics = [
    {
      title: "Facturación Global",
      value: "$6.5M",
      change: "+18% YoY",
      icon: DollarSign,
    },
    {
      title: "Empleados Totales",
      value: "310",
      change: "4 países",
      icon: Users,
    },
    {
      title: "Subsidiarias",
      value: "4",
      change: "3 continentes",
      icon: Building2,
    },
    {
      title: "Market Share",
      value: "12.5%",
      change: "+2.3% vs anterior",
      icon: Globe,
    },
  ];

  const tools = [
    {
      title: "Market Test Express",
      description: "Análisis de viabilidad con GPT-4",
      route: "/validation/market-test",
      icon: Sparkles,
      badge: "🔥 AI",
      color: "from-blue-600 to-purple-600",
    },
    {
      title: "Benchmark Automático",
      description: "Inteligencia competitiva con IA",
      route: "/validation/benchmark",
      icon: TrendingUp,
      badge: "AI",
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Generador de Público",
      description: "Personas con avatares DALL-E 3",
      route: "/validation/target-audience",
      icon: UserCircle,
      badge: "AI",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Inteligencia Financiera",
      description: "Consolidación y forecasting avanzado",
      route: "/global/financial-intelligence",
      icon: BarChart3,
      color: "from-yellow-600 to-orange-600",
    },
    {
      title: "CRM 360°",
      description: "Gestión global de clientes",
      route: "/global/crm-360",
      icon: Users,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Smart Pricing Global",
      description: "Optimización de precios multi-región",
      route: "/global/smart-pricing",
      icon: Zap,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "AI Strategy Advisor",
      description: "Recomendaciones estratégicas con IA",
      route: "/global/ai-advisor",
      icon: Brain,
      badge: "Premium",
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "Global Analytics",
      description: "Métricas consolidadas en tiempo real",
      route: "/global/analytics",
      icon: Globe,
      color: "from-indigo-600 to-blue-600",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-500/5 py-12">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-violet-500" />
                <h1 className="text-4xl font-bold">
                  Global Command Center{profile?.full_name ? ` - ${profile.full_name}` : ""}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Control total de tu empresa multinacional
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
                  <Card className="bg-gradient-to-br from-card to-violet-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-violet-500 mt-1">
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content with Tabs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Análisis Global</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="regions">Regiones</TabsTrigger>
                  <TabsTrigger value="subsidiaries">Subsidiarias</TabsTrigger>
                  <TabsTrigger value="initiatives">Iniciativas</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Facturación vs Profit por Trimestre</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={globalRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                              name="Facturación"
                            />
                            <Area
                              type="monotone"
                              dataKey="profit"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.3}
                              name="Profit"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Distribución por Región</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={regionData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {regionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="regions" className="mt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {regionData.map((region, index) => (
                      <motion.div
                        key={region.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" style={{ color: region.color }} />
                              <CardTitle className="text-sm">{region.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold" style={{ color: region.color }}>
                              {region.value}%
                            </div>
                            <Progress value={region.value} className="h-2 mt-2" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="subsidiaries" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Subsidiarias Globales</CardTitle>
                      <CardDescription>Performance por unidad de negocio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subsidiaries.map((sub, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-semibold">{sub.name}</p>
                              <p className="text-sm text-muted-foreground">{sub.region}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="font-semibold">{sub.revenue}</p>
                                <p className="text-xs text-muted-foreground">Facturación</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-500">{sub.growth}</p>
                                <p className="text-xs text-muted-foreground">Crecimiento</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{sub.employees}</p>
                                <p className="text-xs text-muted-foreground">Empleados</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="initiatives" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Iniciativas Estratégicas</CardTitle>
                      <CardDescription>Proyectos clave para el crecimiento global</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {strategicInitiatives.map((initiative, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{initiative.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Presupuesto: {initiative.budget}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  initiative.status === "En progreso"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }`}>
                                  {initiative.status}
                                </span>
                                <span className="text-sm text-muted-foreground">{initiative.progress}%</span>
                              </div>
                            </div>
                            <Progress value={initiative.progress} className="h-2" />
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
          <div>
            <h2 className="text-2xl font-bold mb-6">Herramientas Enterprise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full group relative overflow-hidden">
                      {tool.badge && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-violet-500/10 text-violet-500 text-xs font-semibold px-2 py-1 rounded-full">
                            {tool.badge}
                          </span>
                        </div>
                      )}
                      <CardHeader>
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${tool.color} w-fit mb-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full group-hover:bg-violet-600 group-hover:text-white transition-colors"
                          variant="outline"
                          onClick={() => navigate(tool.route)}
                        >
                          Abrir
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
