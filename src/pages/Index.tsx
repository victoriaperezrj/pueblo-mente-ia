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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">PuebloHub</span>
        </div>
        <Button onClick={() => navigate("/auth")}>
          Iniciar Sesión
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
          Tu Negocio, Potenciado por IA
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Desde validar tu idea hasta gestionar operaciones diarias. 
          PuebloHub es la plataforma todo-en-uno para emprendedores de San Luis, Argentina.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Comenzar Gratis
          </Button>
          <Button size="lg" variant="outline">
            Ver Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Validación con IA</h3>
            <p className="text-muted-foreground">
              Validá tu idea de negocio en minutos con análisis inteligente
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="bg-success/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">ERP Completo</h3>
            <p className="text-muted-foreground">
              Ventas, inventario, clientes y turnos en un solo lugar
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="bg-warning/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketplace B2B</h3>
            <p className="text-muted-foreground">
              Conectá con proveedores y otros emprendedores locales
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-primary to-success rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Uníte a los emprendedores que ya están creciendo con PuebloHub
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Crear Cuenta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>© 2025 PuebloHub - Plataforma de Gestión Empresarial</p>
          <p className="text-sm mt-2">San Luis, Argentina</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
