import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Database, Link as LinkIcon, Zap, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Integrations = () => {
  const integrations = [
    {
      name: "SAP Business One",
      description: "Integración completa con SAP para sincronización de inventario, ventas y finanzas",
      icon: Building2,
      category: "ERP Enterprise",
      status: "enterprise",
      features: ["Sincronización bidireccional", "Tiempo real", "Múltiples subsidiarias"],
    },
    {
      name: "Oracle NetSuite",
      description: "Conecta con Oracle NetSuite para gestión financiera y operacional avanzada",
      icon: Database,
      category: "Cloud ERP",
      status: "enterprise",
      features: ["Contabilidad avanzada", "Reportes personalizados", "Multi-moneda"],
    },
    {
      name: "Microsoft Dynamics 365",
      description: "Integración con Dynamics 365 Business Central para gestión empresarial",
      icon: Building2,
      category: "ERP Microsoft",
      status: "enterprise",
      features: ["CRM + ERP", "Power BI", "Azure integrado"],
    },
    {
      name: "APIs Personalizadas",
      description: "Conectá tu sistema con nosotros usando tecnología REST",
      icon: LinkIcon,
      category: "Integración Custom",
      status: "business",
      features: ["Webhooks", "API REST", "Autenticación OAuth"],
    },
    {
      name: "Automatizaciones Zapier",
      description: "Conecta con más de 5,000 aplicaciones mediante Zapier",
      icon: Zap,
      category: "Automatización",
      status: "business",
      features: ["5000+ apps", "Workflows", "Triggers automáticos"],
    },
    {
      name: "Conectores Seguros",
      description: "Infraestructura de conectores con encriptación end-to-end",
      icon: Lock,
      category: "Seguridad",
      status: "enterprise",
      features: ["TLS 1.3", "Vault integrado", "Auditoría completa"],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-l-4 border-primary bg-primary/5 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          🔌 Integraciones Enterprise
        </h1>
        <p className="text-muted-foreground">
          Conectá con otros programas que ya usás. 
          <span className="font-semibold text-foreground"> Disponible en planes Business y Enterprise.</span>
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span>Próximamente: Capa 3 - Integraciones Empresariales</span>
          </CardTitle>
          <CardDescription className="text-base">
            Estamos desarrollando conectores robustos para los principales sistemas ERP y CRM del mercado. 
            Las integraciones estarán disponibles en <span className="font-semibold">Q2 2025</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, idx) => {
          const Icon = integration.icon;
          return (
            <Card 
              key={integration.name}
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={integration.status === "enterprise" ? "default" : "secondary"}>
                    {integration.status === "enterprise" ? "Enterprise" : "Business"}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{integration.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {integration.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Características:</p>
                  <ul className="space-y-1">
                    {integration.features.map((feature) => (
                      <li key={feature} className="text-xs flex items-center gap-2">
                        <span className="text-success">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      disabled
                    >
                      Solicitar Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Demo de {integration.name}</DialogTitle>
                      <DialogDescription className="space-y-4 pt-4">
                        <p>
                          Las integraciones Enterprise estarán disponibles próximamente. 
                          Podés contactarnos para recibir más información sobre:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span>
                            Capacidades de integración específicas
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span>
                            Tiempos de implementación
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span>
                            Precios del plan Enterprise
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span>
                            Soporte dedicado
                          </li>
                        </ul>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Contacto Enterprise</p>
                          <p className="text-sm text-muted-foreground">
                            📧 contacto@proyectoemprendedurismo.ar<br />
                            📞 +54 9 266 XXX-XXXX
                          </p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>¿Por qué Integraciones Enterprise?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Las integraciones enterprise te permiten conectar todos tus sistemas en un solo lugar.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">🔄 Sincronización Automática</h4>
              <p className="text-xs text-muted-foreground">
                Datos actualizados en tiempo real entre todos tus sistemas
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">🔒 Seguridad Enterprise</h4>
              <p className="text-xs text-muted-foreground">
                Encriptación end-to-end y cumplimiento normativo
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">📊 Reportes Unificados</h4>
              <p className="text-xs text-muted-foreground">
                Vista consolidada de todos tus sistemas en un solo lugar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
