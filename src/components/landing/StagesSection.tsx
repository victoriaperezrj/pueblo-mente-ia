import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StagesSectionProps {
  onStageSelect: () => void;
}

export const StagesSection = ({ onStageSelect }: StagesSectionProps) => {
  const stages = [
    {
      icon: Lightbulb,
      title: 'Emprendedor',
      subtitle: 'Tenés una idea',
      description: 'Validá tu idea, aprendé a armar un plan de negocios y descubrí cómo lanzar tu proyecto.',
      color: 'from-entrepreneur to-entrepreneur/80',
      features: ['Validador de Ideas', 'Plan de Negocio', 'Análisis de Mercado'],
      badge: null
    },
    {
      icon: TrendingUp,
      title: 'Negocio',
      subtitle: '1-3 años operando',
      description: 'Optimizá ventas, automatizá procesos y escalá tu negocio al siguiente nivel.',
      color: 'from-business to-business/80',
      features: ['Optimización de Ventas', 'Automatización', 'Captación de Clientes'],
      badge: 'MÁS USADO'
    },
    {
      icon: Building2,
      title: 'PyME',
      subtitle: '+3 años, equipo establecido',
      description: 'Gestioná equipos, definí estrategias y expandí tu empresa con herramientas enterprise.',
      color: 'from-pyme to-pyme/80',
      features: ['Dashboard en Tiempo Real', 'Gestión de Equipos', 'KPIs y OKRs'],
      badge: null
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Herramientas para cada etapa
          </h2>
          <p className="text-xl text-muted-foreground">
            Elegí tu etapa y accedé a las herramientas que necesitás ahora
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative"
            >
              <div className="bg-card border border-border rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all">
                {stage.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    {stage.badge}
                  </Badge>
                )}
                
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-6 mx-auto`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stage.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-center mb-2">{stage.title}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{stage.subtitle}</p>
                <p className="text-muted-foreground mb-6 text-center">{stage.description}</p>

                <div className="space-y-2 mb-6">
                  {stage.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={onStageSelect}
                  className="w-full"
                  variant="outline"
                >
                  Explorar Herramientas
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
