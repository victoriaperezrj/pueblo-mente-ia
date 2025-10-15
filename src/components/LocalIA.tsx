import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LocalIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 ¡Hola! Soy LocalIA, tu copiloto emprendedor. Estoy aquí para ayudarte con validación de ideas, simulaciones financieras, trámites AFIP y estrategias de crecimiento. ¿Por dónde empezamos?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  const quickQuestions = [
    '¿Cómo valido mi idea?',
    '¿Qué trámites necesito?',
    '¿Cómo calculo rentabilidad?',
    '¿Qué impuestos pago?'
  ];

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // GROK Style: Delay intencional para simular pensamiento
    // 200ms delay antes de mostrar "escribiendo..."
    setTimeout(() => {
      setShowTypingIndicator(true);
    }, 200);

    // Duración "escribiendo..." aleatoria 800-1200ms
    const typingDuration = Math.floor(Math.random() * 400) + 800;

    // Después de tipear, esperar 500ms más antes de mostrar mensaje
    setTimeout(() => {
      setShowTypingIndicator(false);
      setTimeout(() => {
        const response = generateResponse(userMessage.content);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsTyping(false);
      }, 500);
    }, 200 + typingDuration);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Jerga Argentina
    const normalizedQuery = lowerQuery
      .replace(/guita|plata/g, 'dinero')
      .replace(/laburo|trabajo/g, 'negocio')
      .replace(/quilombo/g, 'problema')
      .replace(/morfar/g, 'vender');
    
    if (normalizedQuery.includes('validar') || normalizedQuery.includes('idea') || normalizedQuery.includes('tengo una idea')) {
      return '💡 Validar tu idea es el primer paso crítico. Te recomiendo:\n\n1. **Lean Canvas interactivo**: Estructura tu propuesta en 9 bloques clave\n2. **Análisis de mercado**: Identifica competidores y oportunidades\n3. **Test MVP**: Valida con clientes reales antes de invertir\n\n¿Quieres que te guíe en el Lean Canvas?';
    }
    
    if (normalizedQuery.includes('trámite') || normalizedQuery.includes('afip') || normalizedQuery.includes('legal')) {
      return '📋 **Trámites esenciales en Argentina:**\n\n1. **AFIP**: Inscripción CUIT/CUIL + Monotributo\n2. **IIBB**: Alta en Ingresos Brutos (provincial)\n3. **Habilitación**: Permiso municipal según rubro\n\nTenemos un checklist completo con links y plazos. ¿Te lo muestro?';
    }
    
    if (normalizedQuery.includes('rentabilidad') || normalizedQuery.includes('financ') || normalizedQuery.includes('número') || normalizedQuery.includes('dinero')) {
      return '📊 **Simulador Financiero con datos argentinos:**\n\n✅ Costos fijos y variables\n✅ Punto de equilibrio\n✅ Proyección con inflación real\n✅ Cálculo de impuestos (Monotributo/Responsable Inscripto)\n\n¿Arrancamos con tu simulación?';
    }
    
    if (normalizedQuery.includes('impuesto') || normalizedQuery.includes('monotributo')) {
      return '💰 **Régimen impositivo para emprendedores:**\n\n• **Monotributo**: Ideal para facturación <$68M anuales. Cuota fija incluye:\n  - Impuestos (IVA + Ganancias)\n  - Obra social\n  - Jubilación\n\n• **Responsable Inscripto**: Para mayores ingresos\n\nEl simulador te ayuda a elegir la categoría óptima. ¿Lo probamos?';
    }

    if (normalizedQuery.includes('cliente') || normalizedQuery.includes('venta') || normalizedQuery.includes('vender') || normalizedQuery.includes('crm')) {
      return '🤝 **Gestión de clientes y ventas:**\n\n• CRM integrado para seguimiento\n• Historial de compras y preferencias\n• Automatización de seguimiento\n• Facturación AFIP directa\n\n¿Necesitas ayuda para organizar tu cartera?';
    }

    if (normalizedQuery.includes('equipo') || normalizedQuery.includes('automatiz') || normalizedQuery.includes('escal') || normalizedQuery.includes('empresa')) {
      return '🚀 **Escalamiento y automatización:**\n\n• Gestión de equipo multi-rol\n• Workflows automatizados\n• Multi-sucursal (si aplica)\n• Reportes ejecutivos en tiempo real\n\nEstas herramientas están en la etapa PyME. ¿Llegaste a ese nivel?';
    }

    if (normalizedQuery.includes('negocio') || normalizedQuery.includes('ya vendo')) {
      return '📈 **Perfecto, ya tenés un negocio funcionando!**\n\nTe recomiendo la etapa **Negocio** donde podés:\n• Ordenar finanzas con dashboard en tiempo real\n• Gestionar clientes con CRM simple\n• Controlar gastos y facturación AFIP\n\n¿Te gustaría explorar estas herramientas?';
    }

    if (normalizedQuery.includes('precio') || normalizedQuery.includes('costo') || normalizedQuery.includes('cuánto cuesta')) {
      return '💵 **Sobre precios:**\n\n• **Emprendedor**: Gratis para empezar, sin tarjeta\n• **Negocio**: Plan accesible con todas las herramientas\n• **PyME**: Personalizado según tus necesidades\n\nTodos los planes tienen prueba gratuita. ¿Querés arrancar?';
    }

    if (normalizedQuery.includes('demo') || normalizedQuery.includes('cómo es') || normalizedQuery.includes('cómo funciona')) {
      return '🎯 **¿Querés ver cómo funciona?**\n\nTenemos un demo interactivo donde podés:\n• Probar el Lean Canvas\n• Usar el simulador financiero\n• Ver análisis con IA\n\n¿Te guío al demo?';
    }
    
    return '🤔 Entiendo tu consulta. Puedo ayudarte con:\n\n• 💡 Validación de ideas\n• 📊 Finanzas y simulaciones\n• 📋 Trámites AFIP\n• 🤝 Gestión de clientes\n• 🚀 Escalamiento\n\n¿Sobre cuál tema querés profundizar? También podés preguntarme en criollo, entiendo jerga argentina 😉';
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setShowTypingIndicator(true);
    }, 200);

    const typingDuration = Math.floor(Math.random() * 400) + 800;

    setTimeout(() => {
      setShowTypingIndicator(false);
      setTimeout(() => {
        const response = generateResponse(question);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsTyping(false);
      }, 500);
    }, 200 + typingDuration);
  };

  return (
    <>
      {/* Floating Button - Azul profesional GROK style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full",
            "bg-primary shadow-2xl",
            "text-white",
            "flex items-center justify-center",
            "hover:scale-110 transition-all duration-300 ease-out",
            "animate-glow-pulse"
          )}
          aria-label="Abrir LocalIA"
        >
          <Sparkles className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window - GROK Style */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-full max-w-md h-[600px] max-h-[80vh]",
            "mx-4 sm:mx-0 sm:w-[380px]",
            "flex flex-col",
            "shadow-2xl border border-border/50",
            "animate-scale-in overflow-hidden rounded-xl",
            isMinimized && "h-16"
          )}
        >
          {/* Header - Azul profesional */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              {!isMinimized && (
                <div>
                  <h3 className="font-semibold text-base">Asistente Proyecto</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    Emprendedurismo
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/10 transition-all"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3 animate-fade-in",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-xl px-4 py-3 shadow-sm",
                        msg.role === 'user'
                          ? "bg-primary text-white"
                          : "bg-card border border-border text-foreground"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* GROK Style Typing Indicator */}
                {showTypingIndicator && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-card border border-border rounded-xl px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted-foreground mr-2">escribiendo</span>
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Preguntas frecuentes:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-3 py-2 bg-card border border-border rounded-lg hover:bg-primary/10 hover:border-primary transition-all duration-200 text-left hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isTyping}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input - GROK Style */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    disabled={isTyping}
                    className="flex-1 px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-background transition-all duration-200 disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="bg-primary hover:bg-primary-hover text-white px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}