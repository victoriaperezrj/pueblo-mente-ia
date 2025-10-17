import { useState } from 'react';
import { 
  Building2, DollarSign, TrendingUp, BarChart3, Users, Layers,
  PieChart, Zap, Globe, Package, Cog, Leaf, Menu
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EmpresaInterfaceProps {
  onBack: () => void;
  onSendMessage: (message: string) => Promise<string>;
  messages: Message[];
  isLoading: boolean;
}

const EmpresaInterface = ({ onBack, onSendMessage, messages, isLoading }: EmpresaInterfaceProps) => {
  const [revenue, setRevenue] = useState('');
  const [margin, setMargin] = useState('');
  const [roi, setRoi] = useState('');
  const [employees, setEmployees] = useState('');
  const [businessLines, setBusinessLines] = useState('');
  const [yearlyGrowth, setYearlyGrowth] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const getMarginIndicator = () => {
    const marginNum = parseFloat(margin);
    if (isNaN(marginNum)) return null;
    if (marginNum < 5) return { emoji: '🔴', text: 'Crítico - ¡Acción urgente necesaria!', color: 'text-red-600' };
    if (marginNum <= 10) return { emoji: '🟡', text: 'Bajo - ¡Gran oportunidad de mejora!', color: 'text-yellow-600' };
    return { emoji: '🟢', text: 'Saludable - ¡Vas bien! 💪', color: 'text-green-600' };
  };

  const focusAreas = [
    { id: 'rentabilidad', icon: PieChart, title: 'RENTABILIDAD', desc: 'Aumentar margen neto', gradient: 'from-red-400 to-red-500', border: 'border-red-300' },
    { id: 'eficiencia', icon: Zap, title: 'EFICIENCIA OPERACIONAL', desc: 'Reducir costos operacionales', gradient: 'from-yellow-400 to-yellow-500', border: 'border-yellow-300' },
    { id: 'expansion', icon: Globe, title: 'EXPANSIÓN MERCADOS', desc: 'Nuevos mercados/regiones', gradient: 'from-blue-400 to-blue-500', border: 'border-blue-300' },
    { id: 'portfolio', icon: Package, title: 'PORTFOLIO PRODUCTOS', desc: 'Nuevas líneas de negocio', gradient: 'from-green-400 to-green-500', border: 'border-green-300' },
    { id: 'procesos', icon: Cog, title: 'OPTIMIZACIÓN PROCESOS', desc: 'Automatización y sistemas', gradient: 'from-purple-400 to-purple-500', border: 'border-purple-300' },
    { id: 'equipos', icon: Users, title: 'GESTIÓN DE EQUIPOS', desc: 'Estructura y desarrollo', gradient: 'from-indigo-400 to-indigo-500', border: 'border-indigo-300' },
    { id: 'inversion', icon: TrendingUp, title: 'ESTRATEGIA INVERSIÓN', desc: 'M&A, inversión, partnerships', gradient: 'from-orange-400 to-orange-500', border: 'border-orange-300' },
    { id: 'sostenibilidad', icon: Leaf, title: 'SOSTENIBILIDAD', desc: 'Crecimiento sostenible', gradient: 'from-pink-400 to-pink-500', border: 'border-pink-300' },
  ];

  const quickActions = [
    'Cómo aumentar margen 5%',
    'Plan de expansión a nuevos mercados',
    'Optimizar estructura de costos',
    'Análisis de rentabilidad por línea',
    'Estrategia de crecimiento 3 años',
  ];

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    await onSendMessage(action);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    await onSendMessage(inputValue);
    setInputValue('');
  };

  const marginIndicator = getMarginIndicator();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-400 to-lime-500 p-4 shadow-lg flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold">Empresa</h1>
            <p className="text-sm opacity-90">3+ años</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-lime-50 to-slate-50 p-6 space-y-8">
        
        {/* SECCIÓN 1: Análisis Financiero */}
        <section>
          <h2 className="text-2xl font-bold text-lime-700 mb-4">Salud Financiera de tu Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-lime-400 to-lime-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <DollarSign className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Ingresos Anuales</h3>
              <input
                type="text"
                placeholder="$2,000,000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Margin Card */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <TrendingUp className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Margen Neto</h3>
              <input
                type="text"
                placeholder="12%"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* ROI Card */}
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <BarChart3 className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Rentabilidad</h3>
              <input
                type="text"
                placeholder="18%"
                value={roi}
                onChange={(e) => setRoi(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Employees Card */}
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <Users className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Empleados</h3>
              <input
                type="text"
                placeholder="50"
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Business Lines Card */}
            <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <Layers className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Líneas de Negocio</h3>
              <input
                type="text"
                placeholder="3"
                value={businessLines}
                onChange={(e) => setBusinessLines(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Growth Card */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <TrendingUp className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Crecimiento Anual</h3>
              <input
                type="text"
                placeholder="25%"
                value={yearlyGrowth}
                onChange={(e) => setYearlyGrowth(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Margin Indicator */}
          {marginIndicator && (
            <div className={`mt-4 p-4 bg-white rounded-lg border-l-4 ${marginIndicator.color === 'text-red-600' ? 'border-red-400' : marginIndicator.color === 'text-yellow-600' ? 'border-yellow-400' : 'border-green-400'}`}>
              <p className={`font-bold ${marginIndicator.color}`}>
                {marginIndicator.emoji} {marginIndicator.text}
              </p>
            </div>
          )}
        </section>

        {/* SECCIÓN 2: Análisis Competitivo */}
        <section>
          <h2 className="text-2xl font-bold text-lime-700 mb-4">¿Dónde quieres enfocar esfuerzos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`p-4 rounded-lg border-2 ${area.border} bg-gradient-to-br ${area.gradient} text-white hover:scale-105 cursor-pointer transition-all shadow-md hover:shadow-lg`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm mb-1">{area.title}</h3>
                  <p className="text-xs opacity-90">{area.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 3: Chat with AI */}
        <section className="bg-white rounded-xl border-l-4 border-lime-400 shadow-lg p-6">
          <h2 className="text-xl font-bold text-lime-600 mb-4">Chat con IA</h2>
          
          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-lime-400 text-white rounded-br-none'
                      : 'bg-lime-50 border-l-4 border-lime-400 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl p-4 rounded-lg bg-lime-50 border-l-4 border-lime-400 rounded-bl-none">
                  <p className="text-slate-600">Escribiendo...</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && !isLoading && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase text-slate-600 mb-2">
                Preguntas sugeridas:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action)}
                    className="text-left p-3 rounded-lg border-2 border-lime-300 bg-lime-50 text-lime-600 font-medium text-sm hover:bg-lime-100 transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu pregunta específica o desafío..."
              disabled={isLoading}
              className="flex-1 border border-lime-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 disabled:bg-slate-400 font-medium transition"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EmpresaInterface;
