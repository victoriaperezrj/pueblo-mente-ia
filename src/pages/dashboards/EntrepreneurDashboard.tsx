import { motion } from "framer-motion";
import { Lightbulb, Target, DollarSign, Users, Clock, Calculator, Grid3x3, Rocket, Search, FileText, Calendar, Beaker, Sparkles, TrendingUp, UserCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { EntrepreneurSidebar } from "@/components/entrepreneur/EntrepreneurSidebar";
import { StatCard } from "@/components/entrepreneur/StatCard";
import { ToolCard } from "@/components/entrepreneur/ToolCard";
import { QuickActionsBar } from "@/components/entrepreneur/QuickActionsBar";
import { StageSwitcherDropdown } from "@/components/layout/StageSwitcherDropdown";

export default function EntrepreneurDashboard() {
  const { profile } = useUser();

  const tools = [
    {
      id: 1,
      icon: Sparkles,
      title: "Market Test Express",
      description: "Análisis de viabilidad con GPT-4 en segundos",
      badge: "🔥 NEW AI",
      color: "from-blue-600 to-purple-600",
      route: "/validation/market-test",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Benchmark Automático",
      description: "Inteligencia competitiva con web scraping + GPT-4",
      badge: "AI",
      color: "from-emerald-600 to-teal-600",
      route: "/validation/benchmark",
    },
    {
      id: 3,
      icon: UserCircle,
      title: "Generador de Público",
      description: "Personas detalladas con avatares DALL-E 3",
      badge: "AI",
      color: "from-purple-600 to-pink-600",
      route: "/validation/target-audience",
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Validador de Ideas IA",
      description: "Modo Shark Tank: IA te hace 5 preguntas difíciles",
      badge: "Popular",
      color: "from-[hsl(var(--entrepreneur))] to-blue-600",
      route: "/entrepreneur/validation",
    },
    {
      id: 5,
      icon: Calculator,
      title: "Simulador Financiero",
      description: "Proyecciones en tiempo real con sliders interactivos",
      color: "from-green-500 to-emerald-600",
      route: "/entrepreneur/simulator",
    },
    {
      id: 6,
      icon: Grid3x3,
      title: "Lean Canvas IA",
      description: "Canvas pre-llenado con sugerencias inteligentes",
      color: "from-purple-500 to-purple-600",
      route: "/entrepreneur/lean-canvas",
    },
    {
      id: 7,
      icon: Rocket,
      title: "Generador de MVP",
      description: "Qué construir primero + timeline de 4 semanas",
      color: "from-orange-500 to-red-500",
      route: "/entrepreneur/mvp",
    },
    {
      id: 8,
      icon: Search,
      title: "Detective de Mercado",
      description: "Tamaño, competidores, tendencias automáticas",
      color: "from-cyan-500 to-blue-500",
      route: "/entrepreneur/market",
    },
    {
      id: 9,
      icon: FileText,
      title: "Pitch Deck Generator",
      description: "10 slides profesionales en 5 minutos",
      badge: "IA",
      color: "from-pink-500 to-rose-600",
      route: "/entrepreneur/pitch",
    },
    {
      id: 10,
      icon: Calendar,
      title: "Roadmap 90 días",
      description: "Timeline visual con milestones y confetti",
      color: "from-indigo-500 to-purple-600",
      route: "/entrepreneur/roadmap",
    },
    {
      id: 11,
      icon: Beaker,
      title: "Tracker de Experimentos",
      description: "Hipótesis, costos, resultados, learnings",
      color: "from-teal-500 to-cyan-600",
      route: "/entrepreneur/experiments",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen w-full bg-background"
    >
      {/* Sidebar */}
      <EntrepreneurSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with stage switcher */}
        <div className="px-8 py-4 bg-background border-b border-border flex justify-end">
          <StageSwitcherDropdown />
        </div>

        {/* Hero Section */}
        <section className="px-8 py-10 bg-gradient-to-br from-[hsl(var(--entrepreneur))]/5 via-background to-purple-500/5">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Bienvenido de vuelta,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--entrepreneur))] to-purple-600">
                  {profile?.full_name || "Emprendedor"}
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Tu idea está en etapa de validación. Seguí estos pasos.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Target}
                label="Validación"
                value="65%"
                trend="+12%"
                trendPositive={true}
                color="blue"
                delay={0.1}
              />
              <StatCard
                icon={DollarSign}
                label="Presupuesto usado"
                value="$2,500"
                subtitle="de $5,000"
                color="green"
                delay={0.2}
              />
              <StatCard
                icon={Users}
                label="Encuestas completadas"
                value="47"
                subtitle="Meta: 100"
                color="purple"
                delay={0.3}
              />
              <StatCard
                icon={Clock}
                label="Días desde inicio"
                value="23"
                subtitle="Meta: MVP en 67 días"
                color="orange"
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold mb-8"
            >
              Tus Herramientas
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  badge={tool.badge}
                  color={tool.color}
                  route={tool.route}
                  delay={0.6 + index * 0.05}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar />
      </div>
    </motion.div>
  );
}
