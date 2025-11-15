import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Send,
  Users,
  TrendingUp,
  Calendar,
  Zap,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  ArrowLeft,
  Plus,
  Play,
  Pause,
  Eye,
  Edit,
  Copy,
  Trash2,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'sms' | 'multi';
  status: 'active' | 'paused' | 'draft' | 'completed';
  audience: number;
  sent: number;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
  startDate: string;
  endDate?: string;
}

interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  active: boolean;
  contacts: number;
  conversionRate: number;
}

export default function MarketingAutomation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'automation' | 'analytics'>('campaigns');
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);

  // Mock data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campaña de Lanzamiento Q1',
      type: 'multi',
      status: 'active',
      audience: 5420,
      sent: 5420,
      opens: 2890,
      clicks: 1245,
      conversions: 187,
      revenue: 37400,
      startDate: '2025-01-15',
      endDate: '2025-03-31',
    },
    {
      id: '2',
      name: 'Newsletter Semanal',
      type: 'email',
      status: 'active',
      audience: 8950,
      sent: 8950,
      opens: 3580,
      clicks: 892,
      conversions: 156,
      revenue: 18720,
      startDate: '2025-01-01',
    },
    {
      id: '3',
      name: 'Promoción Redes Sociales',
      type: 'social',
      status: 'active',
      audience: 12500,
      sent: 12500,
      opens: 8750,
      clicks: 2250,
      conversions: 340,
      revenue: 51000,
      startDate: '2025-02-01',
      endDate: '2025-02-28',
    },
    {
      id: '4',
      name: 'Re-engagement Campaign',
      type: 'email',
      status: 'paused',
      audience: 3200,
      sent: 2100,
      opens: 630,
      clicks: 189,
      conversions: 42,
      revenue: 6300,
      startDate: '2025-01-20',
    },
  ];

  const automationFlows: AutomationFlow[] = [
    {
      id: '1',
      name: 'Bienvenida a Nuevos Clientes',
      trigger: 'Nueva suscripción',
      steps: 5,
      active: true,
      contacts: 2340,
      conversionRate: 24.5,
    },
    {
      id: '2',
      name: 'Carrito Abandonado',
      trigger: 'Carrito inactivo 24h',
      steps: 3,
      active: true,
      contacts: 1856,
      conversionRate: 18.2,
    },
    {
      id: '3',
      name: 'Post-Compra Upsell',
      trigger: 'Compra completada',
      steps: 4,
      active: true,
      contacts: 987,
      conversionRate: 32.1,
    },
    {
      id: '4',
      name: 'Reactivación de Inactivos',
      trigger: 'Sin actividad 60 días',
      steps: 6,
      active: false,
      contacts: 0,
      conversionRate: 0,
    },
  ];

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalContacts: campaigns.reduce((acc, c) => acc + c.audience, 0),
    totalRevenue: campaigns.reduce((acc, c) => acc + c.revenue, 0),
    avgOpenRate: Math.round((campaigns.reduce((acc, c) => acc + (c.opens / c.sent * 100), 0) / campaigns.length)),
    avgClickRate: Math.round((campaigns.reduce((acc, c) => acc + (c.clicks / c.sent * 100), 0) / campaigns.length)),
  };

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'social': return MessageSquare;
      case 'sms': return Send;
      case 'multi': return Zap;
      default: return Mail;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'draft': return 'Borrador';
      case 'completed': return 'Completada';
      default: return status;
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
              onClick={() => navigate('/business/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketing Automation</h1>
              <p className="text-sm text-gray-600">Automatiza tus campañas y aumenta conversiones</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            onClick={() => setShowNewCampaignDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCampaigns}</p>
              <p className="text-sm text-gray-600">Campañas Totales</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeCampaigns}</p>
              <p className="text-sm text-gray-600">Activas</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{(stats.totalContacts / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-600">Contactos Alcanzados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-600">Ingresos Generados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.avgOpenRate}%</p>
              <p className="text-sm text-gray-600">Tasa de Apertura</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.avgClickRate}%</p>
              <p className="text-sm text-gray-600">Tasa de Clicks</p>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'campaigns', label: 'Campañas', icon: Send },
              { key: 'automation', label: 'Automatización', icon: Zap },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
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

        {/* Campaigns List */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {campaigns.map((campaign, index) => {
              const CampaignIcon = getCampaignIcon(campaign.type);
              const openRate = (campaign.opens / campaign.sent * 100).toFixed(1);
              const clickRate = (campaign.clicks / campaign.sent * 100).toFixed(1);
              const conversionRate = (campaign.conversions / campaign.sent * 100).toFixed(1);

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CampaignIcon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(campaign.startDate).toLocaleDateString('es-ES')}
                              </span>
                              {campaign.endDate && (
                                <span>→ {new Date(campaign.endDate).toLocaleDateString('es-ES')}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(campaign.status)}`}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Enviados</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.sent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Aperturas</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.opens.toLocaleString()}</div>
                            <div className="text-xs text-green-600">{openRate}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Clicks</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.clicks.toLocaleString()}</div>
                            <div className="text-xs text-blue-600">{clickRate}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Conversiones</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.conversions}</div>
                            <div className="text-xs text-purple-600">{conversionRate}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Ingresos</div>
                            <div className="text-lg font-bold text-green-600">${campaign.revenue.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" />
                            Duplicar
                          </Button>
                          {campaign.status === 'active' ? (
                            <Button variant="outline" size="sm">
                              <Pause className="w-4 h-4 mr-1" />
                              Pausar
                            </Button>
                          ) : campaign.status === 'paused' ? (
                            <Button variant="outline" size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Reanudar
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Automation Flows */}
        {activeTab === 'automation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">¿Qué es la Automatización de Marketing?</h3>
                    <p className="text-gray-700 mb-3">
                      Crea flujos de trabajo automatizados que se activan según el comportamiento de tus clientes.
                      Ahorra tiempo y aumenta conversiones con mensajes personalizados en el momento perfecto.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-white text-blue-700 border-blue-300">Ahorra 15+ horas/semana</Badge>
                      <Badge className="bg-white text-purple-700 border-purple-300">+32% conversión promedio</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationFlows.map((flow, index) => (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{flow.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="w-4 h-4" />
                          <span>{flow.trigger}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {flow.active ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pasos en el flujo</span>
                        <span className="font-semibold text-gray-900">{flow.steps}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contactos procesados</span>
                        <span className="font-semibold text-gray-900">{flow.contacts.toLocaleString()}</span>
                      </div>
                      {flow.active && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Tasa de conversión</span>
                            <span className="font-semibold text-green-600">{flow.conversionRate}%</span>
                          </div>
                          <Progress value={flow.conversionRate} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Flujo
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {flow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance por Canal</h3>
              <div className="space-y-4">
                {[
                  { channel: 'Email', sends: 17070, opens: 6800, clicks: 2326, color: 'blue' },
                  { channel: 'Redes Sociales', sends: 12500, opens: 8750, clicks: 2250, color: 'purple' },
                  { channel: 'Multi-Canal', sends: 5420, opens: 2890, clicks: 1245, color: 'orange' },
                ].map((channel) => {
                  const openRate = ((channel.opens / channel.sends) * 100).toFixed(1);
                  const clickRate = ((channel.clicks / channel.sends) * 100).toFixed(1);

                  return (
                    <div key={channel.channel} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{channel.channel}</span>
                        <span className="text-sm text-gray-600">{channel.sends.toLocaleString()} enviados</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Apertura: {openRate}%</div>
                          <Progress value={parseFloat(openRate)} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-gray-600">Clicks: {clickRate}%</div>
                          <Progress value={parseFloat(clickRate)} className="h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Análisis IA</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Mejor Momento para Enviar</h4>
                      <p className="text-sm text-gray-700">
                        Tus campañas tienen 34% más apertura los martes a las 10 AM.
                        Programa tus emails principales en este horario.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Audiencia más Comprometida</h4>
                      <p className="text-sm text-gray-700">
                        El segmento "Clientes Premium" tiene una tasa de conversión del 32%,
                        3x superior al promedio. Aumenta frecuencia de comunicación.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Optimiza tu Automatización</h4>
                      <p className="text-sm text-gray-700">
                        El flujo de "Post-Compra Upsell" tiene 32% de conversión.
                        Considera replicar esta estrategia en otros segmentos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* New Campaign Dialog */}
      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Campaña</DialogTitle>
            <DialogDescription>
              Configura tu campaña de marketing con objetivos claros y audiencia específica.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nombre de la Campaña</Label>
              <Input id="campaign-name" placeholder="Ej: Lanzamiento Producto X" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Redes Sociales</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="multi">Multi-Canal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-audience">Audiencia</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar audiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los contactos</SelectItem>
                    <SelectItem value="active">Clientes activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-message">Mensaje</Label>
              <Textarea
                id="campaign-message"
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-start">Fecha de Inicio</Label>
                <Input id="campaign-start" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-end">Fecha de Fin (opcional)</Label>
                <Input id="campaign-end" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Crear Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
