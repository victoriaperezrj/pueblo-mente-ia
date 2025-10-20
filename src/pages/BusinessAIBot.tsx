import { useState, useRef, useEffect, useCallback } from "react";
import { Zap, TrendingUp, Building2, Send, Lightbulb, X, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import NegocioInterface from "@/components/business-bot/NegocioInterface";
import EmpresaInterface from "@/components/business-bot/EmpresaInterface";

type Mode = "1" | "2" | "3" | null;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// [Mantener las mismas funciones getSystemPrompt, getInitialMessage, getQuickActions del archivo original]
const getSystemPrompt = (mode: Mode): string => {
  if (mode === "1") {
    return `Eres un MENTOR DE VALIDACIÓN DE IDEAS especializado en startups pre-product.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES, no información genérica.

Estructura tus respuestas así:
1. DIAGNÓSTICO: Identifica el problema específico
2. PLAN DE ACCIÓN: Pasos concretos numerados (máximo 5)
3. MÉTRICA: Cómo medir si funcionó
4. PRÓXIMO PASO: Qué hacer después`;
  } else if (mode === "2") {
    return `Eres un MENTOR DE ESCALAMIENTO especializado en negocios 1-3 años.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES.

Tu objetivo:
- Ayudar a escalar ventas y operaciones
- Optimizar margen y rentabilidad
- Construir equipo
- Decisiones basadas en datos`;
  } else if (mode === "3") {
    return `Eres un CONSULTOR EMPRESARIAL especializado en PYMES y empresas grandes.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS, CUANTIFICADAS Y ACCIONABLES.

Tu objetivo:
- Análisis financiero profundo
- Estrategia de crecimiento rentable
- Optimización operacional
- Decisiones basadas en datos y benchmarks`;
  }
  return "";
};

const getInitialMessage = (mode: Mode): string => {
  if (mode === "1") {
    return `¡Hola emprendedor! Soy tu mentor de validación.

Estoy aquí para ayudarte a validar tu idea de forma rápida y económica.

Cuéntame:
1. ¿Cuál es el problema que resuelves?
2. ¿Quién lo tiene? (describe a tu usuario ideal)
3. ¿Ya hablaste con clientes potenciales?

Mientras tanto, usa los botones abajo para explorar cómo validar tu idea.`;
  } else if (mode === "2") {
    return `¡Hola! 🚀 Soy tu mentor de escalamiento.

Veo que tu negocio está en etapa de crecimiento (1-3 años).

Para darte las mejores recomendaciones específicas, dime:
1. ¿Cuál es tu MRR aproximado?
2. ¿Cuál es tu principal desafío: ventas, operaciones, equipo o margen?
3. ¿Cuántas personas tienes en tu equipo?

Con esa info, diseñaré un plan personalizado para escalar. 💪`;
  } else if (mode === "3") {
    return `¡Hola! 🌱 Soy tu consultor empresarial.

Ayudo a empresas establecidas a:
→ Mejorar rentabilidad y eficiencia
→ Expandir a nuevos mercados
→ Optimizar operaciones
→ Tomar decisiones estratégicas basadas en datos

Para un análisis personalizado, comparte:
1. ¿Cuáles son tus ingresos anuales aproximados?
2. ¿Cuál es tu margen neto actual?
3. ¿Cuál es tu principal desafío: rentabilidad, crecimiento, eficiencia o equipo?

Con esa información, diseñaré un plan estratégico con impacto financiero cuantificado. 📊`;
  }
  return "";
};

const getQuickActions = (mode: Mode): string[] => {
  if (mode === "1") {
    return ["¿Es viable mi idea?", "Cómo validar supuestos", "Plan de MVP", "Encontrar primeros clientes"];
  } else if (mode === "2") {
    return [
      "Cómo escalar ventas",
      "Optimizar costos operacionales",
      "Armar equipo",
      "Métricas que importan",
      "Estrategia de inversión",
    ];
  } else if (mode === "3") {
    return [
      "Análisis de rentabilidad",
      "Plan de expansión",
      "Optimizar operaciones",
      "Estrategia competitiva",
      "Gestión de equipos",
    ];
  }
  return [];
};

const BusinessAIBot = () => {
  const [currentMode, setCurrentMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const generateAIResponse = useCallback(
    async (userMessage: string) => {
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();

      // Agregar mensaje del usuario inmediatamente
      const userMsg: Message = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);
      setError(null);

      try {
        const systemPrompt = getSystemPrompt(currentMode);
        const conversationHistory = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const { data, error: supabaseError } = await supabase.functions.invoke("chat", {
          body: {
            messages: [{ role: "system", content: systemPrompt }, ...conversationHistory],
          },
          signal: abortControllerRef.current.signal,
        });

        if (supabaseError) {
          throw supabaseError;
        }

        if (!data?.choices?.[0]?.message?.content) {
          throw new Error("Respuesta inválida del servidor");
        }

        const botResponse: Message = {
          role: "assistant",
          content: data.choices[0].message.content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Request cancelled");
          return;
        }

        console.error("Error generating response:", err);

        const errorMsg =
          err.message === "Failed to fetch"
            ? "No se pudo conectar con el servidor. Verificá tu conexión."
            : "Hubo un error al procesar tu mensaje. Intentá de nuevo.";

        setError(errorMsg);

        // Agregar mensaje de error al chat
        const errorResponse: Message = {
          role: "assistant",
          content: `❌ ${errorMsg}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [currentMode, messages],
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      generateAIResponse(inputValue.trim());
    }
  };

  const handleQuickAction = (action: string) => {
    if (!isLoading) {
      generateAIResponse(action);
    }
  };

  // Selector de modo mejorado con glassmorphism
  if (!currentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="floating-particle"
            style={{
              left: "10%",
              top: "20%",
              animationDelay: "0s",
              width: "150px",
              height: "150px",
            }}
          ></div>
          <div
            className="floating-particle"
            style={{
              right: "15%",
              top: "60%",
              animationDelay: "2s",
              width: "200px",
              height: "200px",
            }}
          ></div>
        </div>

        <div className="max-w-6xl w-full relative z-10">
          <div className="text-center mb-16 fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 gradient-text-animated">
              ¿En qué etapa está tu negocio?
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Elegí tu etapa para recibir asesoramiento personalizado con IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Emprendedor */}
            <div
              className="tilt-card cursor-pointer scroll-reveal fade-in-up"
              style={{ animationDelay: "0.1s" }}
              onClick={() => setCurrentMode("1")}
            >
              <div className="relative group glassmorphism-card h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">Idea / Emprendedor</h2>
                  <p className="text-center text-blue-100 font-semibold mb-4">0-1 año</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Validá tu idea antes de invertir tiempo y dinero
                  </p>
                  <div className="text-sm space-y-2 opacity-90">
                    <p>• Validación de hipótesis</p>
                    <p>• Plan de MVP mínimo</p>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      Empezar <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Negocio */}
            <div
              className="tilt-card cursor-pointer scroll-reveal fade-in-up"
              style={{ animationDelay: "0.2s" }}
              onClick={() => setCurrentMode("2")}
            >
              <div className="relative group glassmorphism-card h-full scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-xs font-bold text-white shadow-xl pulse-glow">
                  ⭐ Más Popular
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform mt-4">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">Negocio en Crecimiento</h2>
                  <p className="text-center text-purple-100 font-semibold mb-4">1-3 años</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Ya vendés, pero necesitás escalar y profesionalizar
                  </p>
                  <div className="text-sm space-y-2 opacity-90">
                    <p>• Estrategia de escalamiento</p>
                    <p>• Optimización de márgenes</p>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      Empezar <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Empresa */}
            <div
              className="tilt-card cursor-pointer scroll-reveal fade-in-up"
              style={{ animationDelay: "0.3s" }}
              onClick={() => setCurrentMode("3")}
            >
              <div className="relative group glassmorphism-card h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">Empresa Establecida</h2>
                  <p className="text-center text-green-100 font-semibold mb-4">3+ años</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Empresa PYME o grande con operaciones consolidadas
                  </p>
                  <div className="text-sm space-y-2 opacity-90">
                    <p>• Estrategia empresarial</p>
                    <p>• Rentabilidad y expansión</p>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      Empezar <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 text-gray-400 fade-in-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm">Powered by Claude AI • PuebloHub Pro</p>
          </div>
        </div>
      </div>
    );
  }

  const modeConfig = {
    "1": {
      gradient: "from-blue-500 to-blue-600",
      icon: Zap,
      title: "Idea Validada",
      subtitle: "0-1 año",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      messageColor: "bg-blue-500",
      hoverBg: "hover:bg-blue-100",
    },
    "2": {
      gradient: "from-purple-500 to-purple-600",
      icon: TrendingUp,
      title: "Negocio en Crecimiento",
      subtitle: "1-3 años",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      messageColor: "bg-purple-500",
      hoverBg: "hover:bg-purple-100",
    },
    "3": {
      gradient: "from-green-500 to-green-600",
      icon: Building2,
      title: "Empresa Establecida",
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

  // Interfaces especiales para Mode 2 y 3
  if (currentMode === "2") {
    return (
      <NegocioInterface
        onBack={() => setCurrentMode(null)}
        onSendMessage={generateAIResponse}
        messages={messages}
        isLoading={isLoading}
      />
    );
  }

  if (currentMode === "3") {
    return (
      <EmpresaInterface
        onBack={() => setCurrentMode(null)}
        onSendMessage={generateAIResponse}
        messages={messages}
        isLoading={isLoading}
      />
    );
  }

  // Mode 1 - Chat interface mejorada con glassmorphism
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header glassmorphism */}
      <div className={`glassmorphism-nav p-4 shadow-xl flex items-center justify-between relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-90`}></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-white/30 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{config.title}</h1>
            <p className="text-sm text-white/90">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentMode(null)}
          className="p-2 hover:bg-white/20 rounded-lg transition relative z-10 magnetic-button"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Chat Area con scroll-reveal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={`max-w-2xl p-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] ${
                msg.role === "user" ? `${config.messageColor} text-white` : `glassmorphism-card ${config.borderColor}`
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-2 ${msg.role === "user" ? "opacity-70" : "opacity-50"}`}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Loading mejorado con skeleton */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-2xl p-4 rounded-2xl glassmorphism-card ${config.borderColor} shadow-lg`}>
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="ml-2 text-slate-600">Procesando tu consulta...</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="skeleton-loader h-3 rounded w-3/4"></div>
                <div className="skeleton-loader h-3 rounded w-full"></div>
                <div className="skeleton-loader h-3 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="max-w-2xl p-4 rounded-2xl bg-red-50 border-2 border-red-200 shadow-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions glassmorphism */}
      {messages.length <= 1 && !isLoading && (
        <div className="glassmorphism-nav border-t-2 border-slate-200 p-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-bold text-slate-700">Preguntas sugeridas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getQuickActions(currentMode).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className={`text-left p-4 rounded-xl glassmorphism-card ${config.borderColor} ${config.textColor} font-medium text-sm flex items-start gap-3 magnetic-button transition-all`}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area glassmorphism */}
      <div className="glassmorphism-nav border-t-2 border-slate-200 p-4 max-w-4xl mx-auto w-full shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta específica o desafío..."
            disabled={isLoading}
            className="flex-1 border-2 border-slate-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all backdrop-blur-sm bg-white/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${config.messageColor} text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:bg-slate-400 disabled:cursor-not-allowed font-semibold flex items-center gap-2 transition-all magnetic-button shadow-lg`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessAIBot;
