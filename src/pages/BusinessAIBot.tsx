import { useState, useRef, useEffect } from 'react';
import { Zap, TrendingUp, Building2, Menu, Send, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Mode = '1' | '2' | '3' | null;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const getSystemPrompt = (mode: Mode): string => {
  if (mode === '1') {
    return `Eres un MENTOR DE VALIDACIÓN DE IDEAS especializado en startups pre-product.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES, no información genérica.

Estructura tus respuestas así:
1. DIAGNÓSTICO: Identifica el problema específico
2. PLAN DE ACCIÓN: Pasos concretos numerados (máximo 5)
3. MÉTRICA: Cómo medir si funcionó
4. PRÓXIMO PASO: Qué hacer después

Tu objetivo específico:
- Ayudar a validar ideas de forma rápida y económica
- Diseñar experimentos para probar supuestos
- Identificar el verdadero problema que resuelves
- Definir el MVP más pequeño posible

Cuando pregunten: "¿Es viable mi idea?"
→ Primero pregunta: ¿Cuál es el problema? ¿Quién lo tiene? ¿Lo validaste con usuarios?
→ Luego da un plan de 3-4 pasos para validar en 2 semanas

Ejemplo de respuesta CORRECTA:
"DIAGNÓSTICO: Tu idea de delivery vegano es viable si el mercado real lo quiere.
PLAN: 1) Contacta 20 veganos en Twitter/FB en 3 días 2) Pregúntales: ¿Gastas >$10 en comida vegana semanal? 3) Si 14+ dicen sí, hay mercado
MÉTRICA: 70%+ confirmación = validado
PRÓXIMO PASO: Arma MVP en 2 semanas"`;
  } else if (mode === '2') {
    return `Eres un MENTOR DE ESCALAMIENTO para negocios 1-3 años con product-market fit.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES, no información genérica.

Estructura tus respuestas así:
1. DIAGNÓSTICO: Identifica el problema específico
2. PLAN DE ACCIÓN: Pasos concretos numerados (máximo 5)
3. MÉTRICA: Cómo medir si funcionó
4. PRÓXIMO PASO: Qué hacer después

Tu expertise:
- Escalamiento de ventas y operaciones
- Gestión de equipo reducido
- Decisiones con presupuesto limitado
- Métricas que predicen crecimiento

Cuando pregunten sobre escalamiento:
→ Primero: ¿Cuál es tu MRR actual? ¿Margen? ¿Tasa de churn?
→ Luego: Da pasos específicos como "contratar XYZ", "implementar herramienta ABC"
→ Cifras: "Esto debería aumentar ventas 30% en 3 meses"

Ejemplo de respuesta CORRECTA:
"DIAGNÓSTICO: Tu MRR $10k con 40% margen es viable para escalar.
PLAN: 1) Contrata 1 sales person (costo $2k/mes) 2) Invierte $3k en ads 3) Espera 4 semanas
MÉTRICA: Objetivo +50% clientes nuevos (MRR $15k)
PRÓXIMO PASO: Si se cumple, duplica inversión"`;
  } else if (mode === '3') {
    return `Eres un CONSULTOR EMPRESARIAL para PYMES y empresas establecidas.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES, no información genérica.

Estructura tus respuestas así:
1. DIAGNÓSTICO: Identifica el problema específico
2. PLAN DE ACCIÓN: Pasos concretos numerados (máximo 5)
3. MÉTRICA: Cómo medir si funcionó
4. PRÓXIMO PASO: Qué hacer después

Tu expertise:
- Análisis financiero y rentabilidad
- Optimización de procesos
- Estrategia competitiva
- Expansión y nuevos mercados

Cuando analices un problema:
→ Pide datos: ingresos, costos, márgenes, competidores
→ Haz diagnóstico basado en números
→ Proporciona plan con impacto financiero estimado

Ejemplo de respuesta CORRECTA:
"DIAGNÓSTICO: Tu empresa $2M ingresos tiene margen bajo (8%), deberían ser 15%+.
PLAN: 1) Audita costos (encontrarás 15-20% en ineficiencias) 2) Automatiza procesos 3) Renegocia proveedores
MÉTRICA: Objetivo: margen 12% = +$80k anuales
PRÓXIMO PASO: Implementar en 90 días"`;
  }
  return '';
};

const getInitialMessage = (mode: Mode): string => {
  if (mode === '1') {
    return `¡Hola emprendedor! Soy tu mentor de validación.

Estoy aquí para ayudarte a validar tu idea de forma rápida y económica.

Cuéntame:
1. ¿Cuál es el problema que resuelves?
2. ¿Quién lo tiene? (describe a tu usuario ideal)
3. ¿Ya hablaste con clientes potenciales?

Mientras tanto, usa los botones abajo para explorar cómo validar tu idea.`;
  } else if (mode === '2') {
    return `¡Bienvenido! Soy tu mentor de escalamiento.

Tu negocio tiene product-market fit, ahora es el momento de crecer de forma estratégica.

Para darte las mejores recomendaciones, necesito entender:
1. ¿Cuál es tu MRR (ingresos mensuales recurrentes)?
2. ¿Cuál es tu principal desafío: ventas, operaciones, o equipo?
3. ¿Cuánto presupuesto tienes para invertir en crecimiento?`;
  } else if (mode === '3') {
    return `¡Hola! Soy tu consultor empresarial.

Ayudo a empresas establecidas a optimizar operaciones, expandir mercados y mejorar rentabilidad.

Comparte tu situación:
1. ¿Cuáles son tus ingresos anuales aproximados?
2. ¿Cuál es tu principal desafío: eficiencia, crecimiento, o rentabilidad?
3. ¿Qué área te gustaría optimizar primero?`;
  }
  return '';
};

const getQuickActions = (mode: Mode): string[] => {
  if (mode === '1') {
    return [
      '¿Es viable mi idea?',
      'Cómo validar supuestos',
      'Plan de MVP',
      'Encontrar primeros clientes',
    ];
  } else if (mode === '2') {
    return [
      'Cómo escalar ventas',
      'Optimizar costos operacionales',
      'Armar equipo',
      'Métricas que importan',
      'Estrategia de inversión',
    ];
  } else if (mode === '3') {
    return [
      'Análisis de rentabilidad',
      'Plan de expansión',
      'Optimizar operaciones',
      'Estrategia competitiva',
      'Gestión de equipos',
    ];
  }
  return [];
};

const BusinessAIBot = () => {
  const [currentMode, setCurrentMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentMode) {
      setMessages([
        {
          role: 'assistant',
          content: getInitialMessage(currentMode),
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [currentMode]);

  const generateAIResponse = async (userMessage: string) => {
    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMessage },
          ],
          systemPrompt: getSystemPrompt(currentMode),
        },
      });

      if (error) throw error;

      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiResponse = await generateAIResponse(inputValue);

    const botMessage: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: action,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const aiResponse = await generateAIResponse(action);

    const botMessage: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  if (!currentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tu Asesor IA Empresarial
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              Respuestas concretas para cada etapa
            </p>
            <p className="text-sm text-slate-400">
              Selecciona tu etapa para recibir estrategias personalizadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* BOTÓN 1 - AZUL */}
            <button
              onClick={() => setCurrentMode('1')}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-lg transform transition"
            >
              <Zap className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-1">Idea Validada</h2>
              <p className="text-xs opacity-90 mb-4">0-1 año</p>
              <p className="text-sm leading-relaxed mb-4">
                Tienes una idea con potencial
              </p>
              <div className="text-xs opacity-75 space-y-1">
                <p>• Validación de mercado</p>
                <p>• MVP y Product-Market Fit</p>
              </div>
            </button>

            {/* BOTÓN 2 - PÚRPURA */}
            <button
              onClick={() => setCurrentMode('2')}
              className="p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-lg transform transition"
            >
              <TrendingUp className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-1">
                Emprendimiento en Crecimiento
              </h2>
              <p className="text-xs opacity-90 mb-4">1-3 años</p>
              <p className="text-sm leading-relaxed mb-4">
                Tu negocio está validado y creciendo
              </p>
              <div className="text-xs opacity-75 space-y-1">
                <p>• Escalamiento de ventas</p>
                <p>• Optimización operacional</p>
              </div>
            </button>

            {/* BOTÓN 3 - VERDE */}
            <button
              onClick={() => setCurrentMode('3')}
              className="p-8 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:scale-105 active:scale-95 shadow-lg transform transition"
            >
              <Building2 className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-1">Empresa Establecida</h2>
              <p className="text-xs opacity-90 mb-4">3+ años</p>
              <p className="text-sm leading-relaxed mb-4">
                Empresa PYME o grande con operaciones
              </p>
              <div className="text-xs opacity-75 space-y-1">
                <p>• Estrategia empresarial</p>
                <p>• Rentabilidad y expansión</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const modeConfig = {
    '1': {
      gradient: 'from-blue-500 to-blue-600',
      icon: Zap,
      title: 'Idea Validada',
      subtitle: '0-1 año',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      messageColor: 'bg-blue-500',
    },
    '2': {
      gradient: 'from-purple-500 to-purple-600',
      icon: TrendingUp,
      title: 'Emprendimiento en Crecimiento',
      subtitle: '1-3 años',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      messageColor: 'bg-blue-500',
    },
    '3': {
      gradient: 'from-green-500 to-green-600',
      icon: Building2,
      title: 'Empresa Establecida',
      subtitle: '3+ años',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      messageColor: 'bg-blue-500',
    },
  };

  const config = modeConfig[currentMode];
  const Icon = config.icon;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${config.gradient} p-4 shadow-lg flex items-center justify-between text-white`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold">{config.title}</h1>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentMode(null)}
          className="p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-2xl p-4 rounded-lg ${
                msg.role === 'user'
                  ? `${config.messageColor} text-white rounded-br-none`
                  : `bg-white border-2 ${config.borderColor} rounded-bl-none`
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              <p
                className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'opacity-70' : 'opacity-70'
                }`}
              >
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`max-w-2xl p-4 rounded-lg bg-white border-2 ${config.borderColor} rounded-bl-none`}
            >
              <p className="text-slate-600">Escribiendo...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && !isLoading && (
        <div className="bg-slate-100 border-t border-slate-200 p-4 max-w-4xl mx-auto w-full">
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">
            Preguntas sugeridas:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {getQuickActions(currentMode).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className={`text-left p-3 rounded-lg border-2 ${config.borderColor} ${config.bgColor} ${config.textColor} font-medium text-sm flex items-start gap-2 hover:scale-105 transition`}
              >
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta específica o desafío..."
            disabled={isLoading}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-slate-400 font-medium flex items-center gap-2 transition"
          >
            <Send className="w-5 h-5" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessAIBot;
