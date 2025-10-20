import { useState, useRef, useEffect } from "react";
import { Zap, TrendingUp, Building2, Send, Lightbulb, X, Sparkles } from "lucide-react";
// 🛑 IMPORTANTE: REVISA ESTAS TRES RUTAS 🛑
// Asegúrate de que las rutas a Supabase, NegocioInterface y EmpresaInterface sean correctas en tu proyecto.
import { supabase } from "@/integrations/supabase/client"; // RUTA PROBABLEMENTE CORRECTA
import NegocioInterface from "@/components/business-bot/NegocioInterface"; // AJUSTA ESTA RUTA SI FALLA
import EmpresaInterface from "@/components/business-bot/EmpresaInterface"; // AJUSTA ESTA RUTA SI FALLA

type Mode = "1" | "2" | "3" | null;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const getSystemPrompt = (mode: Mode): string => {
  if (mode === "1") {
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
  } else if (mode === "2") {
    return `Eres un MENTOR DE ESCALAMIENTO especializado en negocios 1-3 años.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS Y ACCIONABLES.

Tu objetivo:
- Ayudar a escalar ventas y operaciones
- Optimizar margen y rentabilidad
- Construir equipo
- Decisiones basadas en datos

Estructura respuestas:
1. DIAGNÓSTICO (basado en datos usuario: MRR, margen, equipo)
2. PLAN DE ACCIÓN (máx 4 pasos específicos)
3. MÉTRICA (impacto esperado: +X% revenue, -Y% costos, etc)
4. PRÓXIMO PASO

IMPORTANTE: Pide DATOS ESPECÍFICOS antes de aconsejar.
Si usuario no da: MRR, margen, equipo → PREGUNTA primero.
Solo después responde con números concretos.

Ejemplo CORRECTO:
'DIAGNÓSTICO: Tu MRR $10k con margen 40% es viable para escalar. Principal bottleneck: ventas (solo 1 persona).

PLAN:
1) Mes 1: Contrata 1 sales person full-time ($2k/mes)
2) Mes 1-2: Implementa CRM (Pipedrive o HubSpot)
3) Mes 2: Invierte $3k en ads en tu canal mejor
4) Mes 3: Mide resultados

MÉTRICA: Objetivo +50% clientes nuevos en 3 meses (MRR $15k)

PRÓXIMO PASO: Si se cumple, duplica inversión en mes 4'`;
  } else if (mode === "3") {
    return `Eres un CONSULTOR EMPRESARIAL especializado en PYMES y empresas grandes.

IMPORTANTE: Debes dar RESPUESTAS CONCRETAS, CUANTIFICADAS Y ACCIONABLES.

Tu objetivo:
- Análisis financiero profundo
- Estrategia de crecimiento rentable
- Optimización operacional
- Decisiones basadas en datos y benchmarks

Estructura respuestas:
1. DIAGNÓSTICO (análisis números, comparación vs industria)
2. PLAN DE ACCIÓN (máx 5 acciones estratégicas con timeline)
3. MÉTRICA (impacto financiero esperado en $, %, ROI)
4. PRÓXIMO PASO (implementación inmediata)

IMPORTANTE: Siempre PIDE DATOS ESPECÍFICOS:
- Ingresos anuales
- Costos totales y desglose
- Margen neto actual
- Estructura de equipo
- Principales desafíos

SOLO DESPUÉS responde con análisis cuantificado.

Ejemplo CORRECTO:
'DIAGNÓSTICO: Tu empresa $2M ingresos, 8% margen (debería ser 12-15%). Top 3 oportunidades: 1) Costos operacionales 20% altos vs industria 2) Estructura equipo redundante 3) Procesos manuales.

PLAN:
Trimestre 1: Audita y renegocia contratos proveedores
Trimestre 2: Automatiza procesos manuales (CRM, contabilidad)
Trimestre 3: Reorganiza equipo, elimina redundancias
Trimestre 4: Analiza portfolio, descontinúa línea de baja rentabilidad

MÉTRICA:
- Trimestre 1: Ahorros $40k/año (-$3.3k/mes)
- Trimestre 2: Ahorros $60k/año (efficiencia)
- Trimestre 3: Ahorros $50k/año (equipos)
- Trimestre 4: Ingresos +$100k (nueva línea)
TOTAL AÑO: +$250k en resultado (margen 8%→20%)

PRÓXIMO PASO: Implementar auditoría de costos en Trimestre 1, designar owner de proyecto'`;
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
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // NOTA: Asegúrate que 'claude-chat' en Supabase Functions esté configurado correctamente.
      const { data, error } = await supabase.functions.invoke("claude-chat", {
        body: {
          messages: [...conversationHistory, { role: "user", content: userMessage }],
          systemPrompt: getSystemPrompt(currentMode),
        },
      });

      if (error) throw error;

      const aiResponse = data?.response || "Lo siento, hubo un error. Intenta de nuevo.";

      if (currentMode === "1") {
        // En el modo 1, el componente padre actualiza los mensajes
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
          },
        ]);
      }

      // Para los modos 2 y 3, la interfaz hija recibe el string y actualiza su propio estado.
      return aiResponse;
    } catch (err) {
      console.error("Error calling AI:", err);

      const errorMessage = "Lo siento, hubo un problema al conectar con el asistente. Por favor intenta nuevamente.";

      if (currentMode === "1") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMessage,
            timestamp: new Date(),
          },
        ]);
      }

      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    // La función generateAIResponse ya actualiza el estado 'messages' si currentMode === '1'
    await generateAIResponse(userMessage);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    // Nota: Esto solo setea el valor en el input. El usuario debe presionar "Enviar".
  };

  // PANTALLA DE SELECCIÓN DE MODO (Rediseñada con fondo espacial y tarjetas Grok-like)
  if (!currentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-950 to-indigo-950 relative overflow-hidden">
        {/* Degradados/partículas animados de fondo - Requiere el CSS en globals.css */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob-slow delay-1s"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-blob-slow delay-2s"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-16 scroll-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 group hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:animate-spin-slow" />
              <span className="text-white font-semibold text-lg">IA que entiende Argentina</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Tu Asesor IA{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-shift">
                Empresarial
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto font-light">
              Respuestas concretas y accionables para cada etapa de tu negocio.
            </p>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Selecciona el momento actual de tu proyecto para recibir un mentor especializado.
            </p>
          </div>

          {/* Cards con estilo Grok-like */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* CARD 1 - Idea Validada */}
            <div
              className="grok-card scroll-fade-in group cursor-pointer"
              style={{ animationDelay: "0.1s" }}
              onClick={() => setCurrentMode("1")}
            >
              <div className="grok-card-inner bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl relative overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/15 rounded-full mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">Idea Validada</h2>
                  <p className="text-center text-blue-200 font-semibold mb-4 text-lg">0-1 año</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Tienes una idea con potencial que necesita ser probada en el mercado real.
                  </p>
                  <div className="text-base space-y-2 opacity-90 border-t border-white/20 pt-4 mt-4">
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> Validación de mercado
                    </p>
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> MVP y Product-Market Fit
                    </p>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-xl font-semibold bg-white/10 px-6 py-3 rounded-full group-hover:bg-white/20 transition-all">
                      Empezar <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 - Negocio en Crecimiento */}
            <div
              className="grok-card scroll-fade-in group cursor-pointer"
              style={{ animationDelay: "0.2s" }}
              onClick={() => setCurrentMode("2")}
            >
              <div className="popular-badge">⭐ Más usado</div>
              <div className="grok-card-inner bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white p-8 rounded-3xl relative overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/15 rounded-full mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">Negocio en Crecimiento</h2>
                  <p className="text-center text-purple-200 font-semibold mb-4 text-lg">1-3 años</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Tu negocio ya está validado y es momento de acelerar su crecimiento y expansión.
                  </p>
                  <div className="text-base space-y-2 opacity-90 border-t border-white/20 pt-4 mt-4">
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> Escalamiento de ventas
                    </p>
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> Optimización operacional
                    </p>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-xl font-semibold bg-white/10 px-6 py-3 rounded-full group-hover:bg-white/20 transition-all">
                      Empezar <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3 - Empresa Establecida */}
            <div
              className="grok-card scroll-fade-in group cursor-pointer"
              style={{ animationDelay: "0.3s" }}
              onClick={() => setCurrentMode("3")}
            >
              <div className="grok-card-inner bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-3xl relative overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/15 rounded-full mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">Empresa Establecida</h2>
                  <p className="text-center text-emerald-200 font-semibold mb-4 text-lg">3+ años</p>
                  <p className="text-center text-white/90 mb-6 leading-relaxed">
                    Empresas con operaciones sólidas que buscan optimización, expansión y mayor rentabilidad.
                  </p>
                  <div className="text-base space-y-2 opacity-90 border-t border-white/20 pt-4 mt-4">
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> Estrategia empresarial
                    </p>
                    <p className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" /> Rentabilidad y expansión
                    </p>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-xl font-semibold bg-white/10 px-6 py-3 rounded-full group-hover:bg-white/20 transition-all">
                      Empezar <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-20 text-gray-500">
            <p className="text-sm">Powered by Claude AI • PuebloHub Pro</p>
          </div>
        </div>
      </div>
    );
  }

  // Configuración para el chat (Modo 1, y colores para Modos 2/3 si usaran esta UI)
  const modeConfig = {
    "1": {
      gradient: "from-blue-600 to-indigo-700",
      icon: Zap,
      title: "Idea Validada",
      subtitle: "Mentor de Validación",
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      messageColor: "bg-blue-600",
      hoverBg: "hover:bg-blue-100",
      focusRing: "focus:ring-blue-500",
    },
    "2": {
      // Configuración para el componente NegocioInterface
      gradient: "from-purple-600 to-fuchsia-700",
      icon: TrendingUp,
      title: "Negocio en Crecimiento",
      subtitle: "Mentor de Escalamiento",
      borderColor: "border-purple-400",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      messageColor: "bg-purple-600",
      hoverBg: "hover:bg-purple-100",
      focusRing: "focus:ring-purple-500",
    },
    "3": {
      // Configuración para el componente EmpresaInterface
      gradient: "from-emerald-600 to-teal-700",
      icon: Building2,
      title: "Empresa Establecida",
      subtitle: "Consultor Empresarial",
      borderColor: "border-emerald-400",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      messageColor: "bg-emerald-600",
      hoverBg: "hover:bg-emerald-100",
      focusRing: "focus:ring-emerald-500",
    },
  };

  const config = modeConfig[currentMode];
  const Icon = config.icon;

  // Render interfaces especiales para Mode 2 y 3 (delegando la UI de chat)
  if (currentMode === "2") {
    return (
      <NegocioInterface
        onBack={() => setCurrentMode(null)}
        onSendMessage={generateAIResponse} // Pasa la función de envío de mensaje del bot
        // El componente NegocioInterface debe manejar su propio estado de mensajes
      />
    );
  }

  if (currentMode === "3") {
    return (
      <EmpresaInterface
        onBack={() => setCurrentMode(null)}
        onSendMessage={generateAIResponse} // Pasa la función de envío de mensaje del bot
        // El componente EmpresaInterface debe manejar su propio estado de mensajes
      />
    );
  }

  // Mode 1 - Chat interface mejorada (cuando currentMode === "1")
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Header mejorado */}
      <div
        className={`bg-gradient-to-r ${config.gradient} p-4 shadow-2xl flex items-center justify-between text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl shadow-inner">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{config.title}</h1>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentMode(null)}
          className="p-2 hover:bg-white/20 rounded-lg transition relative z-10 magnetic-button"
          aria-label="Volver a la selección de modo"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area mejorada */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} chat-message-bubble`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={`max-w-xl p-4 rounded-3xl shadow-lg ${
                msg.role === "user"
                  ? `${config.messageColor} text-white self-end`
                  : `bg-slate-700 border border-slate-600 text-slate-100 self-start`
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-2 ${msg.role === "user" ? "opacity-70" : "text-slate-300 opacity-80"}`}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-xs p-4 rounded-3xl bg-slate-700 border border-slate-600 shadow-lg`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="ml-2 text-slate-400">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions mejoradas */}
      {messages.length <= 1 && !isLoading && (
        <div className="bg-slate-800 border-t border-slate-700 p-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <p className="text-sm font-bold text-slate-200">Preguntas sugeridas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getQuickActions(currentMode).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className={`text-left p-4 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 font-medium text-sm flex items-start gap-3 magnetic-button shadow-md hover:bg-slate-600 transition-all ${config.focusRing}`}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-300" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area mejorada */}
      <div className="bg-slate-800 border-t border-slate-700 p-4 max-w-4xl mx-auto w-full shadow-inner">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta específica o desafío..."
            disabled={isLoading}
            className={`flex-1 border border-slate-600 bg-slate-700 text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 ${config.focusRing} focus:border-transparent disabled:opacity-50 transition-all placeholder-slate-400`}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${config.messageColor} text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:bg-slate-600 font-semibold flex items-center gap-2 transition-all magnetic-button shadow-lg`}
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
