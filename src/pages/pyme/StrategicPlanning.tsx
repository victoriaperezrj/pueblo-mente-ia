import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Lightbulb,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Award,
  Flag,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'growth' | 'efficiency' | 'innovation';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  owner: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export default function StrategicPlanning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'okrs' | 'roadmap'>('overview');
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Mock data
  const goals: Goal[] = [
    {
      id: '1',
      title: 'Aumentar ingresos anuales en 30%',
      description: 'Expandir líneas de productos y penetrar nuevos mercados',
      category: 'revenue',
      priority: 'high',
      deadline: '2025-12-31',
      progress: 65,
      status: 'on-track',
      owner: 'María González',
      milestones: [
        { id: '1-1', title: 'Lanzar nueva línea de productos', completed: true, dueDate: '2025-03-15' },
        { id: '1-2', title: 'Abrir 3 nuevos canales de distribución', completed: true, dueDate: '2025-06-30' },
        { id: '1-3', title: 'Alcanzar 1000 nuevos clientes', completed: false, dueDate: '2025-09-30' },
        { id: '1-4', title: 'Optimizar estrategia de precios', completed: false, dueDate: '2025-12-31' },
      ],
    },
    {
      id: '2',
      title: 'Expandir equipo de desarrollo',
      description: 'Contratar 5 desarrolladores senior para acelerar innovación',
      category: 'growth',
      priority: 'high',
      deadline: '2025-08-31',
      progress: 40,
      status: 'on-track',
      owner: 'Juan Pérez',
      milestones: [
        { id: '2-1', title: 'Definir perfiles y requisitos', completed: true, dueDate: '2025-02-28' },
        { id: '2-2', title: 'Publicar ofertas de trabajo', completed: true, dueDate: '2025-03-31' },
        { id: '2-3', title: 'Realizar entrevistas', completed: false, dueDate: '2025-06-30' },
        { id: '2-4', title: 'Onboarding completo', completed: false, dueDate: '2025-08-31' },
      ],
    },
    {
      id: '3',
      title: 'Reducir costos operativos 15%',
      description: 'Optimizar procesos y automatizar tareas repetitivas',
      category: 'efficiency',
      priority: 'medium',
      deadline: '2025-10-31',
      progress: 25,
      status: 'at-risk',
      owner: 'Carlos López',
      milestones: [
        { id: '3-1', title: 'Auditoría de gastos actuales', completed: true, dueDate: '2025-03-31' },
        { id: '3-2', title: 'Implementar herramientas de automatización', completed: false, dueDate: '2025-06-30' },
        { id: '3-3', title: 'Renegociar contratos con proveedores', completed: false, dueDate: '2025-08-31' },
        { id: '3-4', title: 'Validar ahorros', completed: false, dueDate: '2025-10-31' },
      ],
    },
    {
      id: '4',
      title: 'Lanzar plataforma de IA',
      description: 'Desarrollar y lanzar nueva plataforma con capacidades de IA',
      category: 'innovation',
      priority: 'high',
      deadline: '2025-11-30',
      progress: 55,
      status: 'on-track',
      owner: 'Ana Rodríguez',
      milestones: [
        { id: '4-1', title: 'Investigación y diseño', completed: true, dueDate: '2025-04-30' },
        { id: '4-2', title: 'Desarrollo MVP', completed: true, dueDate: '2025-07-31' },
        { id: '4-3', title: 'Testing beta con clientes', completed: false, dueDate: '2025-09-30' },
        { id: '4-4', title: 'Lanzamiento público', completed: false, dueDate: '2025-11-30' },
      ],
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'growth': return TrendingUp;
      case 'efficiency': return Zap;
      case 'innovation': return Lightbulb;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'from-green-500 to-green-600';
      case 'growth': return 'from-blue-500 to-blue-600';
      case 'efficiency': return 'from-purple-500 to-purple-600';
      case 'innovation': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track': return 'En camino';
      case 'at-risk': return 'En riesgo';
      case 'delayed': return 'Retrasado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    onTrackGoals: goals.filter(g => g.status === 'on-track').length,
    atRiskGoals: goals.filter(g => g.status === 'at-risk').length,
    averageProgress: Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length),
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
              <h1 className="text-2xl font-bold text-gray-900">Planificación Estratégica</h1>
              <p className="text-sm text-gray-600">Define y monitorea los objetivos de tu organización</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            onClick={() => setShowNewGoalDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalGoals}</p>
              <p className="text-sm text-gray-600">Objetivos Totales</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.onTrackGoals}</p>
              <p className="text-sm text-gray-600">En Camino</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.atRiskGoals}</p>
              <p className="text-sm text-gray-600">En Riesgo</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.completedGoals}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.averageProgress}%</p>
              <p className="text-sm text-gray-600">Progreso Promedio</p>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'overview', label: 'Visión General', icon: BarChart3 },
              { key: 'goals', label: 'Objetivos', icon: Target },
              { key: 'okrs', label: 'OKRs', icon: Flag },
              { key: 'roadmap', label: 'Roadmap', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Goals List */}
        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {goals.map((goal, index) => {
              const CategoryIcon = getCategoryIcon(goal.category);
              const completedMilestones = goal.milestones.filter(m => m.completed).length;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getCategoryColor(goal.category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <CategoryIcon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(goal.status)} ml-4`}>
                            {getStatusLabel(goal.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{goal.owner}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{new Date(goal.deadline).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Flag className={`w-4 h-4 ${getPriorityColor(goal.priority)}`} />
                            <span className="text-gray-700">
                              Prioridad {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {completedMilestones}/{goal.milestones.length} hitos
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Progreso</span>
                            <span className="font-bold text-gray-900">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-700">Próximos hitos:</div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            {goal.milestones.slice(0, 2).map((milestone) => (
                              <div key={milestone.id} className="flex items-center gap-3">
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={`text-sm flex-1 ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {milestone.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(milestone.dueDate).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Objetivos por Categoría</h3>
              <div className="space-y-4">
                {['revenue', 'growth', 'efficiency', 'innovation'].map((category) => {
                  const categoryGoals = goals.filter(g => g.category === category);
                  const Icon = getCategoryIcon(category);
                  const avgProgress = categoryGoals.length > 0
                    ? Math.round(categoryGoals.reduce((acc, g) => acc + g.progress, 0) / categoryGoals.length)
                    : 0;

                  const categoryLabels: Record<string, string> = {
                    revenue: 'Ingresos',
                    growth: 'Crecimiento',
                    efficiency: 'Eficiencia',
                    innovation: 'Innovación',
                  };

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(category)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{categoryLabels[category]}</span>
                        </div>
                        <span className="text-sm text-gray-600">{categoryGoals.length} objetivos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={avgProgress} className="flex-1 h-2" />
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{avgProgress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Análisis IA Estratégico</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Oportunidad Detectada</h4>
                      <p className="text-sm text-gray-700">
                        El objetivo de "Reducir costos operativos" está en riesgo. Considera priorizar la
                        automatización de procesos para acelerar el progreso.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Progreso Excepcional</h4>
                      <p className="text-sm text-gray-700">
                        Tu objetivo de aumento de ingresos va por buen camino con un 65% de progreso.
                        Este ritmo sugiere que podrías superar la meta del 30%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Recomendación de Balance</h4>
                      <p className="text-sm text-gray-700">
                        Tienes 3 objetivos de alta prioridad activos simultáneamente.
                        Considera redistribuir recursos para mantener el enfoque.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Hitos Próximos</h4>
                      <p className="text-sm text-gray-700">
                        Tienes 4 hitos que vencen en los próximos 30 días.
                        Asegúrate de que los equipos tienen los recursos necesarios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline de Objetivos</h3>
              <div className="space-y-3">
                {goals
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .map((goal) => {
                    const Icon = getCategoryIcon(goal.category);
                    const daysUntilDeadline = Math.ceil(
                      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div key={goal.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(goal.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{goal.title}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">
                              Vence: {new Date(goal.deadline).toLocaleDateString('es-ES')}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({daysUntilDeadline > 0 ? `${daysUntilDeadline} días` : 'Vencido'})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{goal.progress}%</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                            {getStatusLabel(goal.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Objetivo Estratégico</DialogTitle>
            <DialogDescription>
              Define un nuevo objetivo para tu organización con hitos y métricas claras.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Título del Objetivo</Label>
              <Input id="goal-title" placeholder="Ej: Aumentar la cuota de mercado en 20%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Descripción</Label>
              <Textarea
                id="goal-description"
                placeholder="Describe el objetivo y su impacto esperado..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-category">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Ingresos</SelectItem>
                    <SelectItem value="growth">Crecimiento</SelectItem>
                    <SelectItem value="efficiency">Eficiencia</SelectItem>
                    <SelectItem value="innovation">Innovación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-priority">Prioridad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-owner">Responsable</Label>
                <Input id="goal-owner" placeholder="Nombre del responsable" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Fecha límite</Label>
                <Input id="goal-deadline" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGoalDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Crear Objetivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
