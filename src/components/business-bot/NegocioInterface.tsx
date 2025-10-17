import { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, BarChart, Rocket, Zap, 
  Heart, Package, Globe, PiggyBank, Menu
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NegocioInterfaceProps {
  onBack: () => void;
  onSendMessage: (message: string) => Promise<string>;
  messages: Message[];
  isLoading: boolean;
}

const NegocioInterface = ({ onBack, onSendMessage, messages, isLoading }: NegocioInterfaceProps) => {
  const [mrr, setMrr] = useState('');
  const [growth, setGrowth] = useState('');
  const [team, setTeam] = useState('');
  const [clients, setClients] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const challenges = [
    { id: 'ventas', icon: Rocket, title: 'ESCALAR VENTAS', desc: 'Aumentar clientes y ingresos', gradient: 'from-red-400 to-red-500', border: 'border-red-300' },
    { id: 'operaciones', icon: Zap, title: 'OPTIMIZAR OPERACIONES', desc: 'Automatizar procesos', gradient: 'from-yellow-400 to-yellow-500', border: 'border-yellow-300' },
    { id: 'equipo', icon: Users, title: 'ARMAR EQUIPO', desc: 'Contratar personas clave', gradient: 'from-green-400 to-green-500', border: 'border-green-300' },
    { id: 'margen', icon: TrendingUp, title: 'MEJORAR MARGEN', desc: 'Reducir costos', gradient: 'from-blue-400 to-blue-500', border: 'border-blue-300' },
    { id: 'financiamiento', icon: PiggyBank, title: 'FINANCIAMIENTO', desc: 'Conseguir inversión', gradient: 'from-indigo-400 to-indigo-500', border: 'border-indigo-300' },
    { id: 'retencion', icon: Heart, title: 'RETENCIÓN CLIENTES', desc: 'Reducir churn', gradient: 'from-pink-400 to-pink-500', border: 'border-pink-300' },
    { id: 'producto', icon: Package, title: 'PRODUCTO/SERVICIO', desc: 'Mejorar oferta', gradient: 'from-cyan-400 to-cyan-500', border: 'border-cyan-300' },
    { id: 'expandir', icon: Globe, title: 'EXPANDIR MERCADOS', desc: 'Nuevos clientes/regiones', gradient: 'from-purple-400 to-purple-500', border: 'border-purple-300' },
  ];

  const quickActions = [
    'Escalar ventas sin quemar efectivo',
    'Automatizar operaciones',
    'Contratar primer sales person',
    'Optimizar margen',
    'Plan de financiamiento',
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 shadow-lg flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold">Negocio</h1>
            <p className="text-sm opacity-90">1-3 años</p>
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
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-50 to-slate-50 p-6 space-y-8">
        
        {/* SECCIÓN 1: Dashboard Visual */}
        <section>
          <h2 className="text-2xl font-bold text-orange-700 mb-4">Tu Negocio en Números</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MRR Card */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <DollarSign className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">MRR</h3>
              <input
                type="text"
                placeholder="$10,000"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Growth Card */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <TrendingUp className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Crecimiento MoM</h3>
              <input
                type="text"
                placeholder="15%"
                value={growth}
                onChange={(e) => setGrowth(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Team Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <Users className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Equipo</h3>
              <input
                type="text"
                placeholder="5 personas"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Clients Card */}
            <div className="bg-gradient-to-br from-red-400 to-red-500 p-6 rounded-xl shadow-md text-white hover:shadow-lg hover:scale-105 transition-all">
              <BarChart className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-semibold mb-2">Clientes</h3>
              <input
                type="text"
                placeholder="150"
                value={clients}
                onChange={(e) => setClients(e.target.value)}
                className="w-full bg-white/20 border border-white/40 rounded px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Quick Diagnosis */}
        <section>
          <h2 className="text-2xl font-bold text-orange-700 mb-4">¿Cuál es tu principal desafío?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {challenges.map((challenge) => {
              const Icon = challenge.icon;
              return (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge.id)}
                  className={`p-4 rounded-lg border-2 ${challenge.border} bg-gradient-to-br ${challenge.gradient} text-white hover:scale-105 cursor-pointer transition-all shadow-md hover:shadow-lg`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm mb-1">{challenge.title}</h3>
                  <p className="text-xs opacity-90">{challenge.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 3: Chat with AI */}
        <section className="bg-white rounded-xl border-l-4 border-orange-400 shadow-lg p-6">
          <h2 className="text-xl font-bold text-orange-600 mb-4">Chat con IA</h2>
          
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
                      ? 'bg-orange-400 text-white rounded-br-none'
                      : 'bg-orange-50 border-l-4 border-orange-400 rounded-bl-none'
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
                <div className="max-w-2xl p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400 rounded-bl-none">
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
                    className="text-left p-3 rounded-lg border-2 border-orange-300 bg-orange-50 text-orange-600 font-medium text-sm hover:bg-orange-100 transition"
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
              className="flex-1 border border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-slate-400 font-medium transition"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default NegocioInterface;
