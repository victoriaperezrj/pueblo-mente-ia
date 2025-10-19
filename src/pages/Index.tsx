import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER - Sticky, minimalista */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              PE
            </div>
            <span className="font-semibold text-gray-900 hidden sm:inline">
              Proyecto Emprendedurismo
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm transition"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition"
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Gradient background subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        </div>

        <div className="max-w-2xl text-center space-y-6 animate-fade-in">
          {/* Micro-label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
              ✨ IA para emprendedores
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
            De la idea a los números en días, no meses
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Validá tu negocio, organizá ventas, escalá con IA. Todo en un solo lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate('/select-role')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
            >
              Comenzar →
            </button>
            <button
              onClick={() => navigate('/select-role')}
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg transition"
            >
              Ver Demo
            </button>
          </div>

          {/* Benefit line */}
          <p className="text-sm text-gray-500 pt-4">
            Sin tarjeta • Acceso inmediato • Datos seguros
          </p>
        </div>
      </section>

      {/* SECTION 2: Las 3 Etapas (Info, NO clickeable) */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              ¿En qué etapa estás?
            </h2>
            <p className="text-lg text-gray-600">
              Herramientas diseñadas para tu momento
            </p>
          </div>

          {/* 3 Info Cards (NOT clickeable, just display) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emprendedor</h3>
              <p className="text-gray-600 text-sm mb-4">
                ¿Tenés una idea? Validala con IA en minutos.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Validación rápida</li>
                <li>✓ Números reales</li>
                <li>✓ Plan de acción</li>
              </ul>
            </div>

            {/* Card 2 - DESTACADA */}
            <div className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 md:scale-105 relative">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                ⭐ Popular
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-2">Negocio</h3>
              <p className="text-white/80 text-sm mb-4">
                Vendés pero todo a mano. Necesitás orden y crecimiento.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Dashboard real-time</li>
                <li>✓ Gestión de clientes</li>
                <li>✓ Control de gastos</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                🏢
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresa</h3>
              <p className="text-gray-600 text-sm mb-4">
                Creció tu empresa. Automatizá y escalá.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Multi-sucursal</li>
                <li>✓ Gestión de equipo</li>
                <li>✓ Automatizaciones IA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}