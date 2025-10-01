import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Clock, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Connection {
  id: string;
  requester_business_id: string;
  target_business_id: string;
  status: string;
  message: string | null;
  created_at: string;
  requester_business?: { name: string; location: string | null };
  target_business?: { name: string; location: string | null };
}

interface ConnectionsListProps {
  currentBusinessId: string;
}

export const ConnectionsList = ({ currentBusinessId }: ConnectionsListProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, [currentBusinessId]);

  const loadConnections = async () => {
    try {
      const { data, error } = await supabase
        .from("business_connections")
        .select(`
          id,
          requester_business_id,
          target_business_id,
          status,
          message,
          created_at,
          requester_business:businesses!business_connections_requester_business_id_fkey(name, location),
          target_business:businesses!business_connections_target_business_id_fkey(name, location)
        `)
        .or(`requester_business_id.eq.${currentBusinessId},target_business_id.eq.${currentBusinessId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error: any) {
      console.error("Error loading connections:", error);
      toast.error("No se pudieron cargar las conexiones");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from("business_connections")
        .update({ status: "accepted" })
        .eq("id", connectionId);

      if (error) throw error;
      
      toast.success("¡Conexión aceptada! Ahora pueden ver información de contacto mutua.");
      loadConnections();
    } catch (error: any) {
      toast.error("Error al aceptar: " + error.message);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from("business_connections")
        .update({ status: "rejected" })
        .eq("id", connectionId);

      if (error) throw error;
      
      toast.info("Conexión rechazada");
      loadConnections();
    } catch (error: any) {
      toast.error("Error al rechazar: " + error.message);
    }
  };

  const getOtherBusiness = (connection: Connection) => {
    const isRequester = connection.requester_business_id === currentBusinessId;
    return isRequester ? connection.target_business : connection.requester_business;
  };

  const isReceiver = (connection: Connection) => {
    return connection.target_business_id === currentBusinessId;
  };

  const pendingReceived = connections.filter(c => c.status === "pending" && isReceiver(c));
  const pendingSent = connections.filter(c => c.status === "pending" && !isReceiver(c));
  const accepted = connections.filter(c => c.status === "accepted");

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="received" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="received">
          Recibidas ({pendingReceived.length})
        </TabsTrigger>
        <TabsTrigger value="sent">
          Enviadas ({pendingSent.length})
        </TabsTrigger>
        <TabsTrigger value="connected">
          Conectados ({accepted.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="received" className="space-y-4">
        {pendingReceived.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No hay solicitudes pendientes</p>
          </Card>
        ) : (
          pendingReceived.map((connection) => {
            const otherBusiness = getOtherBusiness(connection);
            return (
              <Card key={connection.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{otherBusiness?.name}</span>
                    <Badge variant="outline">Pendiente</Badge>
                  </CardTitle>
                  <CardDescription>
                    {otherBusiness?.location || "Sin ubicación"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connection.message && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm italic">"{connection.message}"</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAccept(connection.id)}
                      className="flex-1 gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Aceptar
                    </Button>
                    <Button 
                      onClick={() => handleReject(connection.id)}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Rechazar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </TabsContent>

      <TabsContent value="sent" className="space-y-4">
        {pendingSent.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No hay solicitudes enviadas pendientes</p>
          </Card>
        ) : (
          pendingSent.map((connection) => {
            const otherBusiness = getOtherBusiness(connection);
            return (
              <Card key={connection.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{otherBusiness?.name}</span>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Esperando respuesta
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {otherBusiness?.location || "Sin ubicación"}
                  </CardDescription>
                </CardHeader>
                {connection.message && (
                  <CardContent>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">Tu mensaje: <em>"{connection.message}"</em></p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </TabsContent>

      <TabsContent value="connected" className="space-y-4">
        {accepted.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No hay conexiones aceptadas aún</p>
          </Card>
        ) : (
          accepted.map((connection) => {
            const otherBusiness = getOtherBusiness(connection);
            return (
              <Card key={connection.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{otherBusiness?.name}</span>
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {otherBusiness?.location || "Sin ubicación"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ahora pueden compartir información de contacto
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Ver Contacto
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </TabsContent>
    </Tabs>
  );
};
