import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Building2, Bell, Shield, Palette, Code, Lightbulb, TrendingUp, Globe, FolderPlus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Project/Business type for multi-project support
interface Project {
  id: string;
  name: string;
  stage: string;
  createdAt: string;
}

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Testing/Developer mode states
  const [testingMode, setTestingMode] = useState(() =>
    localStorage.getItem('testingMode') === 'true'
  );
  const [currentStage, setCurrentStage] = useState(() =>
    localStorage.getItem('currentStage') || 'emprendedor'
  );

  // Projects state (multi-business support)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('userProjects');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Mi Primer Proyecto', stage: 'emprendedor', createdAt: new Date().toISOString() }
    ];
  });
  const [activeProjectId, setActiveProjectId] = useState(() =>
    localStorage.getItem('activeProjectId') || '1'
  );
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStage, setNewProjectStage] = useState("emprendedor");

  // Stage definitions
  const stageOptions = [
    { id: 'emprendedor', label: 'Emprendedor', subtitle: '0-1 año', icon: Lightbulb, route: '/entrepreneur/dashboard' },
    { id: 'negocio', label: 'Negocio', subtitle: '1-3 años', icon: TrendingUp, route: '/business/dashboard' },
    { id: 'empresa', label: 'Empresa', subtitle: '3-10 años', icon: Building2, route: '/pyme/dashboard' },
    { id: 'global', label: 'Global', subtitle: '10+ años', icon: Globe, route: '/dashboard/global' },
  ];

  // Handle testing mode toggle
  const handleTestingModeToggle = (enabled: boolean) => {
    setTestingMode(enabled);
    localStorage.setItem('testingMode', String(enabled));
    toast({
      title: enabled ? "Modo Testing activado" : "Modo Testing desactivado",
      description: enabled
        ? "Ahora podés cambiar de etapa libremente"
        : "Volviste al modo normal",
    });
  };

  // Handle stage change in testing mode
  const handleStageChange = (stageId: string) => {
    setCurrentStage(stageId);
    localStorage.setItem('currentStage', stageId);
    const stage = stageOptions.find(s => s.id === stageId);
    if (stage) {
      toast({
        title: `Etapa cambiada a ${stage.label}`,
        description: "Redirigiendo al dashboard...",
      });
      setTimeout(() => navigate(stage.route), 500);
    }
  };

  // Handle project creation
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del proyecto es requerido",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      stage: newProjectStage,
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
    setNewProjectName("");

    toast({
      title: "Proyecto creado",
      description: `"${newProjectName}" agregado exitosamente`,
    });
  };

  // Handle project switch
  const handleSwitchProject = (projectId: string) => {
    setActiveProjectId(projectId);
    localStorage.setItem('activeProjectId', projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentStage(project.stage);
      localStorage.setItem('currentStage', project.stage);
      const stage = stageOptions.find(s => s.id === project.stage);
      if (stage) {
        toast({
          title: `Cambiaste a "${project.name}"`,
          description: `Etapa: ${stage.label}`,
        });
        setTimeout(() => navigate(stage.route), 500);
      }
    }
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      toast({
        title: "Error",
        description: "Debés tener al menos un proyecto",
        variant: "destructive",
      });
      return;
    }

    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));

    // If deleted active project, switch to first remaining
    if (activeProjectId === projectId) {
      handleSwitchProject(updatedProjects[0].id);
    }

    toast({
      title: "Proyecto eliminado",
      description: "El proyecto fue eliminado exitosamente",
    });
  };

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
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
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
                  <Label className="text-base">Alertas Instantáneas</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas al instante en tu dispositivo
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Correos Informativos</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibí resúmenes y reportes por correo
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                {emailNotifications && (
                  <div className="ml-4 space-y-4 p-4 border-l-2 border-primary/30 bg-muted/30 rounded-r-lg">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Tipo de correos que deseo recibir:</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sales-summary" defaultChecked />
                          <Label htmlFor="sales-summary" className="text-sm cursor-pointer">
                            Resumen semanal de ventas
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="low-inventory" defaultChecked />
                          <Label htmlFor="low-inventory" className="text-sm cursor-pointer">
                            Recordatorios de inventario bajo
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-features" defaultChecked />
                          <Label htmlFor="new-features" className="text-sm cursor-pointer">
                            Nuevas funcionalidades
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="entrepreneur-tips" defaultChecked />
                          <Label htmlFor="entrepreneur-tips" className="text-sm cursor-pointer">
                            Tips de emprendimiento
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="monthly-reports" />
                          <Label htmlFor="monthly-reports" className="text-sm cursor-pointer">
                            Reportes mensuales
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="billing-alerts" defaultChecked />
                          <Label htmlFor="billing-alerts" className="text-sm cursor-pointer">
                            Alertas de facturación
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Frecuencia de envío:</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diaria</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quincenal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Personalizar mis emails
                    </Button>
                  </div>
                )}
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

        {/* Projects Tab - Multi-business support */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                  <FolderPlus className="h-5 w-5 text-white" />
                </div>
                Mis Proyectos
              </CardTitle>
              <CardDescription>
                Gestioná múltiples negocios o ideas en diferentes etapas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Projects List */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Proyectos Activos</Label>
                {projects.map((project) => {
                  const stage = stageOptions.find(s => s.id === project.stage);
                  const StageIcon = stage?.icon || Lightbulb;
                  const isActive = project.id === activeProjectId;

                  return (
                    <div
                      key={project.id}
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                        }`}>
                          <StageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {stage?.label} • {stage?.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSwitchProject(project.id)}
                          >
                            Cambiar
                          </Button>
                        )}
                        {isActive && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            Activo
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Create New Project */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Crear Nuevo Proyecto</Label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newProjectName">Nombre del Proyecto</Label>
                    <Input
                      id="newProjectName"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Ej: Mi nueva app, Tienda online..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newProjectStage">Etapa del Proyecto</Label>
                    <Select value={newProjectStage} onValueChange={setNewProjectStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.label} ({stage.subtitle})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateProject} className="w-full">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 Cada proyecto tiene su propia etapa y data separada. Ideal para emprendedores con múltiples ventures.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Tab - Testing Mode */}
        <TabsContent value="developer" className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                  <Code className="h-5 w-5 text-white" />
                </div>
                Modo Developer
              </CardTitle>
              <CardDescription>
                Herramientas avanzadas para testing y desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Testing Mode Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Modo Testing</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambiá de etapa libremente sin restricciones
                  </p>
                </div>
                <Switch
                  checked={testingMode}
                  onCheckedChange={handleTestingModeToggle}
                />
              </div>

              {/* Stage Selector (only when testing mode is on) */}
              {testingMode && (
                <div className="space-y-4 p-4 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/50 dark:bg-purple-950/20">
                  <Label className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    Cambiar Etapa Actual
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {stageOptions.map((stage) => {
                      const StageIcon = stage.icon;
                      const isActive = currentStage === stage.id;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => handleStageChange(stage.id)}
                          className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${
                            isActive
                              ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/50'
                              : 'hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActive
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                          }`}>
                            <StageIcon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{stage.label}</p>
                            <p className="text-xs text-muted-foreground">{stage.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator />

              {/* Debug Info */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Información de Debug</Label>
                <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-1">
                  <p><span className="text-muted-foreground">Testing Mode:</span> {testingMode ? 'ON' : 'OFF'}</p>
                  <p><span className="text-muted-foreground">Current Stage:</span> {currentStage}</p>
                  <p><span className="text-muted-foreground">Active Project:</span> {projects.find(p => p.id === activeProjectId)?.name}</p>
                  <p><span className="text-muted-foreground">Total Projects:</span> {projects.length}</p>
                  <p><span className="text-muted-foreground">User ID:</span> {user?.id || 'Not logged in'}</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ El Modo Testing es solo para desarrollo. Los datos pueden no persistir correctamente entre sesiones.
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
