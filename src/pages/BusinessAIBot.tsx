import { useState, useRef, useEffect } from "react";
import { Zap, TrendingUp, Building2, Menu, Send, Lightbulb, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import NegocioInterface from "@/components/business-bot/NegocioInterface";
import EmpresaInterface from "@/components/business-bot/EmpresaInterface";
import AnimatedBackground from "@/components/business-bot/AnimatedBackground";
import FloatingBot from "@/components/business-bot/FloatingBot";

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

      const { data, error } = await supabase.functions.invoke("claude-chat", {
        body: {
          messages: [...conversationHistory, { role: "user", content: userMessage }],
          systemPrompt: getSystemPrompt(currentMode),
        },
      });

      if (error) throw error;

      const aiResponse = data?.response || "Lo siento, hubo un error. Intenta de nuevo.";
      
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);
      
      setIsLoading(false);
      return aiResponse;
    } catch (err) {
      console.error("Error calling AI:", err);
      const errorMessage = "Lo siento, hubo un problema al conectar con el asistente. Por favor intenta nuevamente.";
      
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
      
      setIsLoading(false);
      return errorMessage;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    await generateAIResponse(userMessage);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  // PANTALLA DE SELECCIÓN DE MODO
  if (!currentMode) {
    return (
      <div className="min-h-screen aurora-waves-background relative overflow-hidden">
        <AnimatedBackground />
        <FloatingBot />

        <div className="content-wrapper container mx-auto px-4 py-12">
          {/* Header con efecto glassmorphism y animaciones */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="text-white font-semibold">IA que entiende Argentina</span>
            </motion.div>
            
            <motion.h1
              className="hero-title-grok mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tu Asesor IA{" "}
              <span className="highlight">Empresarial</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-white/90 mb-3 max-w-2xl mx-auto font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Respuestas concretas para cada etapa
            </motion.p>
            
            <motion.p
              className="text-white/60 max-w-xl mx-auto text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Selecciona tu etapa para recibir estrategias personalizadas
            </motion.p>
          </motion.div>

          {/* Cards con claymorphism mejorado y efectos elegantes */}
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* CARD 1 - AZUL */}
            <motion.div
              className="clay-card-grok group cursor-pointer noise-texture"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -20,
                scale: 1.03,
                rotateX: 5,
                rotateY: 3,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentMode("1")}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition duration-700"
                />
                <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-10 rounded-3xl text-white shadow-2xl">
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Zap className="w-10 h-10" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-extrabold text-center mb-3 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Idea Validada
                  </motion.h2>
                  <p className="text-center text-blue-100 font-semibold mb-5 text-lg">0-1 año</p>
                  <p className="text-center text-white/95 mb-8 leading-relaxed text-base">
                    Tienes una idea con potencial
                  </p>
                  <div className="text-sm space-y-3 opacity-95 mb-6">
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Validación de mercado
                    </motion.p>
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      MVP y Product-Market Fit
                    </motion.p>
                  </div>
                  <motion.div
                    className="mt-8 text-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-3 text-base font-bold">
                      Empezar <span className="text-xl">→</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2 - PÚRPURA */}
            <motion.div
              className="clay-card-grok group cursor-pointer noise-texture"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -20,
                scale: 1.03,
                rotateX: 5,
                rotateY: 3,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentMode("2")}
            >
              <div className="popular-badge">⭐ Más usado</div>
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition duration-700"
                />
                <div className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-10 rounded-3xl text-white shadow-2xl">
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="w-10 h-10" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-extrabold text-center mb-3 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Negocio en Crecimiento
                  </motion.h2>
                  <p className="text-center text-purple-100 font-semibold mb-5 text-lg">1-3 años</p>
                  <p className="text-center text-white/95 mb-8 leading-relaxed text-base">
                    Tu negocio está validado y creciendo
                  </p>
                  <div className="text-sm space-y-3 opacity-95 mb-6">
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Escalamiento de ventas
                    </motion.p>
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Optimización operacional
                    </motion.p>
                  </div>
                  <motion.div
                    className="mt-8 text-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-3 text-base font-bold">
                      Empezar <span className="text-xl">→</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3 - VERDE */}
            <motion.div
              className="clay-card-grok group cursor-pointer noise-texture"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -20,
                scale: 1.03,
                rotateX: 5,
                rotateY: 3,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentMode("3")}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition duration-700"
                />
                <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-10 rounded-3xl text-white shadow-2xl">
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Building2 className="w-10 h-10" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-extrabold text-center mb-3 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    Empresa Establecida
                  </motion.h2>
                  <p className="text-center text-green-100 font-semibold mb-5 text-lg">3+ años</p>
                  <p className="text-center text-white/95 mb-8 leading-relaxed text-base">
                    Empresa PYME o grande con operaciones
                  </p>
                  <div className="text-sm space-y-3 opacity-95 mb-6">
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Estrategia empresarial
                    </motion.p>
                    <motion.p
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Rentabilidad y expansión
                    </motion.p>
                  </div>
                  <motion.div
                    className="mt-8 text-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-3 text-base font-bold">
                      Empezar <span className="text-xl">→</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer elegante con animaciones */}
          <motion.div
            className="text-center mt-20 text-white/40"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              />
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              />
            </div>
            <motion.p
              className="text-sm font-light tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Powered by Claude AI • PuebloHub Pro
            </motion.p>
          </motion.div>
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

  // Render interfaces especiales para Mode 2 y 3
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

  // Mode 1 - Chat interface mejorada
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header mejorado */}
      <div
        className={`bg-gradient-to-r ${config.gradient} p-4 shadow-xl flex items-center justify-between text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-white/20 rounded-xl">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{config.title}</h1>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentMode(null)}
          className="p-2 hover:bg-white/20 rounded-lg transition relative z-10 magnetic-button"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area mejorada */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} scroll-fade-in`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
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
                <span className="ml-2 text-slate-600">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions mejoradas */}
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
                className={`text-left p-4 rounded-xl border-2 ${config.borderColor} ${config.bgColor} ${config.textColor} font-medium text-sm flex items-start gap-3 magnetic-button shadow-sm ${config.hoverBg} transition-all`}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area mejorada */}
      <div className="bg-white border-t-2 border-slate-200 p-4 max-w-4xl mx-auto w-full shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta específica o desafío..."
            disabled={isLoading}
            className="flex-1 border-2 border-slate-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${config.messageColor} text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:bg-slate-400 font-semibold flex items-center gap-2 transition-all magnetic-button shadow-lg`}
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
