import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, MapPin, Phone, Mail, Star, Package, Plus, ShoppingCart, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newListing, setNewListing] = useState({
    product_name: "",
    description: "",
    category: "",
    price_per_unit: "",
    min_quantity: "",
    location: "",
  });
  const [newRequest, setNewRequest] = useState({
    product_needed: "",
    quantity: "",
    max_budget: "",
    deadline: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user's business
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: businesses } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);
        
        if (businesses && businesses.length > 0) {
          setBusinessId(businesses[0].id);
        }
      }

      // Load listings
      const { data: listingsData } = await supabase
        .from("marketplace_listings")
        .select("*, businesses(name)")
        .eq("active", true)
        .order("created_at", { ascending: false });
      
      setListings(listingsData || []);

      // Load requests
      const { data: requestsData } = await supabase
        .from("marketplace_requests")
        .select("*, businesses(name)")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      
      setRequests(requestsData || []);
    } catch (error) {
      console.error("Error loading marketplace data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "No se encontró tu negocio",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .insert({
          seller_business_id: businessId,
          ...newListing,
          price_per_unit: parseFloat(newListing.price_per_unit),
          min_quantity: parseInt(newListing.min_quantity),
        });

      if (error) throw error;

      toast({
        title: "¡Publicación creada!",
        description: "Tu producto está ahora visible en el marketplace",
      });

      setNewListing({
        product_name: "",
        description: "",
        category: "",
        price_per_unit: "",
        min_quantity: "",
        location: "",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateRequest = async () => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "No se encontró tu negocio",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("marketplace_requests")
        .insert({
          buyer_business_id: businessId,
          ...newRequest,
          quantity: parseInt(newRequest.quantity),
          max_budget: parseFloat(newRequest.max_budget),
        });

      if (error) throw error;

      toast({
        title: "¡Solicitud publicada!",
        description: "Los proveedores pueden ver ahora tu solicitud",
      });

      setNewRequest({
        product_needed: "",
        quantity: "",
        max_budget: "",
        deadline: "",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">🤝 Marketplace B2B San Luis</h1>
        <p className="text-muted-foreground">
          Conectá con proveedores y clientes locales - Comprá y vendé al por mayor
        </p>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings">📦 Publicaciones ({listings.length})</TabsTrigger>
          <TabsTrigger value="requests">🛒 Solicitudes ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Publicación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publicar Producto/Servicio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre del Producto</Label>
                    <Input
                      value={newListing.product_name}
                      onChange={(e) => setNewListing({ ...newListing, product_name: e.target.value })}
                      placeholder="Ej: Harina 000 Premium"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      placeholder="Describe tu producto..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Categoría</Label>
                      <Input
                        value={newListing.category}
                        onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                        placeholder="Ej: Alimentos"
                      />
                    </div>
                    <div>
                      <Label>Ubicación</Label>
                      <Input
                        value={newListing.location}
                        onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                        placeholder="San Luis"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Precio por Unidad ($)</Label>
                      <Input
                        type="number"
                        value={newListing.price_per_unit}
                        onChange={(e) => setNewListing({ ...newListing, price_per_unit: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cantidad Mínima</Label>
                      <Input
                        type="number"
                        value={newListing.min_quantity}
                        onChange={(e) => setNewListing({ ...newListing, min_quantity: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateListing} className="w-full">
                    Publicar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings
              .filter((listing) =>
                listing.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{listing.product_name}</span>
                      <Badge>{listing.category}</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Por: {listing.businesses?.name || "Vendedor"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{listing.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${parseFloat(listing.price_per_unit || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mín: {listing.min_quantity} unidades
                        </p>
                      </div>
                      <Button size="sm">Contactar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {listings.length === 0 && (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay publicaciones aún. ¡Sé el primero en publicar!
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Nueva Solicitud
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Producto/Servicio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>¿Qué necesitás?</Label>
                    <Input
                      value={newRequest.product_needed}
                      onChange={(e) => setNewRequest({ ...newRequest, product_needed: e.target.value })}
                      placeholder="Ej: Envases plásticos 500ml"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        value={newRequest.quantity}
                        onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Presupuesto Máx ($)</Label>
                      <Input
                        type="number"
                        value={newRequest.max_budget}
                        onChange={(e) => setNewRequest({ ...newRequest, max_budget: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Fecha Límite</Label>
                    <Input
                      type="date"
                      value={newRequest.deadline}
                      onChange={(e) => setNewRequest({ ...newRequest, deadline: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateRequest} className="w-full">
                    Publicar Solicitud
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{request.product_needed}</CardTitle>
                  <CardDescription className="text-xs">
                    Solicitado por: {request.businesses?.name || "Comprador"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span className="font-semibold">{request.quantity} unidades</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Presupuesto:</span>
                    <span className="font-semibold text-success">
                      ${parseFloat(request.max_budget || 0).toFixed(2)}
                    </span>
                  </div>
                  {request.deadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fecha límite:</span>
                      <span>{new Date(request.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4">
                    Ofertar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {requests.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay solicitudes activas. ¡Creá la primera!
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
