import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, Store, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoSelectRole() {
  const stages = [
    {
      id: "entrepreneur",
      title: "Emprendedor",
      description: "Tengo una idea pero no la he bajado a tierra",
      icon: Lightbulb,
      color: "from-[hsl(var(--entrepreneur))] to-blue-600",
      route: "/demo/entrepreneur-dashboard",
    },
    {
      id: "business",
      title: "Negocio",
      description: "Ya tengo un negocio funcionando",
      icon: Store,
      color: "from-[hsl(var(--business))] to-green-600",
      route: "/demo/business-dashboard",
    },
    {
      id: "pyme",
      title: "PyME",
      description: "Tengo una empresa con equipo",
      icon: Building2,
      color: "from-[hsl(var(--pyme))] to-purple-600",
      route: "/demo/company-dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-16">
        <Button
          variant="ghost"
          asChild
          className="mb-8"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Elegí tu etapa
          </h1>
          <p className="text-xl text-muted-foreground">
            Explorá el dashboard de cada tipo de usuario
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <Link to={stage.route}>
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
                        Ver Dashboard Demo
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
