import { useState, useRef, useEffect, useCallback } from "react";
import { Zap, TrendingUp, Building2, Send, Lightbulb, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FloatingOrbs } from "@/components/business-bot/FloatingOrbs";
import { FloatingParticles } from "@/components/animations/FloatingParticles";

type Mode = "1" | "2" | "3" | null;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ══════════════════════════════════════════════════════════════════════
// SYSTEM PROMPTS - Optimizados
// ══════════════════════════════════════════════════════════════════════
const getSystemPrompt = (mode: Mode): string => {
  if (mode === "1") {
    return `Eres un MENTOR DE VALIDACIÓN DE IDEAS especializado en startups argentinas.

IMPORTANTE: Respuestas CONCRETAS, ACCIONABLES y BREVES.

Estructura (máx 200 palabras):
1. DIAGNÓSTICO (1-2 líneas)
2. PLAN (3-4 pasos concretos)
3. MÉTRICA (cómo medir)
4. PRÓXIMO PASO (acción inmediata)

Objetivo:
- Validar ideas rápido y barato
- Diseñar experimentos simples
- MVP mínimo viable

Ejemplo:
"DIAGNÓSTICO: Tu idea de delivery vegano puede funcionar.
PLAN: 
1. Contactá 20 veganos en CABA (Instagram/Facebook) esta semana
2. Preguntales: ¿Gastás +$5000/semana en comida vegana?
3. Si 14+ dicen SÍ → hay mercado real
MÉTRICA: 70%+ = validado
PRÓXIMO PASO: Armá landing y juntá 10 emails en 3 días"`;
  } else if (mode === "2") {
    return `Eres un MENTOR DE ESCALAMIENTO para negocios argentinos 1-3 años.

IMPORTANTE: Respuestas con NÚMEROS y PASOS CONCRETOS.

Estructura (máx 250 palabras):
1. DIAGNÓSTICO (basado en datos)
2. PLAN (4 acciones con timeline)
3. MÉTRICA (impacto esperado: +X% revenue)
4. PRÓXIMO PASO

SIEMPRE pedí datos antes: MRR, margen, equipo, principal desafío.

Ejemplo:
"DIAGNÓSTICO: $500k MRR con 30% margen es sólido. Bottleneck: solo 2 personas en ventas.

PLAN:
Mes 1: Contratá 1 closer ($150k/mes)
Mes 2: Invertí $200k en Meta Ads
Mes 3: Implementá CRM (Pipedrive)
Mes 4: Medí resultados

MÉTRICA: +40% MRR en 3 meses ($700k)
PRÓXIMO PASO: Publicá búsqueda de closer esta semana"`;
  } else if (mode === "3") {
    return `Eres un CONSULTOR EMPRESARIAL para PYMES argentinas.

IMPORTANTE: Análisis CUANTIFICADO con impacto en $.

Estructura (máx 300 palabras):
1. DIAGNÓSTICO (números vs benchmarks)
2. PLAN (5 acciones estratégicas)
3. MÉTRICA (ROI esperado)
4. PRÓXIMO PASO

Pedí siempre: Facturación anual, costos, margen, equipo, desafíos.

Ejemplo:
"DIAGNÓSTICO: $50M facturación, 6% margen (debería ser 12%). Oportunidades: costos operativos altos, procesos manuales.

PLAN:
Q1: Renegociá contratos proveedores principales
Q2: Automatizá procesos (ERP + CRM)
Q3: Reorganizá estructura, eliminá redundancias
Q4: Analizá portfolio, cortá línea no rentable

MÉTRICA:
Q1: -$2M/año en costos
Q2: -$3M/año (eficiencia)
Q3: -$2.5M/año (equipo)
Q4: +$5M/año (nueva línea)
TOTAL: +$12.5M resultado (6%→18% margen)

PRÓXIMO PASO: Auditoría de costos en 15 días"`;
  }
  return "";
};

const getInitialMessage = (mode: Mode): string => {
  if (mode === "1") {
    return `¡Hola! 🚀 Soy tu mentor de validación.

Cuéntame:
1. ¿Qué problema resuelve tu idea?
2. ¿Quién lo tiene? (cliente ideal)
3. ¿Ya hablaste con clientes?

O usá los botones abajo para empezar.`;
  } else if (mode === "2") {
    return `¡Hola! 💪 Soy tu mentor de escalamiento.

Para recomendaciones específicas, necesito:
1. ¿Cuál es tu facturación mensual (MRR)?
2. ¿Principal desafío: ventas, operaciones, equipo o margen?
3. ¿Cuántas personas en tu equipo?

Con eso armamos un plan.`;
  } else if (mode === "3") {
    return `¡Hola! 📊 Soy tu consultor empresarial.

Para un análisis personalizado:
1. ¿Facturación anual aproximada?
2. ¿Margen neto actual?
3. ¿Principal desafío: rentabilidad, crecimiento, eficiencia o equipo?

Con esos datos diseñamos estrategia con impacto cuantificado.`;
  }
  return "";
};

const getQuickActions = (mode: Mode): string[] => {
  if (mode === "1") {
    return ["¿Es viable mi idea?", "Cómo validar supuestos", "Plan de MVP", "Encontrar primeros clientes"];
  } else if (mode === "2") {
    return [
      "Cómo escalar ventas",
      "Optimizar costos",
      "Armar equipo",
      "Métricas clave",
      "Estrategia inversión",
    ];
  } else if (mode === "3") {
    return [
      "Análisis rentabilidad",
      "Plan expansión",
      "Optimizar operaciones",
      "Estrategia competitiva",
      "Gestión equipos",
    ];
  }
  return [];
};

