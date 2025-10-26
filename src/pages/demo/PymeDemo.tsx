import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PymeDemo() {
  const navigate = useNavigate();

  const revenueData = [
    { quarter: 'Q1', revenue: 450000 },
    { quarter: 'Q2', revenue: 520000 },
    { quarter: 'Q3', revenue: 610000 },
    { quarter: 'Q4', revenue: 720000 },
  ];

  const metrics = [
    { icon: Building2, label: 'Facturación Anual', value: '$2.3M', change: '+18%' },
    { icon: Users, label: 'Empleados', value: '42', change: '+6 este año' },
    { icon: Target, label: 'OKRs Cumplidos', value: '85%', change: '+12%' },
    { icon: TrendingUp, label: 'Crecimiento', value: '23%', change: 'YoY' },
  ];

  const team = [
    { name: 'María García', role: 'Gerente Comercial', status: 'Activo', performance: 92 },
    { name: 'Carlos López', role: 'Director Técnico', status: 'Activo', performance: 88 },
    { name: 'Ana Martínez', role: 'Jefa de Operaciones', status: 'Activo', performance: 95 },
    { name: 'Diego Rodríguez', role: 'Líder de Marketing', status: 'Activo', performance: 85 },
  ];

  const okrs = [
    { title: 'Aumentar facturación 25%', progress: 85 },
    { title: 'Reducir costos operativos 15%', progress: 72 },
    { title: 'Lanzar 3 productos nuevos', progress: 67 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/demo/select-role')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
            🎭 MODO DEMO
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8 bg-gradient-to-br from-pyme/10 to-pyme/5 border-pyme/20">
            <h1 className="text-3xl font-bold mb-2">Dashboard Enterprise 🏢</h1>
            <p className="text-muted-foreground text-lg">
              Este es un demo del dashboard para PyMEs con datos de ejemplo.
            </p>
          </Card>
        </motion.div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6">
                <metric.icon className="w-8 h-8 text-pyme mb-4" />
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-3xl font-bold mb-1">{metric.value}</p>
                <span className="text-sm text-green-600">{metric.change}</span>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Facturación por Trimestre</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Equipo de Liderazgo</h2>
                <div className="space-y-4">
                  {team.map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm mb-2">Performance: {member.performance}%</p>
                        <Progress value={member.performance} className="w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="kpis">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Objetivos Trimestrales (OKRs)</h2>
                <div className="space-y-6">
                  {okrs.map((okr, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{okr.title}</span>
                        <span className="text-sm text-muted-foreground">{okr.progress}%</span>
                      </div>
                      <Progress value={okr.progress} />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => navigate('/')}>
            Crear Cuenta Gratis
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
