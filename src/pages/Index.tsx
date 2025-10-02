import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-warning/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-sm bg-background/80 sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="bg-gradient-primary rounded-xl p-2.5 shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Proyecto Emprendedurismo
          </span>
        </div>
        <Button onClick={() => navigate("/auth")} size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
          Iniciar Sesión
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center animate-fade-in relative">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 hover:scale-105 transition-transform shadow-lg animate-scale-in">
            <Zap className="h-4 w-4 animate-pulse" />
            <span>Potenciado por Inteligencia Artificial</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Arrancá{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent inline-block hover:scale-105 transition-transform">
              Tu Negocio
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Te ayudamos paso a paso, desde tu idea hasta vender todos los días. 
            Todo <span className="font-semibold text-foreground">en palabras simples</span>, pensado para 
            emprendedores de <span className="font-semibold text-foreground">San Luis, Argentina</span>.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              size="lg" 
              variant="default"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 transition-all duration-300"
            >
              Empezar Ahora ✨
              <span className="ml-2">→</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300"
            >
              Ver Cómo Funciona
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "100+", label: "Emprendedores" },
            { value: "8", label: "Rubros" },
            { value: "24/7", label: "Asistente IA" },
            { value: "100%", label: "Gratis" },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Todo lo que necesitás{" "}
            <span className="bg-gradient-success bg-clip-text text-transparent">
              en un solo lugar
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Herramientas fáciles de usar, pensadas para vos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Te decimos si tu idea funciona",
              description: "En 10 minutos sabés si tu negocio puede andar bien",
              iconColor: "text-primary",
              gradient: "from-primary/10 to-primary/5",
            },
            {
              icon: TrendingUp,
              title: "Todo lo que necesitás para vender",
              description: "Llevá cuenta de ventas, productos, clientes y turnos en un solo lugar",
              iconColor: "text-success",
              gradient: "from-success/10 to-success/5",
            },
            {
              icon: Users,
              title: "Comprá más barato en grupo",
              description: "Juntate con otros emprendedores de San Luis para ahorrar",
              iconColor: "text-warning",
              gradient: "from-warning/10 to-warning/5",
            },
            {
              icon: Building2,
              title: "Varios negocios a la vez",
              description: "¿Tenés más de un emprendimiento? Manejá todo desde acá",
              iconColor: "text-info",
              gradient: "from-info/10 to-info/5",
            },
            {
              icon: TrendingUp,
              title: "Calculá cuánta plata vas a ganar",
              description: "Sabé cuánto ganás antes de empezar, sin sorpresas",
              iconColor: "text-accent",
              gradient: "from-accent/10 to-accent/5",
            },
            {
              icon: Users,
              title: "Preguntá lo que necesites",
              description: "Tu asistente responde tus dudas las 24 horas",
              iconColor: "text-secondary",
              gradient: "from-secondary/10 to-secondary/5",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden bg-gradient-hero rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para arrancar?
            </h2>
            <p className="text-white/90 mb-8 text-lg md:text-xl max-w-2xl mx-auto">
              Empezá hoy mismo. Es gratis y no necesitás tarjeta de crédito.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-10 py-7 font-semibold bg-white text-primary hover:bg-white/90 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Crear Cuenta Gratis
              <span className="ml-2 text-xl">🚀</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-primary rounded-lg p-2">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              Proyecto Emprendedurismo
            </span>
          </div>
          <p className="text-muted-foreground mb-2">
            © 2025 Proyecto Emprendedurismo - Tu negocio paso a paso
          </p>
          <p className="text-sm text-muted-foreground">
            🇦🇷 Hecho con ❤️ en San Luis, Argentina
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
