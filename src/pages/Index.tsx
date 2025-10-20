import { useNavigate } from "react-router-dom";
import { Check, Zap, BarChart3, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// SELECT ROLE PAGE - DISEÑO MEJORADO CON IMAGINACIÓN Y COLORES DELICADOS
export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-sm md:text-base text-foreground hidden xs:block">
                Proyecto Emprendedurismo
              </span>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowRight className="w-6 h-6 rotate-180" />
              <span className="ml-2">Volver al inicio</span>
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">¿En qué etapa estás?</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para vos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card Emprendedor - Azul con elementos imaginativos */}
            <div className="group relative bg-gradient-to-br from-primary-light to-white rounded-3xl p-8 border border-primary/20 shadow-xl hover:shadow-2xl transition-all card-hover wave-background">
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Rocket className="w-12 h-12 text-primary rotate-45" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-lg uppercase">
                  Desde cero
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Emprendedor</h3>
              <p className="text-muted-foreground mb-6 text-lg">¿Tenés una idea pero no sabés si funciona?</p>
              <ul className="space-y-3 mb-8">
                {["Validá con IA", "Ves números reales", "Entendé viabilidad"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all">
                Validar idea →
              </Button>
            </div>

            {/* Card Negocio - Púrpura con elementos imaginativos */}
            <div className="group relative bg-gradient-to-br from-tertiary-light to-white rounded-3xl p-8 border border-tertiary/20 shadow-xl hover:shadow-2xl transition-all card-hover wave-background">
              <div className="absolute -top-4 right-6 px-4 py-2 bg-gradient-to-r from-accent to-warning rounded-xl text-sm font-bold text-foreground shadow-lg">
                ⭐ Más popular
              </div>
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-12 h-12 text-tertiary" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-tertiary-light text-tertiary text-xs font-bold rounded-lg uppercase">
                  1-3 años
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Negocio</h3>
              <p className="text-muted-foreground mb-6 text-lg">Vendés, pero todo a mano. Necesitás orden y crecer.</p>
              <ul className="space-y-3 mb-8">
                {["Dashboard real-time", "CRM simple", "Control gastos"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-tertiary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-tertiary hover:bg-tertiary-light text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all">
                Organizar negocio →
              </Button>
            </div>

            {/* Card Empresa - Verde con toque naranja, elementos imaginativos */}
            <div className="group relative bg-gradient-to-br from-success-light to-accent-light rounded-3xl p-8 border border-success/20 shadow-xl hover:shadow-2xl transition-all card-hover wave-background">
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Users className="w-12 h-12 text-success" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-success-light text-success text-xs font-bold rounded-lg uppercase">
                  +3 años
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Empresa</h3>
              <p className="text-muted-foreground mb-6 text-lg">Creció tu empresa. Automatizá y escala con IA.</p>
              <ul className="space-y-3 mb-8">
                {["Gestión de equipo", "Automatización", "Multi-sucursal"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-success mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-success hover:bg-success-light text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all">
                Automatizar →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
