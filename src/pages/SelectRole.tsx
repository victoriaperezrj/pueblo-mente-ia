import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SelectRole() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (roleId: string) => {
    setIsLoading(true);
    sessionStorage.setItem('demoRole', roleId);
    setTimeout(() => {
      navigate(`/dashboard/${roleId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              PE
            </div>
            <span className="font-semibold text-gray-900">Proyecto Emprendedurismo</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Volver
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              ¿En qué etapa estás?
            </h1>
            <p className="text-xl text-gray-600">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Emprendedor */}
            <button
              onClick={() => handleSelectRole('entrepreneur')}
              disabled={isLoading}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-102 text-left"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-4">
                🚀
              </div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded mb-3 uppercase tracking-wide">
                DESDE CERO
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emprendedor</h3>
              <p className="text-gray-600 mb-4">
                ¿Tenés una idea pero no sabés si funciona?
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Validá con IA
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Ves números reales
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Entendé viabilidad
                </li>
              </ul>
              <span className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg font-semibold group-hover:bg-blue-700 transition">
                Validar Idea →
              </span>
            </button>

            {/* Card 2: Negocio (DESTACADA) */}
            <button
              onClick={() => handleSelectRole('business')}
              disabled={isLoading}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 text-left md:scale-110"
            >
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
                ⭐ MÁS POPULAR
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-4">
                📊
              </div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mb-3 uppercase tracking-wide">
                1-3 AÑOS
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Negocio</h3>
              <p className="text-gray-600 mb-4">
                Vendés, pero todo a mano. Necesitás ordenar y crecer.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Dashboard real-time
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ CRM simple
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Control gastos
                </li>
              </ul>
              <span className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg font-semibold group-hover:bg-blue-700 transition">
                Organizar Negocio →
              </span>
            </button>

            {/* Card 3: Empresa */}
            <button
              onClick={() => handleSelectRole('enterprise')}
              disabled={isLoading}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-102 text-left"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl mb-4">
                🏢
              </div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded mb-3 uppercase tracking-wide">
                +3 AÑOS
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresa</h3>
              <p className="text-gray-600 mb-4">
                Creció tu empresa. Automatizá y escalá con IA.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Gestión de equipo
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Automatización
                </li>
                <li className="text-sm text-green-600 flex items-center gap-2">
                  ✓ Multi-sucursal
                </li>
              </ul>
              <span className="block w-full py-2 px-4 bg-green-600 text-white text-center rounded-lg font-semibold group-hover:bg-green-700 transition">
                Automatizar →
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
