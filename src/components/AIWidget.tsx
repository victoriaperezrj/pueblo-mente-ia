import { useState, useRef, useEffect, useReducer } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface State {
  messages: Message[];
  isTyping: boolean;
}

type Action = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TYPING'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    default:
      return state;
  }
};

// System Prompts EXACTOS por modo
const SYSTEM_PROMPTS = {
  emprendedor: `Eres un MENTOR DE VALIDACIÓN para emprendedores en etapa idea. Tu trabajo es guiar con preguntas directas, ayudar a definir propuesta de valor, identificar segmento objetivo y validar con experimentos lean. Estructura respuestas así:
🎯 DIAGNÓSTICO: (qué falta definir)
📋 PLAN: (próximos 2-3 pasos accionables)
📊 MÉTRICA: (qué medir para validar)
⏭️ PRÓXIMO: (acción concreta siguiente)

TONO: Amigable pero directo. Evita teoría, da ejemplos concretos argentinos. Pregunta más, sugiere frameworks (Lean Canvas, Jobs-to-be-done).`,

  negocio: `Eres un MENTOR DE ESCALAMIENTO para negocios con 1-3 años operando. Tu trabajo es ordenar finanzas, optimizar procesos y crecer MRR. Pide números específicos (MRR, CAC, LTV, margen) y genera planes con impacto cuantificable. Estructura:
💰 NÚMEROS: (estado actual vs objetivo)
🚀 PALANCAS: (3 acciones alto impacto)
⚙️ PROCESO: (qué automatizar/delegar)
📈 PRÓXIMO MES: (objetivo concreto)

TONO: Coach directo tipo Y Combinator. Habla de tracción, crecimiento, eficiencia. Evita motivacionales, da tácticas.`,

  empresa: `Eres un CONSULTOR EMPRESARIAL para empresas +3 años facturando >$10M/año. Tu trabajo es maximizar rentabilidad, gestionar equipos y explorar mercados nuevos. Analiza estructura de costos, propón automatizaciones IA y expansión estratégica. Estructura:
🏢 SITUACIÓN: (resumen diagnóstico)
💎 OPORTUNIDAD: (dónde está el $$ escondido)
🤖 TECH: (qué automatizar con IA)
🌎 EXPANSIÓN: (nuevos canales/geografías)

TONO: Consejero senior tipo McKinsey. Datos, ROI, casos de éxito. Habla de EBITDA, economías de escala, sinergias.`
};

interface AIWidgetProps {
  mode?: 'emprendedor' | 'negocio' | 'empresa';
}

