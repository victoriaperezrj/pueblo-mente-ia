import { motion } from 'framer-motion';
import { Lightbulb, Target, DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function EntrepreneurDemo() {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Lightbulb,
      title: 'Validador de Ideas',
      description: 'Analizá tu idea con IA',
      color: 'from-yellow-500 to-orange-500',
      locked: false
    },
    {
      icon: Target,
      title: 'Análisis de Mercado',
      description: 'Entendé tu competencia',
      color: 'from-blue-500 to-purple-500',
      locked: true
    },
    {
      icon: DollarSign,
      title: 'Calculadora Presupuesto',
      description: 'Calculá inversión inicial',
      color: 'from-green-500 to-emerald-500',
      locked: true
    },
    {
      icon: FileText,
      title: 'Plan de Negocios',
      description: 'Generá tu plan completo',
      color: 'from-pink-500 to-rose-500',
      locked: true
    }
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
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8 bg-gradient-to-br from-entrepreneur/10 to-entrepreneur/5 border-entrepreneur/20">
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido, Emprendedor! 🚀</h1>
            <p className="text-muted-foreground text-lg">
              Este es un demo del dashboard para emprendedores. Explorá las herramientas disponibles.
            </p>
          </Card>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tu Progreso</h2>
              <span className="text-2xl font-bold text-entrepreneur">25%</span>
            </div>
            <Progress value={25} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Has completado 1 de 4 herramientas principales
            </p>
          </Card>
        </motion.div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Tus Herramientas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className={`p-6 h-full ${tool.locked ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'} transition-all`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  {tool.locked ? (
                    <div className="text-xs text-muted-foreground">🔒 Próximamente</div>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full">
                      Usar Herramienta
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Próximos Pasos</h2>
            <div className="space-y-3">
              {[
                'Validá tu idea de negocio',
                'Investigá tu mercado objetivo',
                'Calculá tu presupuesto inicial',
                'Armá tu plan de negocios'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Button size="lg" onClick={() => navigate('/')}>
            Crear Cuenta Gratis
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
