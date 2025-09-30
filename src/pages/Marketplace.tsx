import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, Phone, Mail, MapPin, Star, TrendingUp, Package, Truck, Factory } from "lucide-react";
import { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  verified: boolean;
  products: string[];
  icon: any;
  color: string;
}

const SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Distribuidora La Familia",
    category: "Alimentos y Bebidas",
    description: "Proveedor mayorista de productos de almacén y bebidas. Entrega en toda la provincia.",
    location: "San Luis Capital",
    phone: "+54 266 442-3456",
    email: "ventas@lafamilia.com.ar",
    rating: 4.8,
    verified: true,
    products: ["Bebidas", "Snacks", "Enlatados", "Lácteos"],
    icon: Package,
    color: "success"
  },
  {
    id: "2",
    name: "Insumos San Luis",
    category: "Insumos de Limpieza",
    description: "Productos de limpieza profesional para comercios. Precios mayoristas.",
    location: "Villa Mercedes",
    phone: "+54 266 445-7890",
    email: "contacto@insumossal.com",
    rating: 4.5,
    verified: true,
    products: ["Detergentes", "Desinfectantes", "Papel", "Escobas"],
    icon: Factory,
    color: "primary"
  },
  {
    id: "3",
    name: "Textil Puntano",
    category: "Textiles y Confección",
    description: "Mayorista de telas, uniformes y productos textiles. Fabricación local.",
    location: "San Luis Capital",
    phone: "+54 266 443-2109",
    email: "info@textilpuntano.com",
    rating: 4.6,
    verified: false,
    products: ["Telas", "Uniformes", "Bolsas", "Cortinas"],
    icon: Store,
    color: "warning"
  },
  {
    id: "4",
    name: "Logística Express SL",
    category: "Transporte y Logística",
    description: "Servicio de transporte y distribución para comercios. Envíos rápidos.",
    location: "San Luis Capital",
    phone: "+54 266 446-8901",
    email: "envios@logisticaexpresssl.com",
    rating: 4.9,
    verified: true,
    products: ["Envíos locales", "Distribución", "Paquetería", "Logística"],
    icon: Truck,
    color: "info"
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuppliers = SUPPLIERS.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <Store className="h-8 w-8 text-white" />
          </div>
          Marketplace B2B 🤝
        </h1>
        <p className="text-muted-foreground mt-2">
          Conectá con proveedores y emprendedores de San Luis
        </p>
      </div>

      {/* Search */}
      <Card className="border-2 overflow-hidden">
        <div className="h-1 bg-gradient-primary" />
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedores, categorías o productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <div className="h-1 bg-gradient-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-primary rounded-lg p-2">
                <Store className="h-5 w-5 text-white" />
              </div>
              Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {SUPPLIERS.length}+
            </div>
            <p className="text-sm text-muted-foreground">verificados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/30 bg-gradient-to-br from-success/5 to-success/10 overflow-hidden">
          <div className="h-1 bg-gradient-success" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-success rounded-lg p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              12+
            </div>
            <p className="text-sm text-muted-foreground">rubros disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10 overflow-hidden">
          <div className="h-1 bg-gradient-warm" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-warm rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Negocios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              50+
            </div>
            <p className="text-sm text-muted-foreground">conectados</p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Proveedores Destacados ({filteredSuppliers.length})
        </h2>
        {filteredSuppliers.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No se encontraron proveedores con esa búsqueda
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => {
              const Icon = supplier.icon;
              return (
                <Card
                  key={supplier.id}
                  className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`bg-gradient-${supplier.color} rounded-lg p-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {supplier.verified && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            ✓ Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{supplier.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <CardDescription className="text-base">
                      {supplier.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {supplier.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{supplier.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Productos:</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.products.map((product, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="gradient"
                        className="flex-1"
                        onClick={() => handleWhatsApp(supplier.phone)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Join CTA */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 overflow-hidden">
        <div className="h-1 bg-gradient-hero" />
        <CardContent className="py-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="text-5xl">🏪</div>
            <h3 className="text-2xl font-bold">¿Sos proveedor?</h3>
            <p className="text-muted-foreground text-lg">
              Sumá tu negocio al marketplace y conectá con decenas de emprendedores 
              que buscan proveedores confiables en San Luis.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="gradient" size="lg">
                <Store className="mr-2 h-5 w-5" />
                Registrar mi Negocio
              </Button>
              <Button variant="outline" size="lg">
                Más Información
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;
