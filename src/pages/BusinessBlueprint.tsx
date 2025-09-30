import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, CheckCircle, Loader2, Sparkles, Target, Users, DollarSign, TrendingUp, Package, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Blueprint {
  businessModel: {
    valueProposition: string;
    targetCustomers: string[];
    channels: string[];
    revenueStreams: string[];
  };
  operations: {
    keyActivities: string[];
    keyResources: string[];
    keyPartners: string[];
  };
  financial: {
    initialInvestment: string;
    monthlyCosts: string;
    breakEvenPoint: string;
    projectedRevenue: string;
  };
  marketing: {
    strategies: string[];
    budget: string;
    kpis: string[];
  };
  timeline: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
}

const BusinessBlueprint = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setLoading(true);
    setProgress(0);

    // Simulate AI generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      const mockBlueprint: Blueprint = {
        businessModel: {
          valueProposition: "Productos de panadería artesanal, frescos y saludables, con opciones sin gluten y veganas, entregados el mismo día.",
          targetCustomers: [
            "Familias health-conscious de 30-50 años",
            "Personas con intolerancias alimentarias",
            "Consumidores de productos premium locales",
            "Oficinas que buscan catering saludable"
          ],
          channels: [
            "Tienda física en zona céntrica",
            "Delivery propio (WhatsApp/Web)",
            "Instagram y Facebook para pedidos",
            "Acuerdos con cafeterías locales"
          ],
          revenueStreams: [
            "Venta directa de productos al consumidor final",
            "Pedidos mayoristas a cafeterías",
            "Catering para eventos corporativos",
            "Suscripción mensual de productos selectos"
          ]
        },
        operations: {
          keyActivities: [
            "Producción diaria de pan y productos",
            "Control de calidad de materias primas",
            "Gestión de pedidos y delivery",
            "Marketing en redes sociales",
            "Atención al cliente y postventa"
          ],
          keyResources: [
            "Horno industrial profesional",
            "Local con habilitación comercial",
            "Maestro panadero con experiencia",
            "Sistema de pedidos online",
            "Vehículo para delivery"
          ],
          keyPartners: [
            "Proveedores de harinas especiales",
            "Distribuidores de insumos locales",
            "Plataforma de pagos digitales",
            "Diseñador gráfico para marketing",
            "Contador para temas impositivos"
          ]
        },
        financial: {
          initialInvestment: "$800.000 - $1.200.000",
          monthlyCosts: "$250.000 - $350.000 (alquiler, sueldos, insumos, servicios)",
          breakEvenPoint: "6-8 meses con ventas de $400.000/mes",
          projectedRevenue: "Año 1: $4.8M | Año 2: $7.2M | Año 3: $10.5M"
        },
        marketing: {
          strategies: [
            "Lanzamiento con degustaciones gratuitas",
            "Contenido en redes (proceso de elaboración)",
            "Alianzas con influencers locales saludables",
            "Promociones para primeros clientes",
            "Programa de referidos con descuentos",
            "Email marketing con recetas y ofertas"
          ],
          budget: "$50.000 mensuales (primeros 6 meses)",
          kpis: [
            "Nuevos clientes por mes: 150-200",
            "Tasa de retención: >60%",
            "Ticket promedio: $2.500",
            "Engagement en redes: >5%"
          ]
        },
        timeline: [
          {
            phase: "Preparación y Setup",
            duration: "Mes 1-2",
            milestones: [
              "Obtener habilitaciones municipales",
              "Acondicionar local y comprar equipamiento",
              "Contratar personal clave",
              "Desarrollar recetas y hacer pruebas"
            ]
          },
          {
            phase: "Lanzamiento Soft",
            duration: "Mes 3",
            milestones: [
              "Apertura con familiares y amigos",
              "Ajustar procesos operativos",
              "Recopilar feedback inicial",
              "Activar redes sociales"
            ]
          },
          {
            phase: "Lanzamiento Público",
            duration: "Mes 4",
            milestones: [
              "Campaña de marketing de apertura",
              "Activar delivery y pedidos online",
              "Buscar primeras alianzas B2B",
              "Medir métricas clave"
            ]
          },
          {
            phase: "Crecimiento",
            duration: "Mes 5-12",
            milestones: [
              "Optimizar operaciones",
              "Expandir línea de productos",
              "Consolidar alianzas estratégicas",
              "Alcanzar punto de equilibrio"
            ]
          }
        ]
      };

      setBlueprint(mockBlueprint);
      setLoading(false);
      
      toast({
        title: "✓ Blueprint generado",
        description: "Tu plan de negocio está listo",
      });
    }, 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <FileText className="h-8 w-8 text-white" />
          </div>
          Business Blueprint 📋
        </h1>
        <p className="text-muted-foreground mt-2">
          Plan de negocio completo generado con IA
        </p>
      </div>

      {!blueprint ? (
        <Card className="border-2 overflow-hidden">
          <div className="h-1 bg-gradient-hero" />
          <CardContent className="py-16">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="bg-gradient-primary rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-3">
                  Generá tu Plan de Negocio Completo
                </h2>
                <p className="text-muted-foreground text-lg">
                  Nuestra IA creará un blueprint detallado con modelo de negocio, estrategia financiera, 
                  plan de marketing y timeline de implementación.
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-lg font-medium">Generando tu blueprint...</span>
                  </div>
                  <Progress value={progress} className="h-3 max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {progress < 30 && "Analizando mercado..."}
                    {progress >= 30 && progress < 60 && "Calculando proyecciones financieras..."}
                    {progress >= 60 && progress < 90 && "Creando estrategia de marketing..."}
                    {progress >= 90 && "Finalizando documento..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    {[
                      { icon: Target, text: "Modelo de negocio Canvas" },
                      { icon: DollarSign, text: "Proyecciones financieras" },
                      { icon: TrendingUp, text: "Estrategia de marketing" },
                      { icon: Calendar, text: "Timeline de implementación" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleGenerate}
                    variant="gradient"
                    size="lg"
                    className="mt-4"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generar Blueprint con IA
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Basado en tu perfil de negocio actual
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="gradient" size="sm" onClick={() => setBlueprint(null)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Nuevo
            </Button>
          </div>

          <Tabs defaultValue="model" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="model">Modelo</TabsTrigger>
              <TabsTrigger value="operations">Operaciones</TabsTrigger>
              <TabsTrigger value="financial">Finanzas</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Business Model */}
            <TabsContent value="model" className="space-y-6">
              <Card className="border-2 overflow-hidden">
                <div className="h-1 bg-gradient-primary" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Propuesta de Valor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{blueprint.businessModel.valueProposition}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      Clientes Objetivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {blueprint.businessModel.targetCustomers.map((customer, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{customer}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-warning" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5" />
                      Canales de Distribución
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {blueprint.businessModel.channels.map((channel, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{channel}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 overflow-hidden">
                <div className="h-1 bg-gradient-primary" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Fuentes de Ingreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {blueprint.businessModel.revenueStreams.map((stream, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{stream}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Operations */}
            <TabsContent value="operations" className="space-y-6">
              <Card className="border-2 overflow-hidden">
                <div className="h-1 bg-gradient-primary" />
                <CardHeader>
                  <CardTitle>Actividades Clave</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {blueprint.operations.keyActivities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle className="text-lg">Recursos Necesarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {blueprint.operations.keyResources.map((resource, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Package className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-warning" />
                  <CardHeader>
                    <CardTitle className="text-lg">Socios Estratégicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {blueprint.operations.keyPartners.map((partner, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{partner}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial */}
            <TabsContent value="financial" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/30 overflow-hidden">
                  <div className="h-1 bg-gradient-primary" />
                  <CardHeader>
                    <CardTitle>Inversión Inicial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {blueprint.financial.initialInvestment}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-warning/30 overflow-hidden">
                  <div className="h-1 bg-gradient-warm" />
                  <CardHeader>
                    <CardTitle>Costos Mensuales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {blueprint.financial.monthlyCosts}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-success/30 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle>Punto de Equilibrio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{blueprint.financial.breakEvenPoint}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-info/30 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle>Proyección de Ingresos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{blueprint.financial.projectedRevenue}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Marketing */}
            <TabsContent value="marketing" className="space-y-6">
              <Card className="border-2 overflow-hidden">
                <div className="h-1 bg-gradient-primary" />
                <CardHeader>
                  <CardTitle>Estrategias de Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {blueprint.marketing.strategies.map((strategy, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle>Presupuesto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{blueprint.marketing.budget}</div>
                  </CardContent>
                </Card>

                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-warning" />
                  <CardHeader>
                    <CardTitle>KPIs a Medir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {blueprint.marketing.kpis.map((kpi, idx) => (
                        <li key={idx} className="text-sm">{kpi}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="space-y-6">
              {blueprint.timeline.map((phase, idx) => (
                <Card key={idx} className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-primary" />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{phase.phase}</CardTitle>
                        <CardDescription>{phase.duration}</CardDescription>
                      </div>
                      <Badge variant="secondary">Fase {idx + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {phase.milestones.map((milestone, midx) => (
                        <li key={midx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default BusinessBlueprint;
