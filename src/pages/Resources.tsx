import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, FileText, Video, Download, ExternalLink, TrendingUp, Users, DollarSign, Scale } from "lucide-react";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "template" | "guide";
  category: string;
  icon: any;
  color: string;
  gradient: string;
}

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Cómo calcular el precio de venta",
    description: "Guía completa para establecer precios rentables en tu negocio",
    type: "guide",
    category: "Finanzas",
    icon: DollarSign,
    color: "success",
    gradient: "from-success/10 to-success/5"
  },
  {
    id: "2",
    title: "Marketing digital para emprendedores",
    description: "Estrategias efectivas de redes sociales para pequeños negocios",
    type: "article",
    category: "Marketing",
    icon: TrendingUp,
    color: "warning",
    gradient: "from-warning/10 to-warning/5"
  },
  {
    id: "3",
    title: "Atención al cliente efectiva",
    description: "Técnicas para fidelizar clientes y generar recomendaciones",
    type: "video",
    category: "Ventas",
    icon: Users,
    color: "primary",
    gradient: "from-primary/10 to-primary/5"
  },
  {
    id: "4",
    title: "Obligaciones fiscales en San Luis",
    description: "Resumen de impuestos y regulaciones para emprendedores",
    type: "template",
    category: "Legal",
    icon: Scale,
    color: "info",
    gradient: "from-info/10 to-info/5"
  },
  {
    id: "5",
    title: "Control de stock: mejores prácticas",
    description: "Cómo evitar quiebres de stock y optimizar tu inventario",
    type: "guide",
    category: "Operaciones",
    icon: FileText,
    color: "secondary",
    gradient: "from-secondary/10 to-secondary/5"
  },
  {
    id: "6",
    title: "Plan de negocios simple",
    description: "Plantilla editable para estructurar tu emprendimiento",
    type: "template",
    category: "Planificación",
    icon: FileText,
    color: "accent",
    gradient: "from-accent/10 to-accent/5"
  },
];

const TYPE_LABELS = {
  article: "Artículo",
  video: "Video",
  template: "Plantilla",
  guide: "Guía"
};

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = RESOURCES.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          Recursos 📚
        </h1>
        <p className="text-muted-foreground mt-2">
          Biblioteca de contenido para potenciar tu negocio
        </p>
      </div>

      {/* Search */}
      <Card className="border-2 overflow-hidden">
        <div className="h-1 bg-gradient-primary" />
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos por tema, categoría o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 overflow-hidden">
        <div className="h-1 bg-gradient-hero" />
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Destacado del Mes
          </CardTitle>
          <CardDescription>
            Recurso más relevante para emprendedores de San Luis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-bold">
            Cómo validar tu idea de negocio antes de invertir
          </h3>
          <p className="text-muted-foreground">
            Descubrí las técnicas y herramientas que usan los emprendedores exitosos para 
            validar sus ideas antes de comprometer recursos. Incluye casos de éxito locales 
            y ejercicios prácticos.
          </p>
          <div className="flex gap-3">
            <Button variant="gradient" size="lg">
              <Video className="mr-2 h-5 w-5" />
              Ver Video (12 min)
            </Button>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Descargar Guía
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Todos los Recursos ({filteredResources.length})
        </h2>
        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No se encontraron recursos con esa búsqueda
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
                >
                  <div className={`h-1 bg-gradient-${resource.color}`} />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary">
                        {TYPE_LABELS[resource.type]}
                      </Badge>
                      <div className={`bg-gradient-to-br ${resource.gradient} rounded-lg p-2`}>
                        <Icon className={`h-5 w-5 text-${resource.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      {resource.type === "template" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories */}
      <Card className="border-2 overflow-hidden">
        <div className="h-1 bg-gradient-success" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-success rounded-lg p-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Categorías Populares
          </CardTitle>
          <CardDescription>
            Explorá recursos por temática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["Finanzas", "Marketing", "Ventas", "Legal", "Operaciones", "Planificación"].map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm py-2 px-4"
                onClick={() => setSearchQuery(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10 overflow-hidden">
        <div className="h-1 bg-gradient-warm" />
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="text-4xl">💡</div>
            <h3 className="text-xl font-bold">¿No encontrás lo que buscás?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Contactanos y contanos qué tipo de contenido te gustaría ver. 
              Estamos constantemente agregando nuevos recursos basados en las necesidades 
              de la comunidad emprendedora de San Luis.
            </p>
            <Button variant="gradient" size="lg">
              Sugerir Recurso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
