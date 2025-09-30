import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Users, Calendar, DollarSign, AlertCircle, Lightbulb, FileText, Calculator } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ventas del Mes",
      value: "$0",
      change: "+0%",
      icon: TrendingUp,
      iconColor: "text-success",
      textColor: "text-success",
      bgGradient: "from-success/10 to-success/5",
    },
    {
      title: "Productos",
      value: "0",
      change: "Registrados",
      icon: Package,
      iconColor: "text-primary",
      textColor: "text-primary",
      bgGradient: "from-primary/10 to-primary/5",
    },
    {
      title: "Clientes",
      value: "0",
      change: "Activos",
      icon: Users,
      iconColor: "text-warning",
      textColor: "text-warning",
      bgGradient: "from-warning/10 to-warning/5",
    },
    {
      title: "Turnos Hoy",
      value: "0",
      change: "Pendientes",
      icon: Calendar,
      iconColor: "text-info",
      textColor: "text-info",
      bgGradient: "from-info/10 to-info/5",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          ¡Bienvenido de nuevo! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Aquí está el resumen de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`bg-gradient-to-br ${stat.bgGradient} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.textColor} font-medium mt-1`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 hover:border-success/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-success/10 to-success/5 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              Ventas Recientes
            </CardTitle>
            <CardDescription>Últimas transacciones del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No hay ventas registradas aún
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Comenzá a registrar tus primeras ventas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-warning/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-warning/10 to-warning/5 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              Stock Crítico
            </CardTitle>
            <CardDescription>Productos bajo stock mínimo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-success font-medium">
                ✓ Todo en orden
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Todos los productos tienen stock suficiente
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Próximos Turnos
            </CardTitle>
            <CardDescription>Tu agenda de hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No hay turnos programados
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tu agenda está libre para hoy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🤖 Herramientas de IA</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl cursor-pointer group overflow-hidden"
            onClick={() => navigate("/idea-validator")}
          >
            <div className="h-1 bg-gradient-primary" />
            <CardHeader>
              <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                Validador de Ideas
              </CardTitle>
              <CardDescription>
                Analizá el potencial de tu negocio con IA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="border-2 hover:border-success/50 transition-all duration-300 hover:shadow-2xl cursor-pointer group overflow-hidden"
            onClick={() => navigate("/business-blueprint")}
          >
            <div className="h-1 bg-gradient-success" />
            <CardHeader>
              <div className="bg-gradient-success rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-success transition-colors">
                Business Blueprint
              </CardTitle>
              <CardDescription>
                Plan de negocio completo generado con IA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="border-2 hover:border-warning/50 transition-all duration-300 hover:shadow-2xl cursor-pointer group overflow-hidden"
            onClick={() => navigate("/financial-simulator")}
          >
            <div className="h-1 bg-gradient-warm" />
            <CardHeader>
              <div className="bg-gradient-warm rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-warning transition-colors">
                Simulador Financiero
              </CardTitle>
              <CardDescription>
                Proyectá ventas, costos y rentabilidad
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* AI Insight Card */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-3xl animate-bounce-subtle">🤖</span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Insight del Día con IA
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed mb-4">
            ¡Bienvenido a PuebloHub! 🚀 
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Comenzá a registrar tus ventas y productos para obtener{" "}
            <span className="font-semibold text-foreground">insights personalizados</span> sobre tu negocio.
            Nuestro asistente de IA analizará tus datos y te dará recomendaciones inteligentes para{" "}
            <span className="font-semibold text-foreground">aumentar tus ventas</span> y{" "}
            <span className="font-semibold text-foreground">optimizar tu inventario</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
