import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle,
  Brain,
  BarChart3,
} from 'lucide-react';

export default function ValidationTools() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'market-test',
      title: 'Market Test Express',
      description: 'Valida tu idea de negocio en segundos con análisis impulsado por GPT-4',
      icon: Sparkles,
      gradient: 'from-blue-600 to-purple-600',
      features: [
        'Puntuación de viabilidad (0-100)',
        'Análisis FODA completo',
        'Proyecciones financieras',
        'Recomendaciones de IA',
      ],
      path: '/validation/market-test',
      demoAvailable: true,
    },
    {
      id: 'benchmark',
      title: 'Benchmark Automático',
      description: 'Inteligencia competitiva con web scraping + análisis GPT-4',
      icon: TrendingUp,
      gradient: 'from-emerald-600 to-teal-600',
      features: [
        'Descubrimiento automático de competidores',
        'Análisis profundo de competencia',
        'Identificación de brechas de mercado',
        'Estrategias de diferenciación',
      ],
      path: '/validation/benchmark',
      demoAvailable: true,
    },
    {
      id: 'target-audience',
      title: 'Generador de Público Objetivo',
      description: 'Crea personas detalladas con avatares generados por DALL-E 3',
      icon: Users,
      gradient: 'from-purple-600 to-pink-600',
      features: [
        'Personas con IA + avatares visuales',
        'Demografía y psicografía',
        'Canales de marketing recomendados',
        'Estrategias de mensajería',
      ],
      path: '/validation/target-audience',
      demoAvailable: true,
    },
  ];

  const stats = [
    { label: 'Ideas Validadas', value: '10K+', icon: Brain },
    { label: 'Precisión IA', value: '95%', icon: Target },
    { label: 'Tiempo Promedio', value: '30s', icon: Zap },
    { label: 'Éxito Proyectos', value: '78%', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">
                Powered by GPT-4 + DALL-E 3
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Herramientas de
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Validación IA
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Valida tu idea de negocio, analiza la competencia y conoce a tu audiencia
              con el poder de la Inteligencia Artificial
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/validation/market-test')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Empezar Gratis
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/demo/intro')}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => navigate(tool.path)}
                className="group cursor-pointer"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:shadow-2xl hover:border-white/20">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.gradient} mb-4`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {tool.title}
                  </h3>

                  <p className="text-gray-400 mb-6">{tool.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                    <span>Probar ahora</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Demo badge */}
                  {tool.demoAvailable && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                        Demo disponible
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para validar tu idea?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Únete a miles de emprendedores que ya están usando IA para tomar
                decisiones más inteligentes
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
