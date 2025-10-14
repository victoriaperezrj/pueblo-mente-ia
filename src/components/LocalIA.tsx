import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LocalIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy LocalIA, tu asistente inteligente. ¿En qué puedo ayudarte hoy? Puedo ayudarte con validación de ideas, finanzas, trámites AFIP y más.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    '¿Cómo valido mi idea?',
    '¿Qué trámites necesito?',
    '¿Cómo calculo rentabilidad?',
    '¿Qué impuestos pago?'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate IA response (replace with actual API call)
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('validar') || lowerQuery.includes('idea')) {
      return 'Para validar tu idea, te recomiendo completar el Lean Canvas interactivo. Te ayudará a estructurar tu propuesta de valor, identificar segmentos de clientes y analizar la viabilidad. ¿Quieres que te guíe paso a paso?';
    }
    
    if (lowerQuery.includes('trámite') || lowerQuery.includes('afip')) {
      return 'Los trámites iniciales incluyen: 1) Inscripción en AFIP (CUIT/CUIL), 2) Alta en IIBB, 3) Habilitación municipal. El checklist de trámites tiene toda la info detallada. ¿Necesitas ayuda con alguno específico?';
    }
    
    if (lowerQuery.includes('rentabilidad') || lowerQuery.includes('financ')) {
      return 'El simulador financiero te permite calcular costos fijos, variables, punto de equilibrio y proyección de ganancias. Con datos argentinos actualizados (inflación, impuestos). ¿Quieres empezar a simular?';
    }
    
    if (lowerQuery.includes('impuesto') || lowerQuery.includes('monotributo')) {
      return 'Como emprendedor inicial, probablemente te convenga Monotributo. Incluye impuestos + obra social + jubilación en una cuota fija. El simulador te ayuda a elegir la categoría correcta según tus ingresos estimados.';
    }
    
    return 'Entiendo tu consulta. Te recomiendo explorar el Dashboard para acceder a herramientas específicas como Lean Canvas, Simulador Financiero o Checklist de Trámites. ¿Hay algo más específico en lo que pueda ayudarte?';
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-16 h-16 rounded-full",
            "bg-gradient-to-br from-[#6E4AFF] to-[#3D8BFF]",
            "text-white shadow-2xl",
            "flex items-center justify-center",
            "hover:scale-110 transition-all duration-300",
            "animate-float"
          )}
          aria-label="Abrir LocalIA"
        >
          <MessageCircle className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-96 h-[600px] max-h-[80vh]",
            "flex flex-col",
            "shadow-2xl border-2 border-[#6E4AFF]/20",
            "animate-scale-in"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6E4AFF] to-[#3D8BFF] text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">LocalIA</h3>
                <p className="text-xs text-white/80">Asistente inteligente</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6E4AFF] to-[#3D8BFF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3",
                    msg.role === 'user'
                      ? "bg-[#6E4AFF] text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#6E4AFF] to-[#3D8BFF] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-600 mb-2 font-medium">Preguntas frecuentes:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-[#6E4AFF]/10 hover:border-[#6E4AFF] transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6E4AFF]/50 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-[#6E4AFF] to-[#3D8BFF] hover:opacity-90 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
