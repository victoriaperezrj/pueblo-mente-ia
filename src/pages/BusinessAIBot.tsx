import { useState, useRef, useEffect } from "react";
import { Zap, TrendingUp, Building2, X, Send, Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Mode = "1" | "2" | "3" | null;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const getSystemPrompt = (mode: Mode): string => {
  if (mode === "1") {
    return `Sos un MENTOR DE VALIDACIÓN DE IDEAS especializado en startups pre-product.

IMPORTANTE: Das RESPUESTAS CONCRETAS Y ACCIONABLES, no información genérica.

Estructura tus respuestas así:
1. DIAGNÓSTICO: Identifica el problema específico
2. PLAN DE ACCIÓN: Pasos concretos numerados (máximo 5)
3. MÉTRICA: Cómo medir si funcionó
4. PRÓXIMO PASO: Qué hacer después

Tu objetivo: ayudar a validar ideas de forma rápida y económica.`;
  } else if (mode === "2") {
    return `Sos un MENTOR DE ESCALAMIENTO especializado en negocios 1-3 años.

IMPORTANTE: Das RESPUESTAS CONCRETAS Y ACCIONABLES.

Tu objetivo: ayudar a escalar ventas, optimizar margen, construir equipo y decisiones basadas en datos.`;
  } else if (mode === "3") {
    return `Sos un CONSULTOR EMPRESARIAL especializado en PYMES y empresas grandes.

IMPORTANTE: Das RESPUESTAS CONCRETAS, CUANTIFICADAS Y ACCIONABLES.

Tu objetivo: análisis financiero, estrategia de crecimiento, optimización operacional.`;
  }
  return "";
};

const getInitialMessage = (mode: Mode): string => {
  if (mode === "1") {
    return `¡Hola! Soy tu mentor de validación 🚀

Estoy acá para ayudarte a validar tu idea de forma rápida y económica.

Contame:
1. ¿Cuál es el problema que resuelves?
2. ¿Quién lo tiene?
3. ¿Ya hablaste con clientes potenciales?`;
  } else if (mode === "2") {
    return `¡Hola! Soy tu mentor de escalamiento 💪

Veo que tu negocio está creciendo (1-3 años).

Para darte las mejores recomendaciones, decime:
1. ¿Cuál es tu MRR aproximado?
2. ¿Cuál es tu principal desafío?
3. ¿Cuántas personas tenés en tu equipo?`;
  } else if (mode === "3") {
    return `¡Hola! Soy tu consultor empresarial 📊

Ayudo a empresas establecidas a mejorar rentabilidad, expandir y optimizar.

Para un análisis personalizado, compartí:
1. ¿Cuáles son tus ingresos anuales aprox?
2. ¿Cuál es tu margen neto actual?
3. ¿Cuál es tu principal desafío?`;
  }
  return "";
};

const getQuickActions = (mode: Mode): string[] => {
  if (mode === "1") {
    return ["¿Es viable mi idea?", "Cómo validar supuestos", "Plan de MVP", "Encontrar primeros clientes"];
  } else if (mode === "2") {
    return ["Cómo escalar ventas", "Optimizar costos", "Armar equipo", "Métricas clave"];
  } else if (mode === "3") {
    return ["Análisis de rentabilidad", "Plan de expansión", "Optimizar operaciones", "Estrategia competitiva"];
  }
  return [];
};

const BusinessAIBot = () => {
  const [currentMode, setCurrentMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke("claude-chat", {
        body: {
          messages: [...conversationHistory, { role: "user", content: userMessage }],
          systemPrompt: getSystemPrompt(currentMode),
        },
      });

      if (error) throw error;

      return data?.response || "Lo siento, hubo un error. Intentá de nuevo.";
    } catch (err) {
      console.error("Error calling AI:", err);
      return "Lo siento, hubo un problema al conectar con el asistente. Por favor intentá nuevamente.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    const aiResponse = await generateAIResponse(userMessage);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      },
    ]);

    setIsLoading(false);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  // PANTALLA DE SELECCIÓN
  if (!currentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 relative overflow-hidden">
        {/* Overlay para mejor contraste */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold text-sm">Tu Asesor IA Personalizado</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              ¿En qué etapa estás?
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              Seleccioná tu etapa para recibir estrategias personalizadas
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {/* Card 1 - Azul */}
            <div
              onClick={() => setCurrentMode("1")}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Idea Validada</h2>
                <p className="text-blue-600 font-bold mb-4">0-1 año</p>
                <p className="text-gray-600 mb-6 text-sm">Tenés una idea con potencial</p>
                <div className="text-sm text-gray-700 space-y-2 mb-6 text-left">
                  <p>• Validación de mercado</p>
                  <p>• MVP y Product-Market Fit</p>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                  Empezar →
                </button>
              </div>
            </div>

            {/* Card 2 - Púrpura */}
            <div
              onClick={() => setCurrentMode("2")}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                ⭐ Más elegido
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Negocio</h2>
                <p className="text-purple-600 font-bold mb-4">1-3 años</p>
                <p className="text-gray-600 mb-6 text-sm">Tu negocio está creciendo</p>
                <div className="text-sm text-gray-700 space-y-2 mb-6 text-left">
                  <p>• Escalamiento de ventas</p>
                  <p>• Optimización operacional</p>
                </div>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                  Empezar →
                </button>
              </div>
            </div>

            {/* Card 3 - Verde */}
            <div
              onClick={() => setCurrentMode("3")}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Empresa</h2>
                <p className="text-green-600 font-bold mb-4">3+ años</p>
                <p className="text-gray-600 mb-6 text-sm">Empresa PYME establecida</p>
                <div className="text-sm text-gray-700 space-y-2 mb-6 text-left">
                  <p>• Estrategia empresarial</p>
                  <p>• Rentabilidad y expansión</p>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                  Empezar →
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-white/80">
            <p className="text-sm">Powered by Claude AI • Proyecto Emprendedurismo</p>
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
      messageColor: "bg-blue-500",
      borderColor: "border-blue-200",
    },
    "2": {
      gradient: "from-purple-500 to-purple-600",
      icon: TrendingUp,
      title: "Negocio en Crecimiento",
      subtitle: "1-3 años",
      messageColor: "bg-purple-500",
      borderColor: "border-purple-200",
    },
    "3": {
      gradient: "from-green-500 to-green-600",
      icon: Building2,
      title: "Empresa Establecida",
      subtitle: "3+ años",
      messageColor: "bg-green-500",
      borderColor: "border-green-200",
    },
  };

  const config = modeConfig[currentMode];
  const Icon = config.icon;

  // CHAT INTERFACE
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} p-4 shadow-xl flex items-center justify-between text-white`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{config.title}</h1>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>
        </div>
        <button onClick={() => setCurrentMode(null)} className="p-2 hover:bg-white/20 rounded-lg transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl p-4 rounded-2xl shadow-lg ${
                msg.role === "user" ? `${config.messageColor} text-white` : `bg-white border-2 ${config.borderColor}`
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
            <div className={`max-w-2xl p-4 rounded-2xl bg-white border-2 ${config.borderColor} shadow-lg`}>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && !isLoading && (
        <div className="bg-white border-t-2 border-gray-200 p-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-bold text-gray-700">Preguntas sugeridas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getQuickActions(currentMode).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 font-medium text-sm transition-all"
              >
                <span className="text-gray-700">{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-200 p-4 max-w-4xl mx-auto w-full shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="flex-1 border-2 border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${config.messageColor} text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:bg-gray-400 font-semibold flex items-center gap-2 transition-all shadow-lg`}
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
