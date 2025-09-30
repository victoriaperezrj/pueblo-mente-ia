import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Building2, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      setFullName(user.user_metadata?.full_name || "");

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load first business
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .limit(1)
        .single();

      if (businessData) {
        setBusiness(businessData);
        setBusinessName(businessData.name);
        setBusinessType(businessData.business_type || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      toast({
        title: "✓ Perfil actualizado",
        description: "Tus cambios se guardaron correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!business) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          name: businessName,
        })
        .eq("id", business.id);

      if (error) throw error;

      toast({
        title: "✓ Negocio actualizado",
        description: "Los cambios se guardaron correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          Configuración ⚙️
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalizá tu cuenta y preferencias
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="h-1 bg-gradient-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-primary rounded-lg p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualizá tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El correo no se puede cambiar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                variant="gradient"
                className="w-full sm:w-auto"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/30 overflow-hidden">
            <div className="h-1 bg-gradient-warm" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-warm rounded-lg p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Zona de Peligro
              </CardTitle>
              <CardDescription>
                Acciones irreversibles con tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                Eliminar Cuenta
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Esta función estará disponible próximamente
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-success/50 transition-all duration-300">
            <div className="h-1 bg-gradient-success" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-success rounded-lg p-2">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Configurá los detalles de tu emprendimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {business ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del Negocio</Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Nombre de tu negocio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de Negocio</Label>
                    <Input
                      id="businessType"
                      value={businessType}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      El tipo de negocio no se puede cambiar
                    </p>
                  </div>

                  <Button
                    onClick={handleUpdateBusiness}
                    disabled={loading}
                    variant="gradient"
                    className="w-full sm:w-auto"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tenés ningún negocio creado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Creá tu primer negocio desde el dashboard
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-warning/50 transition-all duration-300">
            <div className="h-1 bg-gradient-warm" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-warm rounded-lg p-2">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                Preferencias de Notificaciones
              </CardTitle>
              <CardDescription>
                Controlá cómo recibís actualizaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibí alertas importantes en tiempo real
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibí resúmenes y reportes por correo
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 Las notificaciones te ayudan a estar al día con ventas, stock bajo, y citas programadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
