import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Gift, Lock, Sparkles, Lightbulb, TrendingUp, Building2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Tu negocio, del plan a la acción';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Header Sticky */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : 'bg-transparent'}
      `}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(195,100%,50%)] to-[hsl(271,76%,53%)] rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Proyecto Emprendedurismo</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="text-gray-700 hover:text-gray-900 font-medium text-sm transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="px-4 py-2 bg-gradient-to-r from-[hsl(150,100%,50%)] to-[hsl(4,100%,70%)] text-white rounded-lg hover:opacity-90 font-semibold text-sm transition shadow-md"
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section con typewriter + partículas sutiles */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Gradient background neón sutil */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[hsl(195,100%,50%)]/10 to-[hsl(150,100%,50%)]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[hsl(271,76%,53%)]/10 to-[hsl(4,100%,70%)]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-3xl text-center space-y-8 relative z-10 animate-fade-in">
          {/* Micro-label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(195,100%,93%)] border-2 border-[hsl(195,100%,50%)] rounded-full">
            <Sparkles className="w-4 h-4 text-[hsl(195,100%,50%)]" />
            <span className="text-xs font-bold text-[hsl(195,100%,30%)] uppercase tracking-wide">
              ✨ Ecosistema IA para emprendedores
            </span>
          </div>

          {/* Typewriter Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight min-h-[4rem]">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
            Ecosistema inteligente que evoluciona con vos: validación, organización y escalamiento con IA local
          </p>

          {/* CTA Buttons con ripple */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={() => navigate('/select-role')}
              className="px-8 py-4 bg-gradient-to-r from-[hsl(150,100%,50%)] to-[hsl(195,100%,50%)] text-white rounded-xl hover:opacity-90 font-bold text-lg transition transform hover:scale-105 shadow-lg ripple-effect"
            >
              Explorar Demo →
            </button>
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="px-8 py-4 bg-gradient-to-r from-[hsl(4,100%,70%)] to-[hsl(271,76%,53%)] text-white rounded-xl hover:opacity-90 font-bold text-lg transition transform hover:scale-105 shadow-lg"
            >
              Crear Cuenta
            </button>
          </div>

          {/* Benefit line */}
          <p className="text-sm text-gray-600 pt-4 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[hsl(195,100%,50%)]" />
              Sin tarjeta
            </span>
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[hsl(150,100%,50%)]" />
              Gratis empezar
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[hsl(271,76%,53%)]" />
              Datos seguros
            </span>
          </p>
        </div>
      </section>

      {/* Three Modes Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">¿En qué etapa estás?</h2>
            <p className="text-xl text-gray-600">Herramientas diseñadas para tu momento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Emprendedor */}
            <button
              onClick={() => navigate('/modo-emprendedor')}
              className="group bg-gradient-to-br from-[hsl(195,100%,93%)] to-white border-2 border-[hsl(195,100%,50%)] rounded-2xl p-8 hover:shadow-2xl hover-3d transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(195,100%,50%)] to-[hsl(150,100%,50%)] rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <Lightbulb className="w-7 h-7" />
              </div>
              <span className="inline-block px-3 py-1 bg-[hsl(195,100%,50%)] text-white text-xs font-bold rounded mb-3 uppercase">
                Desde cero
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emprendedor</h3>
              <p className="text-gray-600 text-sm mb-4">
                ¿Tenés una idea? Validala con IA en minutos
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(150,100%,50%)]">✓</span> Validación rápida
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(150,100%,50%)]">✓</span> Números reales
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(150,100%,50%)]">✓</span> Plan de acción
                </li>
              </ul>
              <div className="mt-6 text-[hsl(195,100%,50%)] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Comenzar <span>→</span>
              </div>
            </button>

            {/* Card 2: Negocio - DESTACADA */}
            <button
              onClick={() => navigate('/modo-negocio')}
              className="group bg-gradient-to-br from-[hsl(271,76%,53%)] to-[hsl(4,100%,70%)] rounded-2xl p-8 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] hover-3d transition-all duration-300 md:scale-105 relative text-left"
            >
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                ⭐ Popular
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                <TrendingUp className="w-7 h-7" />
              </div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded mb-3 uppercase">
                1-3 años
              </span>
              <h3 className="text-2xl font-bold mb-2">Negocio</h3>
              <p className="text-white/90 text-sm mb-4">
                Vendés pero todo a mano. Necesitás orden
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span>✓</span> Dashboard real-time
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> CRM simple
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Control gastos
                </li>
              </ul>
              <div className="mt-6 text-white font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Comenzar <span>→</span>
              </div>
            </button>

            {/* Card 3: Empresa */}
            <button
              onClick={() => navigate('/modo-empresa')}
              className="group bg-gradient-to-br from-[hsl(150,100%,93%)] to-white border-2 border-[hsl(150,100%,50%)] rounded-2xl p-8 hover:shadow-2xl hover-3d transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(150,100%,50%)] to-[hsl(4,100%,70%)] rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="inline-block px-3 py-1 bg-[hsl(150,100%,50%)] text-white text-xs font-bold rounded mb-3 uppercase">
                +3 años
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresa</h3>
              <p className="text-gray-600 text-sm mb-4">
                Creció. Automatizá y escalá
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(4,100%,70%)]">✓</span> Multi-sucursal
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(4,100%,70%)]">✓</span> Gestión equipo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(4,100%,70%)]">✓</span> Automatización IA
                </li>
              </ul>
              <div className="mt-6 text-[hsl(150,100%,50%)] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Comenzar <span>→</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>© 2025 Proyecto Emprendedurismo. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white transition">Términos</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}