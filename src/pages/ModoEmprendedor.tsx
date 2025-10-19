import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Menu, Users, DollarSign, TrendingUp, FileText, MessageSquare, Target } from 'lucide-react';
import AIWidget from '@/components/AIWidget';

export default function ModoEmprendedor() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const quickActions = [
    { icon: Users, label: 'Validar con usuarios', insight: '80% ideas validan con users —¡acción!' },
    { icon: FileText, label: 'Modelo de negocio', insight: 'Lean Canvas en 15 min' },
    { icon: DollarSign, label: 'Números reales', insight: 'Simulación financiera rápida' },
    { icon: TrendingUp, label: 'Competencia', insight: 'Análisis diferenciación' },
    { icon: Target, label: 'Segmento objetivo', insight: 'Define tu ICP ideal' },
    { icon: MessageSquare, label: 'Pitch deck', insight: 'Template inversor ready' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Header Gradient Azul Neón + Menta - con animación wave */}
      <header className="h-[120px] bg-gradient-to-r from-[hsl(195,100%,50%)] to-[hsl(150,100%,50%)] animate-wave relative overflow-hidden">
        {/* Partículas sutiles (solo desktop) */}
        <div className="absolute inset-0 opacity-20 hidden md:block">
          <div className="absolute w-32 h-32 bg-white rounded-full blur-3xl top-0 right-0 animate-float" />
          <div className="absolute w-24 h-24 bg-white rounded-full blur-2xl bottom-0 left-1/4 animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-7 h-7 text-white neon-glow-text" />
            </div>
            <div>
              <h1 className="font-bold text-3xl text-white neon-glow-text">Validar Idea</h1>
              <p className="text-lg text-white/90">Desde cero hasta mercado validado</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#FFF8E1] rounded-full p-3 hover:scale-110 transition-all duration-300 shadow-lg"
            aria-label="Menú"
          >
            <Menu className="w-5 h-5 text-[hsl(195,100%,50%)]" />
          </button>
        </div>
      </header>

      {/* Quick Actions Grid - con hover 3D + tooltip insight */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <p className="text-sm text-gray-600 mb-4 font-medium">Acciones rápidas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              data-insight={action.insight}
              className="
                group relative
                border-2 border-[hsl(195,100%,80%)] bg-[hsl(195,100%,93%)]
                text-[hsl(195,100%,30%)] rounded-xl p-4
                hover:bg-[hsl(150,100%,93%)] hover:border-[hsl(150,100%,50%)]
                hover-3d transition-all duration-300
                text-left flex items-center gap-3
                tooltip-insight
              "
            >
              <action.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{action.label}</span>
              
              {/* Partícula 3D sutil en hover (solo desktop) */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(150,100%,50%)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Principal - con ring menta en focus */}
      <div className="max-w-7xl mx-auto px-6 py-4 w-full mb-20">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cuéntame tu idea... ¿Qué problema resuelve? ¿Para quién?"
            className="
              w-full min-h-[120px] px-6 py-4
              bg-white border-2 border-gray-200 rounded-xl
              focus:outline-none focus:ring-4 focus:ring-[hsl(150,100%,50%)]/30 focus:border-[hsl(150,100%,50%)]
              text-gray-900 placeholder-gray-400
              transition-all duration-300
              resize-none
            "
          />
          <button
            onClick={() => console.log('Enviando:', input)}
            className="
              absolute bottom-4 right-4
              bg-[hsl(195,100%,50%)] hover:bg-[hsl(4,100%,70%)]
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

      {/* Widget IA - Fixed bottom-4 right-4, SIEMPRE visible */}
      <AIWidget mode="emprendedor" />
    </div>
  );
}
