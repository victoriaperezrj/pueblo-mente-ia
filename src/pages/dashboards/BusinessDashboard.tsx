import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Percent, ArrowRight, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/layout/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: "Ene", sales: 4200 },
  { month: "Feb", sales: 5100 },
  { month: "Mar", sales: 4800 },
  { month: "Abr", sales: 6300 },
  { month: "May", sales: 7500 },
  { month: "Jun", sales: 8500 },
];

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();

  const metrics = [
    {
      title: "Ventas Totales",
      value: "$8,500",
      change: "+12.5%",
      icon: DollarSign,
      positive: true,
    },
    {
      title: "Clientes Activos",
      value: "145",
      change: "+8 nuevos",
      icon: Users,
      positive: true,
    },
    {
      title: "Tasa de Conversión",
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Margen Promedio",
      value: "42%",
      change: "+2%",
      icon: Percent,
      positive: true,
    },
  ];

  const tools = [
    {
      title: "Optimizador de Precios",
      description: "Encuentra el precio ideal para tus productos",
      route: "/tools/price-optimizer",
      color: "from-[hsl(var(--business))] to-green-600",
    },
    {
      title: "Captador de Clientes",
      description: "Estrategias para conseguir más clientes",
      route: "/tools/customer-acquisition",
      color: "from-[hsl(var(--entrepreneur))] to-blue-600",
    },
    {
      title: "Automatizador",
      description: "Automatiza tareas repetitivas",
      route: "/tools/automation",
      color: "from-[hsl(var(--pyme))] to-purple-600",
    },
    {
      title: "Analizador de Rentabilidad",
      description: "Analiza qué productos te dan más ganancia",
      route: "/tools/profitability-analyzer",
      color: "from-[hsl(var(--accent-pink))] to-pink-600",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-success/5 py-12">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Dashboard{profile?.full_name ? ` de ${profile.full_name}` : ""}
              </h1>
              <p className="text-lg text-muted-foreground">
                Métricas y herramientas para hacer crecer tu negocio
              </p>
            </div>
          </motion.div>

          {/* Metrics Cards */}
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
                      <p className={`text-xs ${metric.positive ? "text-[hsl(var(--success))]" : "text-destructive"} flex items-center mt-1`}>
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Ventas</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--business))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tools */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Herramientas</CardTitle>
                    <CardDescription>Accesos rápidos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tools.map((tool) => (
                      <Button
                        key={tool.title}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate(tool.route)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{tool.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
