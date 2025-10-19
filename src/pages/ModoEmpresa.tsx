import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Menu, Users, Cpu, Globe, TrendingUp, BarChart2, Zap } from 'lucide-react';
import AIWidget from '@/components/AIWidget';

export default function ModoEmpresa() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const quickActions = [
    { icon: BarChart2, label: 'Análisis rentabilidad', insight: 'Margen +5% = $50k/año extra' },
    { icon: Users, label: 'Gestión de equipo', insight: 'Multi-rol + permisos' },
    { icon: Cpu, label: 'Automatización IA', insight: 'Chatbot, reportes, inventario' },
    { icon: Globe, label: 'Expansión regional', insight: 'Paraguay/Uruguay próximos' },
    { icon: TrendingUp, label: 'Economías escala', insight: 'Reduce costos unitarios' },
    { icon: Zap, label: 'Multi-sucursal', insight: 'Gestión centralizada' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Header Gradient Verde Neón + Coral - con animación wave */}
      <header className="h-[120px] bg-gradient-to-r from-[hsl(150,100%,50%)] to-[hsl(4,100%,70%)] animate-wave relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 hidden md:block">
          <div className="absolute w-32 h-32 bg-white rounded-full blur-3xl top-0 right-1/3 animate-float" />
          <div className="absolute w-24 h-24 bg-white rounded-full blur-2xl bottom-0 left-0 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white neon-glow-text" />
            </div>
            <div>
              <h1 className="font-bold text-3xl text-white neon-glow-text">Automatizar Empresa</h1>
              <p className="text-lg text-white/90">Escalamiento y expansión</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#FFF8E1] rounded-full p-3 hover:scale-110 transition-all duration-300 shadow-lg"
            aria-label="Menú"
          >
            <Menu className="w-5 h-5 text-[hsl(150,100%,50%)]" />
          </button>
        </div>
      </header>

      {/* Quick Actions Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <p className="text-sm text-gray-600 mb-4 font-medium">Acciones rápidas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              data-insight={action.insight}
              className="
                group relative
                border-2 border-[hsl(150,100%,80%)] bg-[hsl(150,100%,95%)]
                text-[hsl(150,100%,30%)] rounded-xl p-4
                hover:bg-[hsl(4,100%,93%)] hover:border-[hsl(4,100%,70%)]
                hover-3d transition-all duration-300
                text-left flex items-center gap-3
                tooltip-insight
              "
            >
              <action.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{action.label}</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(4,100%,70%)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Principal */}
      <div className="max-w-7xl mx-auto px-6 py-4 w-full mb-20">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cuál es tu ingreso anual? ¿Qué proceso consumen más tiempo/$ de tu equipo?"
            className="
              w-full min-h-[120px] px-6 py-4
              bg-white border-2 border-gray-200 rounded-xl
              focus:outline-none focus:ring-4 focus:ring-[hsl(4,100%,70%)]/30 focus:border-[hsl(4,100%,70%)]
              text-gray-900 placeholder-gray-400
              transition-all duration-300
              resize-none
            "
          />
          <button
            onClick={() => console.log('Enviando:', input)}
            className="
              absolute bottom-4 right-4
              bg-[hsl(150,100%,50%)] hover:bg-[hsl(4,100%,70%)]
              text-white rounded-full p-3
              ripple-effect shadow-lg
              transition-all duration-300
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Widget IA */}
      <AIWidget mode="empresa" />
    </div>
  );
}
