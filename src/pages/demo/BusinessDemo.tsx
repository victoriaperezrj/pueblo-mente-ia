import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BusinessDemo() {
  const navigate = useNavigate();

  const salesData = [
    { month: 'Ene', sales: 4200 },
    { month: 'Feb', sales: 5100 },
    { month: 'Mar', sales: 4800 },
    { month: 'Abr', sales: 6200 },
    { month: 'May', sales: 7500 },
    { month: 'Jun', sales: 8500 },
  ];

  const metrics = [
    { icon: DollarSign, label: 'Ventas Totales', value: '$8,500', change: '+12.5%', positive: true },
    { icon: Users, label: 'Clientes Activos', value: '145', change: '+8 nuevos', positive: true },
    { icon: TrendingUp, label: 'Tasa Conversión', value: '3.2%', change: '+0.5%', positive: true },
    { icon: Target, label: 'Margen Promedio', value: '42%', change: '+2%', positive: true },
  ];

  const tools = [
    { title: 'Optimizador de Precios', color: 'from-green-500 to-emerald-500' },
    { title: 'Captador de Clientes', color: 'from-blue-500 to-purple-500' },
    { title: 'Automatizador', color: 'from-orange-500 to-red-500' },
    { title: 'Analizador Rentabilidad', color: 'from-pink-500 to-rose-500' },
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
          <Card className="p-8 mb-8 bg-gradient-to-br from-business/10 to-business/5 border-business/20">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Negocio 📊</h1>
            <p className="text-muted-foreground text-lg">
              Este es un demo con datos ficticios para negocios en operación.
            </p>
          </Card>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className="w-8 h-8 text-business" />
                  <span className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Ventas Mensuales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Herramientas de Optimización</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full cursor-pointer hover:shadow-lg transition-all">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${tool.color} mb-4`} />
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <Button size="sm" variant="outline" className="w-full mt-4">
                    Explorar
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
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