export default function AIWidget({ mode = 'emprendedor' }: AIWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    role: 'assistant',
    content: mode === 'emprendedor' 
      ? '🎯 ¡Hola! Soy tu mentor de validación. Estoy aquí para ayudarte a convertir tu idea en un negocio real. ¿Cuál es tu idea? ¿Qué problema resuelve?'
      : mode === 'negocio'
      ? '📈 ¡Bienvenido! Soy tu mentor de escalamiento. Ayudo a negocios a crecer ordenadamente. ¿Cuál es tu MRR actual? ¿Cuál es tu objetivo este trimestre?'
      : '🏢 ¡Hola! Soy tu consultor empresarial. Trabajo con empresas maduras para maximizar rentabilidad y explorar nuevos mercados. ¿Cuál es tu ingreso anual? ¿Qué desafío principal enfrentas?'
  };

  const [state, dispatch] = useReducer(reducer, {
    messages: [initialMessage],
    isTyping: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, showTyping]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Mock IA (en producción integrar Claude API)
    return new Promise((resolve) => {
      setTimeout(() => {
        const lower = userMessage.toLowerCase();
        
        if (mode === 'emprendedor') {
          if (lower.includes('app') || lower.includes('idea')) {
            resolve(`🎯 DIAGNÓSTICO: App fitness es un mercado competido pero con nichos desatendidos.

📋 PLAN:
1. Define tu nicho específico (ej: "mujeres +40 que nunca hicieron gym")
2. Valida problema con 10 entrevistas
3. Diseña MVP sin código (Figma + form)

📊 MÉTRICA: 
- 50% de entrevistados dicen "lo pagaría"
- 10 emails pre-registro en landing

⏭️ PRÓXIMO: Haz 3 entrevistas esta semana. ¿Arrancamos con el guión?`);
          }
        } else if (mode === 'negocio') {
          if (lower.match(/\$?\d+k?/)) {
            resolve(`💰 NÚMEROS: Con $5k MRR estás en tracción inicial. Objetivo: $15k en 6 meses.

🚀 PALANCAS (alto impacto):
1. Aumentar LTV: upsell/cross-sell → +30% ingresos
2. Reducir CAC: referidos incentivados → -40% costo
3. Automatizar cobros: Mercado Pago recurrente → +20% conversión

⚙️ PROCESO: Automatiza seguimiento con CRM simple (Google Sheets + Zapier).

📈 PRÓXIMO MES: $7k MRR (+40%). ¿Implementamos el programa de referidos?`);
          }
        } else if (mode === 'empresa') {
          resolve(`🏢 SITUACIÓN: Empresa madura con desafío de rentabilidad en contexto inflacionario.

💎 OPORTUNIDAD: Margen bruto +5% = $50k/año netos. Revisar:
- Proveedores (negociar lotes)
- Automatizar procesos manuales

🤖 TECH: IA puede automatizar:
- Atención cliente (chatbot 24/7)
- Reportes financieros (Power BI auto)
- Inventario predictivo

🌎 EXPANSIÓN: Explorar e-commerce regional (Paraguay/Uruguay). Canales: MercadoLibre internacional.

¿Quieres un plan detallado de automatización?`);
        }
        
        resolve('🤔 Necesito más info para darte un plan accionable. ¿Podrías contarme más detalles específicos?');
      }, 1500);
    });
  };

  const handleSend = async () => {
    if (!input.trim() || state.isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    setInput('');
    dispatch({ type: 'SET_TYPING', payload: true });
    setShowTyping(true);

    try {
      const response = await generateAIResponse(input);
      setShowTyping(false);
      setTimeout(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: response } });
        dispatch({ type: 'SET_TYPING', payload: false });
      }, 300);
    } catch (error) {
      setShowTyping(false);
      dispatch({ type: 'ADD_MESSAGE', payload: { 
        role: 'assistant', 
        content: '❌ Oops, intenta de nuevo —verifica tu conexión' 
      }});
      dispatch({ type: 'SET_TYPING', payload: false });
      console.error('AI Error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Color dinámico según modo
  const modeColors = {
    emprendedor: 'from-[hsl(195,100%,50%)] to-[hsl(150,100%,50%)]', // azul neón → menta
    negocio: 'from-[hsl(271,76%,53%)] to-[hsl(4,100%,70%)]', // púrpura neón → coral
    empresa: 'from-[hsl(150,100%,50%)] to-[hsl(4,100%,70%)]' // verde neón → coral
  };

  const modeBgButton = {
    emprendedor: 'bg-[hsl(195,100%,50%)]',
    negocio: 'bg-[hsl(271,76%,53%)]',
    empresa: 'bg-[hsl(150,100%,50%)]'
  };

  return (
    <>
      {/* Botón Minimizado - Fixed bottom-4 right-4, SIEMPRE visible */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-5 right-5 z-40',
            'w-[60px] h-[60px] rounded-full',
            'bg-gradient-to-br shadow-2xl',
            modeColors[mode],
            'text-white flex items-center justify-center',
            'hover:scale-108 transition-all duration-300 cursor-pointer group',
            'animate-sparkle-pulse'
          )}
          style={{
            boxShadow: '0 0 25px rgba(236, 72, 153, 0.3)'
          }}
          aria-label="Asistente IA"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Panel Expandido - Slide desde derecha, NO fullscreen, z-40 */}
      {isOpen && (
        <>
          {/* Backdrop blur NO bloquea scroll */}
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div
            role="dialog"
            aria-label="Asistente IA"
            className={cn(
              'fixed bottom-5 right-5 z-40',
              'w-[380px] max-w-[88vw] h-[500px] md:h-[600px]',
              'bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl',
              'border border-pink-200',
              'flex flex-col overflow-hidden',
              'animate-slide-right'
            )}
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Header */}
            <div className={cn(
              'h-[60px] bg-gradient-to-r text-white',
              modeColors[mode],
              'flex items-center justify-between px-4',
              'animate-wave'
            )}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm">Asistente IA</h3>
                  <p className="text-xs opacity-80 capitalize">{mode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:scale-90 transition-all duration-200 p-1 hover:bg-white/20"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {state.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start',
                    msg.role === 'user' ? 'animate-bounce-in' : 'animate-fade-in'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      modeBgButton[mode]
                    )}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
                      msg.role === 'user'
                        ? cn('text-white', modeBgButton[mode])
                        : 'bg-white border-2',
                      msg.role === 'assistant' && mode === 'emprendedor' && 'border-[hsl(195,100%,80%)]',
                      msg.role === 'assistant' && mode === 'negocio' && 'border-[hsl(271,76%,85%)]',
                      msg.role === 'assistant' && mode === 'empresa' && 'border-[hsl(150,100%,80%)]'
                    )}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {showTyping && (
                <div className="flex gap-2 animate-fade-in">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', modeBgButton[mode])}>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border-2 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={state.isTyping}
                  className={cn(
                    'flex-1 px-4 py-3 border-2 rounded-xl',
                    'focus:outline-none transition-all duration-200',
                    'disabled:opacity-50 text-sm bg-slate-50',
                    mode === 'emprendedor' && 'focus:border-[hsl(150,100%,50%)] focus:ring-2 focus:ring-[hsl(150,100%,50%)]/20',
                    mode === 'negocio' && 'focus:border-[hsl(4,100%,70%)] focus:ring-2 focus:ring-[hsl(4,100%,70%)]/20',
                    mode === 'empresa' && 'focus:border-[hsl(4,100%,70%)] focus:ring-2 focus:ring-[hsl(4,100%,70%)]/20'
                  )}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || state.isTyping}
                  className={cn(
                    'px-5 rounded-full text-white',
                    'hover:opacity-90 transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'ripple-effect shadow-md',
                    modeBgButton[mode]
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
