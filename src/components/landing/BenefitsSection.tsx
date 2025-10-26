import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Zap, Target, TrendingUp, Shield, Lightbulb, Rocket } from 'lucide-react';

interface Benefit {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
}

export const BenefitsSection = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([
    {
      id: '1',
      icon: Lightbulb,
      title: 'Validación de Ideas',
      description: 'Analizamos tu idea con IA y te mostramos si es viable antes de invertir tiempo y dinero.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '2',
      icon: Rocket,
      title: 'Plan de Negocios Automatizado',
      description: 'Generamos tu plan de negocios completo en minutos, no en semanas.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: '3',
      icon: TrendingUp,
      title: 'Análisis Financiero',
      description: 'Simulá escenarios financieros y descubrí cuánto necesitás para lanzar tu proyecto.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '4',
      icon: Target,
      title: 'Estrategias Personalizadas',
      description: 'Recomendaciones específicas según tu etapa: Emprendedor, Negocio o PyME.',
      color: 'from-pink-500 to-rose-500'
    }
  ]);

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-muted-foreground">
            Arrastrá las cards para ordenarlas según tus prioridades 👇
          </p>
        </div>

        <Reorder.Group
          axis="y"
          values={benefits}
          onReorder={setBenefits}
          className="max-w-4xl mx-auto space-y-4"
        >
          {benefits.map((benefit) => (
            <Reorder.Item
              key={benefit.id}
              value={benefit}
              className="bg-card border border-border rounded-2xl p-8 cursor-grab active:cursor-grabbing shadow-lg hover:shadow-2xl transition-shadow"
              whileHover={{ scale: 1.02, y: -5 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${benefit.color} flex-shrink-0`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-lg">{benefit.description}</p>
                </div>
                <div className="text-4xl text-muted-foreground/20 font-bold">
                  {benefits.indexOf(benefit) + 1}
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <p className="text-center text-sm text-muted-foreground mt-8">
          💡 Tip: Mantené presionado y arrastrá para reordenar
        </p>
      </div>
    </section>
  );
};
