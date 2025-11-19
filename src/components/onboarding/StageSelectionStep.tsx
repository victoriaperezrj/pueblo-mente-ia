import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Store, Building2, Globe, ArrowLeft } from "lucide-react";

type Stage = "entrepreneur" | "business" | "pyme_enterprise" | "global";

interface StageSelectionStepProps {
  onSelect: (stage: Stage) => void;
  onBack: () => void;
}

export function StageSelectionStep({ onSelect, onBack }: StageSelectionStepProps) {
  const stages = [
    {
      id: "entrepreneur" as Stage,
      title: "Emprendedor",
      description: "Tengo una idea pero no la bajé a tierra",
      icon: Lightbulb,
      color: "from-[hsl(var(--entrepreneur))] to-blue-600",
    },
    {
      id: "business" as Stage,
      title: "Negocio",
      description: "Ya tengo un negocio funcionando",
      icon: Store,
      color: "from-[hsl(var(--business))] to-green-600",
      badge: "MÁS USADO",
    },
    {
      id: "pyme_enterprise" as Stage,
      title: "PyME",
      description: "Tengo una empresa con equipo",
      icon: Building2,
      color: "from-[hsl(var(--pyme))] to-purple-600",
    },
    {
      id: "global" as Stage,
      title: "Global",
      description: "Multinacional o en expansión",
      icon: Globe,
      color: "from-violet-500 to-violet-600",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between text-white">
        <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="text-sm font-medium">PASO 1 DE 3</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">¿En qué etapa estás?</h2>
        <p className="text-xl text-white/80">Elegí la opción que mejor describe tu situación</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="bg-white/95 dark:bg-white/10 backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
                onClick={() => onSelect(stage.id)}
              >
                {stage.badge && (
                  <div className="absolute top-4 right-4 bg-[hsl(var(--business))] text-white text-xs px-3 py-1 rounded-full font-bold">
                    {stage.badge}
                  </div>
                )}
                <CardHeader>
                  <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-center">{stage.title}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {stage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Seleccionar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
