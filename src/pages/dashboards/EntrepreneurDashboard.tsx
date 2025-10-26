import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Target, DollarSign, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/layout/Navbar";

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();

  const tools = [
    {
      icon: Lightbulb,
      title: "Validador de Ideas",
      description: "Analiza tu idea antes de invertir",
      route: "/tools/idea-validator",
      color: "from-[hsl(var(--entrepreneur))] to-blue-600",
    },
    {
      icon: Target,
      title: "Análisis de Mercado",
      description: "Conoce tu competencia y oportunidades",
      route: "/tools/market-analysis",
      color: "from-[hsl(var(--pyme))] to-purple-600",
    },
    {
      icon: DollarSign,
      title: "Calculadora de Presupuesto",
      description: "Estima tus costos iniciales",
      route: "/tools/budget-calculator",
      color: "from-[hsl(var(--business))] to-green-600",
    },
    {
      icon: FileText,
      title: "Plan de Negocio",
      description: "Arma tu plan paso a paso",
      route: "/tools/business-plan",
      color: "from-[hsl(var(--accent-pink))] to-pink-600",
    },
  ];

  const nextSteps = [
    { completed: false, text: "Validar tu idea de negocio" },
    { completed: false, text: "Analizar el mercado y competencia" },
    { completed: false, text: "Definir tu presupuesto inicial" },
    { completed: false, text: "Crear tu plan de negocio" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container max-w-7xl">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 border-2">
              <CardHeader>
                <CardTitle className="text-3xl">
                  ¡Hola{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
                </CardTitle>
                <CardDescription className="text-lg">
                  Bienvenido a tu espacio de emprendedor. Acá vas a encontrar todo lo que necesitás para validar y lanzar tu idea.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Tu Progreso</CardTitle>
                    <CardDescription>
                      Completá los pasos para validar tu idea
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progreso general</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tools Grid */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Tus Herramientas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                          <CardHeader>
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => navigate(tool.route)}
                            >
                              Abrir herramienta
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Pasos</CardTitle>
                    <CardDescription>
                      Seguí esta guía para avanzar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${step.completed ? "text-muted-foreground line-through" : ""}`}>
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