// ══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
const BusinessAIBot = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (currentMode) {
      setMessages([
        {
          role: "assistant",
          content: getInitialMessage(currentMode),
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [currentMode]);

  // ══════════════════════════════════════════════════════════════════════
  // API CALL OPTIMIZADO - Con mejor error handling
  // ══════════════════════════════════════════════════════════════════════
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const systemPrompt = getSystemPrompt(currentMode);

      // Llamada a la función Edge de Supabase
      const { data, error } = await supabase.functions.invoke("claude-chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: userMessage },
          ],
        },
      });

      if (error) throw error;

      // Extraer respuesta
      const response = data?.response || data?.content || "Lo siento, no pude procesar tu mensaje. Intentá de nuevo.";
      
      return response;
    } catch (error) {
      console.error("Error en AI:", error);
      return "Hubo un error al conectar con la IA. Por favor intentá nuevamente en unos segundos.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const aiResponse = await generateAIResponse(inputValue);

    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: action,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const aiResponse = await generateAIResponse(action);

    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  // ══════════════════════════════════════════════════════════════════════
  // SELECTOR DE ETAPA (cuando no hay mode seleccionado)
  // ══════════════════════════════════════════════════════════════════════
  if (!currentMode) {
    const handleNavigate = async (path: string) => {
      if (isNavigating) return; // Prevenir doble click
      setIsNavigating(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Animación
      navigate(path);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingOrbs />
        <FloatingParticles />
        
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Tu Asesor IA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Empresarial</span>
            </h1>
            <p className="text-white/80 text-xl">
              Elegí tu etapa y recibí recomendaciones personalizadas
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* EMPRENDEDOR */}
            <motion.button
              onClick={() => handleNavigate("/demo/idea-capture")}
              disabled={isNavigating}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emprendedor</h3>
              <p className="text-white/60 text-sm mb-4">0-1 año</p>
              <p className="text-white/80 mb-4">Tenés una idea con potencial</p>
              <div className="space-y-2 text-left text-sm text-white/70">
                <p>• Validación de mercado</p>
                <p>• MVP y Product-Market Fit</p>
              </div>
            </motion.button>

            {/* NEGOCIO */}
            <motion.button
              onClick={() => handleNavigate("/demo/business-dashboard")}
              disabled={isNavigating}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 relative disabled:opacity-50"
            >
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-black">
                MÁS USADO
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Negocio</h3>
              <p className="text-white/60 text-sm mb-4">1-3 años</p>
              <p className="text-white/80 mb-4">Tu negocio está validado y creciendo</p>
              <div className="space-y-2 text-left text-sm text-white/70">
                <p>• Escalamiento de ventas</p>
                <p>• Optimización operacional</p>
              </div>
            </motion.button>

            {/* EMPRESA */}
            <motion.button
              onClick={() => handleNavigate("/demo/company-dashboard")}
              disabled={isNavigating}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Empresa</h3>
              <p className="text-white/60 text-sm mb-4">3+ años</p>
              <p className="text-white/80 mb-4">Empresa PYME con operaciones</p>
              <div className="space-y-2 text-left text-sm text-white/70">
                <p>• Estrategia empresarial</p>
                <p>• Rentabilidad y expansión</p>
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          <div className="text-center text-white/60 text-sm">
            <p>Powered by Claude AI • Proyecto Emprendedurismo</p>
          </div>
        </div>
      </div>
    );
  }

  const modeConfig = {
    "1": {
      gradient: "from-blue-500 to-blue-600",
      icon: Zap,
      title: "Emprendedor",
      subtitle: "0-1 año",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      messageColor: "bg-blue-500",
      hoverBg: "hover:bg-blue-100",
    },
    "2": {
      gradient: "from-cyan-500 to-cyan-600",
      icon: TrendingUp,
      title: "Negocio",
      subtitle: "1-3 años",
      borderColor: "border-cyan-200",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      messageColor: "bg-cyan-500",
      hoverBg: "hover:bg-cyan-100",
    },
    "3": {
      gradient: "from-green-500 to-green-600",
      icon: Building2,
      title: "Empresa",
      subtitle: "3+ años",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      messageColor: "bg-green-500",
      hoverBg: "hover:bg-green-100",
    },
  };

  const config = modeConfig[currentMode];
  const Icon = config.icon;

  // ══════════════════════════════════════════════════════════════════════
  // MODE 1 - Chat Interface Optimizada
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} p-4 shadow-lg flex items-center justify-between text-white`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{config.title}</h1>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentMode(null)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-2xl p-4 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? `${config.messageColor} text-white`
                  : `bg-white border-2 ${config.borderColor}`
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-2 ${msg.role === "user" ? "opacity-70" : "opacity-50"}`}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-2xl p-4 rounded-2xl bg-white border-2 ${config.borderColor} shadow-md`}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <span className="ml-2 text-slate-600 text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && !isLoading && (
        <div className="bg-white border-t-2 border-slate-200 p-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-bold text-slate-700">Preguntas sugeridas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getQuickActions(currentMode).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className={`text-left p-3 rounded-xl border-2 ${config.borderColor} ${config.bgColor} ${config.textColor} font-medium text-sm flex items-start gap-3 hover:scale-105 transition-transform shadow-sm ${config.hoverBg}`}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t-2 border-slate-200 p-4 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${config.messageColor} text-white px-6 py-3 rounded-xl hover:opacity-90 disabled:bg-slate-400 font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105`}
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
