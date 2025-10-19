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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              PE
            </div>
            <span className="font-semibold text-gray-900">Proyecto Emprendedurismo</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Volver
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full space-y-16">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">
              ¿En qué etapa estás?
            </h1>
            <p className="text-xl text-gray-600">
              Elegí tu ruta y accedé a herramientas diseñadas para ti
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emprendedor */}
            <button
              onClick={() => handleSelectRole('entrepreneur')}
              disabled={isLoading}
              className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-left">
                Emprendedor
              </h3>
              <p className="text-gray-600 text-left text-sm mb-6">
                ¿Tenés una idea? Validala en minutos.
              </p>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded mb-4">
                DESDE CERO
              </span>
            </button>

            {/* Negocio - DESTACADA */}
            <button
              onClick={() => handleSelectRole('business')}
              disabled={isLoading}
              className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 md:scale-105 relative"
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                ⭐
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-2 text-left">
                Negocio
              </h3>
              <p className="text-white/80 text-left text-sm mb-6">
                Vendés pero todo a mano. Necesitás orden.
              </p>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded">
                1-3 AÑOS
              </span>
            </button>

            {/* Empresa */}
            <button
              onClick={() => handleSelectRole('pyme')}
              disabled={isLoading}
              className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-left">
                Empresa
              </h3>
              <p className="text-gray-600 text-left text-sm mb-6">
                Creció. Automatizá y escalá.
              </p>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                +3 AÑOS
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}