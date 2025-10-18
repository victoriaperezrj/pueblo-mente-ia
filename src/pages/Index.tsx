import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, BarChart3, Building2, Menu, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Sticky with backdrop blur */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5B7FFF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 hidden sm:block">
                Proyecto Emprendedurismo
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth?mode=login')}
                className="font-medium"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-gradient-to-r from-[#5B7FFF] to-[#8B5CF6] text-white font-semibold hover:opacity-90 shadow-md"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/select-role')}
                className="font-medium"
              >
                Ver Demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-5">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/auth?mode=login');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => {
                  navigate('/auth?mode=signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center bg-gradient-to-r from-[#5B7FFF] to-[#8B5CF6] text-white"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/select-role');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center"
              >
                Ver Demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Gradient Background */}
      <section className="relative min-h-screen md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-0 overflow-hidden bg-gradient-to-br from-[#5B7FFF] via-[#7C5CFF] to-[#8B5CF6]">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white backdrop-blur-sm">
            <span className="text-sm font-medium text-white">⚡ IA que entiende Argentina</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            De la idea a los números en días, no meses
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            ¿Tenés una idea? ¿Un negocio que crece? ¿Una empresa que necesita orden?
            <br className="hidden sm:block" />
            Acá validás, organizás y escalás TODO en un solo lugar.
          </p>

          {/* Micro-benefits */}
          <p className="text-sm text-white/80">
            ✓ Sin tarjeta ✓ Datos seguros ✓ Empezá en 2 min
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth?mode=signup')}
              className="w-full sm:w-auto bg-white text-[#5B7FFF] hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Comenzar Gratis →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/select-role')}
              className="w-full sm:w-auto px-7 py-5 text-lg font-bold rounded-lg bg-transparent border-2 border-white hover:bg-white/10 text-white backdrop-blur-sm transition-all duration-200"
            >
              Ver Demo
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/business-ai-bot')}
              className="w-full sm:w-auto px-8 py-6 text-lg font-bold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white transition-all duration-200 hover:-translate-y-0.5 shadow-xl hover:shadow-2xl"
            >
              Bot IA Empresarial 🤖
            </Button>
          </div>
        </div>
      </section>

      {/* ¿En qué etapa estás? Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              ¿En qué etapa estás?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {/* Card 1 - EMPRENDEDOR */}
            <div className="relative group bg-white rounded-xl p-7 border border-gray-200 hover:border-[#5B7FFF]/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]">
              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full bg-[#5B7FFF] flex items-center justify-center">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide">
                    DESDE CERO
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900">Emprendedor</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  ¿Tenés una idea pero no sabés si funciona?
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Validá con IA', 'Ves números reales', 'Entendé viabilidad'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-[#5B7FFF] hover:bg-[#4A6FEE] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
                >
                  Validar Idea →
                </Button>
              </div>
            </div>

            {/* Card 2 - NEGOCIO (DESTACADA) */}
            <div className="relative group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-7 border-2 border-[#5B7FFF] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
              {/* Badge "Más Popular" */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-[#5B7FFF] rounded text-xs font-bold text-white shadow-md">
                ⭐ Más Popular
              </div>

              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full bg-[#5B7FFF] flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-[#5B7FFF]/10 text-[#5B7FFF] text-xs font-semibold rounded uppercase tracking-wide">
                    1-3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900">Negocio</h3>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  Vendés, pero todo a mano. Necesitás ordenar y crecer.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Dashboard real-time', 'CRM simple', 'Control gastos'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-[#5B7FFF] hover:bg-[#4A6FEE] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
                >
                  Organizar Negocio →
                </Button>
              </div>
            </div>

            {/* Card 3 - EMPRESA */}
            <div className="relative group bg-white rounded-xl p-7 border border-gray-200 hover:border-green-500/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] md:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide">
                    +3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900">Empresa</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  Creció tu empresa. Automatizá y escalá con IA.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Gestión de equipo', 'Automatización', 'Multi-sucursal'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
                >
                  Automatizar →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-12 text-center">
        <p className="text-sm text-gray-500">
          Probá gratis • Sin tarjeta • Datos seguros • Empezá en 2 min
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm">
            © 2025 Proyecto Emprendedurismo. Todos los derechos reservados.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:underline">Términos</a>
            <a href="#" className="hover:underline">Privacidad</a>
            <a href="#" className="hover:underline">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}