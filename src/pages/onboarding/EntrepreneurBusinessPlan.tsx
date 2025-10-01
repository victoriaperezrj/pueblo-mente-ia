import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowLeft, FileDown, Save } from "lucide-react";
import { toast } from "sonner";
import { AccordionTask } from "@/components/entrepreneur/AccordionTask";
import { EquipmentTable } from "@/components/entrepreneur/EquipmentTable";
import { Accordion } from "@/components/ui/accordion";

interface BusinessIdea {
  id: string;
  idea_description: string;
  industry: string;
  location: string;
  validation_result: {
    monthly_revenue: number;
    investment_range: { min: number; max: number };
  };
}

interface TaskProgress {
  [key: string]: boolean;
}

export default function EntrepreneurBusinessPlan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get("ideaId");
  
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [progress, setProgress] = useState<TaskProgress>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("resumen");

  const sections = [
    { id: "resumen", label: "Resumen" },
    { id: "semana1", label: "Semana 1: Habilitaciones" },
    { id: "semana2", label: "Semana 2: Proveedores y Financiación" },
    { id: "semana3", label: "Semana 3: Equipamiento y Local" },
    { id: "semana4", label: "Semana 4: Marketing Pre-Lanzamiento" },
    { id: "recursos", label: "Recursos Adicionales" },
  ];

  useEffect(() => {
    if (!ideaId) {
      navigate("/dashboard");
      return;
    }
    loadData();
  }, [ideaId]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: ideaData, error: ideaError } = await supabase
        .from("business_ideas")
        .select("*")
        .eq("id", ideaId)
        .eq("user_id", user.id)
        .single();

      if (ideaError || !ideaData) {
        toast.error("Idea de negocio no encontrada");
        navigate("/dashboard");
        return;
      }

      setIdea({
        ...ideaData,
        validation_result: ideaData.validation_result as any,
      } as BusinessIdea);

      const { data: progressData } = await supabase
        .from("business_plan_progress")
        .select("task_id, completed")
        .eq("idea_id", ideaId);

      const progressMap: TaskProgress = {};
      progressData?.forEach((item) => {
        progressMap[item.task_id] = item.completed;
      });
      setProgress(progressMap);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const newValue = !progress[taskId];
    
    try {
      await supabase.from("business_plan_progress").upsert({
        idea_id: ideaId,
        task_id: taskId,
        completed: newValue,
        completed_at: newValue ? new Date().toISOString() : null,
      });

      setProgress({ ...progress, [taskId]: newValue });
      toast.success(newValue ? "Tarea completada" : "Tarea marcada como pendiente");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Error al actualizar el progreso");
    }
  };

  const calculateProgress = () => {
    const total = Object.keys(allTasks).length;
    const completed = Object.values(progress).filter(Boolean).length;
    return { percentage: Math.round((completed / total) * 100), completed, total };
  };

  const allTasks = {
    // Semana 1
    afip_monotributo: "AFIP - Inscripción Monotributo",
    habilitacion_bromatologica: "Habilitación Bromatológica",
    arba_ingresos_brutos: "ARBA - Ingresos Brutos",
    matricula_municipal: "Matrícula Municipal",
    // Semana 2
    proveedor_principal: "Proveedor Principal",
    financiacion_banco: "Financiación Bancaria",
    proveedor_secundario: "Proveedores Secundarios",
    // Semana 3
    equipamiento_principal: "Equipamiento Principal",
    equipamiento_secundario: "Equipamiento Secundario",
    local_contrato: "Contrato de Local",
    // Semana 4
    instagram: "Crear Instagram",
    logo: "Diseñar Logo",
    volantes: "Volantes del Barrio",
    promocion_lanzamiento: "Promoción de Lanzamiento",
    lista_espera: "Lista de Espera",
  };

  const progressStats = calculateProgress();

  const SidebarContent = () => (
    <div className="py-6 px-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Navegación</h2>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            activeSection === section.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg lg:text-xl font-bold">
              Plan de Negocio: {idea.industry}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Guardado automático
            </Button>
          </div>
        </div>
        <div className="container pb-3">
          <div className="flex items-center gap-4">
            <Progress value={progressStats.percentage} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {progressStats.percentage}% completado ({progressStats.completed}/{progressStats.total} tareas)
            </span>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 py-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-24">
            <SidebarContent />
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/onboarding/entrepreneur/results?ideaId=${ideaId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Resultados
          </Button>

          {/* Resumen Ejecutivo */}
          {activeSection === "resumen" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Resumen Ejecutivo</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-muted-foreground">Tu Idea</h3>
                  <p>{idea.idea_description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Inversión Total</h3>
                  <p className="text-2xl font-bold">
                    ${(idea.validation_result.investment_range.min / 1000000).toFixed(1)}M - $
                    {(idea.validation_result.investment_range.max / 1000000).toFixed(1)}M ARS
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Timeline</h3>
                  <p>4 semanas hasta apertura</p>
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">ROI Proyectado</h3>
                  <p>Break-even en 8-12 meses</p>
                </div>
              </div>
            </Card>
          )}

          {/* Semana 1 - Habilitaciones */}
          {activeSection === "semana1" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Semana 1: Habilitaciones</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionTask
                  value="afip"
                  title="AFIP - Inscripción Monotributo"
                  completed={progress.afip_monotributo}
                  onToggle={() => toggleTask("afip_monotributo")}
                  cost={0}
                  time="2 horas"
                  description="Inscribite en AFIP como monotributista. Categoría sugerida según tus ingresos proyectados."
                  resources={[
                    { type: "link", label: "Ir a AFIP", url: "https://www.afip.gob.ar" },
                    { type: "docs", label: "Documentos necesarios", items: ["DNI", "CUIL", "Comprobante de domicilio"] },
                  ]}
                />
                <AccordionTask
                  value="bromatologia"
                  title="Habilitación Bromatológica"
                  completed={progress.habilitacion_bromatologica}
                  onToggle={() => toggleTask("habilitacion_bromatologica")}
                  cost={45000}
                  time="5-7 días hábiles"
                  description="Para gastronomía en San Luis. La municipalidad inspecciona las instalaciones."
                  requirements={[
                    "Local con ventilación adecuada",
                    "Pileta de lavado",
                    "Baño para empleados",
                    "Matafuegos reglamentarios",
                  ]}
                />
                <AccordionTask
                  value="arba"
                  title="ARBA - Ingresos Brutos"
                  completed={progress.arba_ingresos_brutos}
                  onToggle={() => toggleTask("arba_ingresos_brutos")}
                  cost={0}
                  time="3-5 días hábiles"
                  description="Inscripción en Ingresos Brutos de la provincia."
                  resources={[
                    { type: "link", label: "Ir a ARBA", url: "https://www.arba.gob.ar" },
                  ]}
                />
                <AccordionTask
                  value="municipal"
                  title="Matrícula Municipal"
                  completed={progress.matricula_municipal}
                  onToggle={() => toggleTask("matricula_municipal")}
                  cost={25000}
                  time="7-10 días hábiles"
                  description="Habilitación municipal para operar comercialmente."
                />
              </Accordion>
            </Card>
          )}

          {/* Semana 2 - Proveedores */}
          {activeSection === "semana2" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Semana 2: Proveedores y Financiación</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionTask
                  value="proveedor1"
                  title="Proveedor Principal: Molino San Luis"
                  completed={progress.proveedor_principal}
                  onToggle={() => toggleTask("proveedor_principal")}
                  description="Proveedor de harina 0000 y harina integral de alta calidad."
                  supplierInfo={{
                    contact: "Juan Pérez - 2664-XXXXX",
                    price: "$850/kg (MOQ: 100kg)",
                    payment: "30 días",
                  }}
                />
                <AccordionTask
                  value="financiacion"
                  title="Financiación: Banco San Juan"
                  completed={progress.financiacion_banco}
                  onToggle={() => toggleTask("financiacion_banco")}
                  description="Crédito PYMES 0% (programa provincial)"
                  loanInfo={{
                    amount: "$10M ARS",
                    term: "24 meses",
                    requirements: ["Monotributo activo", "Proyecto presentado"],
                  }}
                />
                <AccordionTask
                  value="proveedor2"
                  title="Proveedores Secundarios"
                  completed={progress.proveedor_secundario}
                  onToggle={() => toggleTask("proveedor_secundario")}
                  description="Contactar proveedores de insumos secundarios (levadura, sal, envases)."
                />
              </Accordion>
            </Card>
          )}

          {/* Semana 3 - Equipamiento */}
          {activeSection === "semana3" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Semana 3: Equipamiento y Local</h2>
              <EquipmentTable
                onToggle={(taskId) => toggleTask(taskId)}
                progress={progress}
              />
            </Card>
          )}

          {/* Semana 4 - Marketing */}
          {activeSection === "semana4" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Semana 4: Marketing Pre-Lanzamiento</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionTask
                  value="instagram"
                  title="Crear página de Instagram"
                  completed={progress.instagram}
                  onToggle={() => toggleTask("instagram")}
                  description="Crear perfil profesional y hacer 10 posts de 'próximamente'."
                />
                <AccordionTask
                  value="logo"
                  title="Diseñar Logo"
                  completed={progress.logo}
                  onToggle={() => toggleTask("logo")}
                  description="Crear identidad visual del negocio."
                  resources={[
                    { type: "link", label: "Template en Canva", url: "https://www.canva.com" },
                  ]}
                />
                <AccordionTask
                  value="volantes"
                  title="Volantes para el barrio"
                  completed={progress.volantes}
                  onToggle={() => toggleTask("volantes")}
                  description="Diseñar e imprimir volantes para distribución local."
                />
                <AccordionTask
                  value="promocion"
                  title="Promoción de lanzamiento: primera semana 2x1"
                  completed={progress.promocion_lanzamiento}
                  onToggle={() => toggleTask("promocion_lanzamiento")}
                  description="Planificar promoción especial de apertura."
                />
                <AccordionTask
                  value="lista"
                  title="Lista de espera de clientes"
                  completed={progress.lista_espera}
                  onToggle={() => toggleTask("lista_espera")}
                  description="Crear lista de clientes interesados antes de la apertura."
                />
              </Accordion>
            </Card>
          )}

          {/* Recursos Adicionales */}
          {activeSection === "recursos" && (
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Recursos Adicionales</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">📚</div>
                    <h3 className="font-semibold mb-2">Biblioteca de Templates</h3>
                    <p className="text-sm text-muted-foreground">
                      Contratos, formularios y documentos listos para usar
                    </p>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">🎓</div>
                    <h3 className="font-semibold mb-2">Cursos Gratuitos</h3>
                    <p className="text-sm text-muted-foreground">
                      Videos tutoriales sobre gestión de negocios
                    </p>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">👥</div>
                    <h3 className="font-semibold mb-2">Comunidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Forum de emprendedores del mismo rubro
                    </p>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">💬</div>
                    <h3 className="font-semibold mb-2">Consultar con IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Asistente virtual para responder tus dudas
                    </p>
                  </Card>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Próximos Pasos</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => navigate(`/financial-simulator?ideaId=${ideaId}`)}
                  >
                    Simular Escenarios Financieros →
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => navigate(`/onboarding/entrepreneur/step1`)}
                  >
                    Ajustar mi Idea
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
