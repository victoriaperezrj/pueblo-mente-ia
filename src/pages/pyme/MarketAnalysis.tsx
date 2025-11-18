import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Download,
  Eye,
  DollarSign,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  trend: 'up' | 'down' | 'stable';
  strengths: string[];
  weaknesses: string[];
}

interface MarketTrend {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  relevance: number;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  potential: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToMarket: string;
}

export default function MarketAnalysis() {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [analyzing, setAnalyzing] = useState(false);

  // Mock data
  const marketOverview = {
    marketSize: 850000000,
    marketGrowth: 12.5,
    yourMarketShare: 8.5,
    competitorCount: 24,
    customerSegments: 5,
    avgCustomerValue: 2400,
  };

  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'Líder del Mercado',
      marketShare: 32,
      trend: 'up',
      strengths: ['Brand recognition', 'Amplia red de distribución', 'Economías de escala'],
      weaknesses: ['Poca innovación', 'Servicio al cliente lento', 'Precios altos'],
    },
    {
      id: '2',
      name: 'Competidor Innovador',
      marketShare: 18,
      trend: 'up',
      strengths: ['Tecnología avanzada', 'Experiencia de usuario superior', 'Marketing digital efectivo'],
      weaknesses: ['Recursos limitados', 'Cobertura geográfica reducida', 'Equipo pequeño'],
    },
    {
      id: '3',
      name: 'Jugador Tradicional',
      marketShare: 15,
      trend: 'down',
      strengths: ['Experiencia en la industria', 'Base de clientes leales', 'Estabilidad financiera'],
      weaknesses: ['Tecnología obsoleta', 'Procesos lentos', 'Resistencia al cambio'],
    },
    {
      id: '4',
      name: 'Tu Empresa',
      marketShare: 8.5,
      trend: 'up',
      strengths: ['Agilidad', 'Innovación constante', 'Excelente servicio', 'Precios competitivos'],
      weaknesses: ['Reconocimiento de marca limitado', 'Recursos de marketing', 'Equipo en crecimiento'],
    },
  ];

  const trends: MarketTrend[] = [
    {
      id: '1',
      title: 'Automatización con IA',
      description: 'Creciente adopción de herramientas de IA para automatizar procesos operativos y mejorar la eficiencia.',
      impact: 'high',
      timeframe: '6-12 meses',
      relevance: 95,
    },
    {
      id: '2',
      title: 'Sostenibilidad',
      description: 'Los consumidores priorizan empresas con prácticas sostenibles y responsabilidad ambiental.',
      impact: 'high',
      timeframe: '12-18 meses',
      relevance: 88,
    },
    {
      id: '3',
      title: 'Personalización',
      description: 'Demanda de experiencias y productos personalizados basados en datos del cliente.',
      impact: 'medium',
      timeframe: '3-6 meses',
      relevance: 82,
    },
    {
      id: '4',
      title: 'Trabajo Remoto',
      description: 'Modelos híbridos de trabajo están transformando las necesidades de herramientas y servicios empresariales.',
      impact: 'medium',
      timeframe: '6-9 meses',
      relevance: 75,
    },
    {
      id: '5',
      title: 'Comercio Social',
      description: 'Integración de comercio electrónico en plataformas de redes sociales.',
      impact: 'medium',
      timeframe: '9-12 meses',
      relevance: 70,
    },
  ];

  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Expansión a Mercado Regional',
      description: 'Oportunidad de expandir operaciones a 3 ciudades vecinas con baja competencia directa.',
      potential: 85,
      difficulty: 'medium',
      timeToMarket: '4-6 meses',
    },
    {
      id: '2',
      title: 'Lanzamiento de Línea Premium',
      description: 'Segmento premium muestra alto potencial de crecimiento con márgenes superiores al 40%.',
      potential: 78,
      difficulty: 'medium',
      timeToMarket: '6-8 meses',
    },
    {
      id: '3',
      title: 'Alianza Estratégica B2B',
      description: 'Colaboración con empresas complementarias para acceder a su base de clientes.',
      potential: 72,
      difficulty: 'easy',
      timeToMarket: '2-3 meses',
    },
    {
      id: '4',
      title: 'Plataforma de Suscripción',
      description: 'Modelo de ingresos recurrentes mediante membresías y suscripciones.',
      potential: 90,
      difficulty: 'hard',
      timeToMarket: '8-12 meses',
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/pyme/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análisis de Mercado IA</h1>
              <p className="text-sm text-gray-600">Insights inteligentes sobre tu mercado y competencia</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="12m">12 meses</SelectItem>
                <SelectItem value="24m">24 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              onClick={() => setAnalyzing(true)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar Análisis
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                ${(marketOverview.marketSize / 1000000).toFixed(0)}M
              </p>
              <p className="text-sm text-gray-600">Tamaño de Mercado</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">+{marketOverview.marketGrowth}%</p>
              <p className="text-sm text-gray-600">Crecimiento Anual</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{marketOverview.yourMarketShare}%</p>
              <p className="text-sm text-gray-600">Tu Cuota de Mercado</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{marketOverview.competitorCount}</p>
              <p className="text-sm text-gray-600">Competidores</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{marketOverview.customerSegments}</p>
              <p className="text-sm text-gray-600">Segmentos</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">${marketOverview.avgCustomerValue}</p>
              <p className="text-sm text-gray-600">Valor Promedio</p>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Competitive Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Análisis Competitivo</h3>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver más
              </Button>
            </div>

            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg ${
                    competitor.name === 'Tu Empresa' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-900">{competitor.name}</div>
                      {getTrendIcon(competitor.trend)}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{competitor.marketShare}%</div>
                      <div className="text-xs text-gray-600">cuota</div>
                    </div>
                  </div>

                  <Progress value={competitor.marketShare} className="h-2 mb-3" />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Fortalezas:</div>
                      <ul className="space-y-1">
                        {competitor.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-xs">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Debilidades:</div>
                      <ul className="space-y-1">
                        {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-xs">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Market Trends */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Tendencias del Mercado</h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                IA Actualizado
              </Badge>
            </div>

            <div className="space-y-4">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{trend.title}</h4>
                        <Badge className={`text-xs ${getImpactColor(trend.impact)}`}>
                          {trend.impact === 'high' ? 'Alto' : trend.impact === 'medium' ? 'Medio' : 'Bajo'} impacto
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{trend.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Relevancia:</span>
                      <span className="font-semibold text-gray-900">{trend.relevance}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Opportunities */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Oportunidades de Crecimiento</h3>
              <p className="text-sm text-gray-600">Identificadas por nuestro motor de IA</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">{opportunities.length} oportunidades detectadas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {opportunity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Potencial de éxito</span>
                      <span className="font-semibold text-gray-900">{opportunity.potential}%</span>
                    </div>
                    <Progress value={opportunity.potential} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Target className={`w-4 h-4 ${getDifficultyColor(opportunity.difficulty)}`} />
                      <span className="text-gray-600">
                        Dificultad:{' '}
                        <span className={`font-semibold ${getDifficultyColor(opportunity.difficulty)}`}>
                          {opportunity.difficulty === 'easy' ? 'Fácil' : opportunity.difficulty === 'medium' ? 'Media' : 'Alta'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{opportunity.timeToMarket}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Insights de IA</h3>
              <p className="text-sm text-gray-600">Recomendaciones estratégicas personalizadas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ventaja Competitiva</h4>
                  <p className="text-sm text-gray-700">
                    Tu agilidad e innovación son ventajas clave. Capitaliza esto lanzando productos
                    más rápido que competidores tradicionales.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Oportunidad de Nicho</h4>
                  <p className="text-sm text-gray-700">
                    El segmento premium está desatendido. Existe una oportunidad para capturar
                    clientes de alto valor con una oferta diferenciada.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Área de Mejora</h4>
                  <p className="text-sm text-gray-700">
                    Tu reconocimiento de marca es limitado comparado con competidores. Invierte en
                    marketing de contenido y presencia digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
