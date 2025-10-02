import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Lightbulb, FileText, DollarSign, Store, Scale, GraduationCap, MessageCircle, Settings, Home, CheckCircle, Clock, Circle, TrendingUp, Users, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgressWidget from "@/components/entrepreneur/ProgressWidget";
import QuickActions from "@/components/entrepreneur/QuickActions";
import AIAssistantPreview from "@/components/entrepreneur/AIAssistantPreview";

interface BusinessIdea {
  id: string;
  idea_description: string;
  industry: string;
  location: string;
  validation_result: any;
}

interface ProgressData {
  completed: number;
  total: number;
  percentage: number;
}

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [planProgress, setPlanProgress] = useState<ProgressData>({ completed: 0, total: 25, percentage: 0 });
  const [regulationsProgress, setRegulationsProgress] = useState({ completed: 0, total: 4 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);

      // Load most recent idea
      const { data: ideaData } = await supabase
        .from('business_ideas')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ideaData) {
        setIdea(ideaData);

        // Load business plan progress
        const { data: progressData } = await supabase
          .from('business_plan_progress')
          .select('*')
          .eq('idea_id', ideaData.id);

        const completed = progressData?.filter(p => p.completed).length || 0;
        const total = 25;
        setPlanProgress({
          completed,
          total,
          percentage: Math.round((completed / total) * 100)
        });

        // Calculate regulations progress
        const regulationTasks = progressData?.filter(p => 
          p.task_id.includes('afip') || 
          p.task_id.includes('bromatologica') || 
          p.task_id.includes('arba') || 
          p.task_id.includes('municipal')
        ) || [];
        
        setRegulationsProgress({
          completed: regulationTasks.filter(t => t.completed).length,
          total: 4
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el dashboard",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const activateBusiness = async () => {
    if (!idea || !user) return;

    try {
      // Create business record
      const businessData = {
        user_id: user.id,
        name: idea.idea_description.split(' ').slice(0, 3).join(' '),
        business_type: idea.industry as "bakery" | "grocery_store" | "hair_salon" | "other" | "pharmacy" | "restaurant",
        location: idea.location,
        setup_stage: 'operational' as "idea_validation" | "operational" | "blueprint"
      };

      const { data: businesses } = await supabase
        .from('businesses')
        .insert([businessData])
        .select();

      const business = businesses?.[0];

      if (business) {
        // Update profile to business_owner
        await supabase
          .from('profiles')
          .update({ 
            user_type: 'business_owner'
          })
          .eq('id', user.id);

        toast({
          title: "¡Negocio Activado! 🎉",
          description: "Ahora tenés acceso al sistema completo de gestión"
        });

        // Redirect to main dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error activating business:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el negocio",
        variant: "destructive"
      });
    }
  };

  const getViabilityColor = (viability: string) => {
    switch (viability) {
      case 'viable': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'risky': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getViabilityText = (viability: string) => {
    switch (viability) {
      case 'viable': return '🟢 VIABLE';
      case 'caution': return '🟡 VIABLE CON AJUSTES';
      case 'risky': return '🟠 REQUIERE ANÁLISIS';
      default: return 'NO ANALIZADO';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Empty state - no idea validated yet
  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="pt-12 pb-12">
            <div className="mb-6">
              <Lightbulb className="h-24 w-24 mx-auto text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">¡Empecemos!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Te ayudamos a ver si tu idea puede funcionar en 10 minutos
            </p>
            <Button 
              size="lg"
              variant="default"
              className="text-lg px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/idea-validator')}
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Ver si mi idea funciona
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallProgress = Math.round(
    (planProgress.percentage + (regulationsProgress.completed / regulationsProgress.total * 100)) / 2
  );

  const canActivate = overallProgress >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r p-6 overflow-y-auto hidden lg:block">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Proyecto Emprendedurismo
        </h2>
        
        <nav className="space-y-2">
          <Button variant="default" className="w-full justify-start">
            <Home className="mr-3 h-4 w-4" />
            Inicio
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/idea-validator')}>
            <Lightbulb className="mr-3 h-4 w-4" />
            Validar Idea Nueva
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/onboarding/entrepreneur/results?ideaId=${idea.id}`)}>
            <FileText className="mr-3 h-4 w-4" />
            Mis Ideas Validadas
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/onboarding/entrepreneur/business-plan?ideaId=${idea.id}`)}>
            <FileText className="mr-3 h-4 w-4" />
            Plan de Negocio
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/onboarding/entrepreneur/financial-simulator?ideaId=${idea.id}`)}>
            <DollarSign className="mr-3 h-4 w-4" />
            Simulador Financiero
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/marketplace')}>
            <Store className="mr-3 h-4 w-4" />
            Proveedores
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Scale className="mr-3 h-4 w-4" />
            Regulaciones
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <GraduationCap className="mr-3 h-4 w-4" />
            Academia
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageCircle className="mr-3 h-4 w-4" />
            Asistente IA
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/settings')}>
            <Settings className="mr-3 h-4 w-4" />
            Configuración
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hola, {profile?.full_name || 'Emprendedor'} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Tu negocio: <span className="font-semibold text-foreground">{idea.idea_description.split(' ').slice(0, 5).join(' ')}</span>
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/idea-validator')}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Nueva Idea
          </Button>
        </div>

        {/* Overall Progress */}
        <ProgressWidget 
          overallProgress={overallProgress}
          planProgress={planProgress}
          regulationsProgress={regulationsProgress}
          onContinue={() => navigate(`/onboarding/entrepreneur/business-plan?ideaId=${idea.id}`)}
        />

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Your Idea Card */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tu Idea</span>
                <Badge className={getViabilityColor(idea.validation_result?.viability || '')}>
                  {getViabilityText(idea.validation_result?.viability || '')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{idea.industry}</p>
                <p className="text-sm text-muted-foreground">📍 {idea.location}</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plata para arrancar:</span>
                  <span className="font-semibold">{idea.validation_result?.investment_range || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recuperás inversión en:</span>
                  <span className="font-semibold">{idea.validation_result?.break_even_months || '18'} meses</span>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-2 hover:bg-muted"
                onClick={() => navigate(`/onboarding/entrepreneur/results?ideaId=${idea.id}`)}
              >
                Ver Análisis Completo
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan Card */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Tu Plan Paso a Paso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{planProgress.percentage}% completado</span>
                  <span className="text-muted-foreground">{planProgress.completed}/{planProgress.total} tareas</span>
                </div>
                <Progress value={planProgress.percentage} />
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">Próxima tarea pendiente:</p>
                <p className="text-sm">📄 Habilitación Bromatológica</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Costo: $45,000</span>
                  <span>Plazo: 5-7 días</span>
                </div>
              </div>

              <Button 
                variant="default"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(`/onboarding/entrepreneur/business-plan?ideaId=${idea.id}`)}
              >
                Ver el Plan →
              </Button>
            </CardContent>
          </Card>

          {/* Finances Card */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Cuánta Plata Ganás</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ganás por mes</p>
                <p className="text-2xl font-bold">$29,400<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                <p className="text-xs text-muted-foreground">(ya descontando el préstamo)</p>
              </div>

              <div className="flex items-center justify-between bg-yellow-500/10 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Margen</p>
                  <p className="text-2xl font-bold text-yellow-600">4.7%</p>
                </div>
                <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                  Mejorar
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                💡 Consejo: Tratá de gastar menos en cosas fijas
              </p>

              <Button 
                variant="outline"
                className="w-full border-2 hover:bg-muted"
                onClick={() => navigate(`/onboarding/entrepreneur/financial-simulator?ideaId=${idea.id}`)}
              >
                Ver Calculadora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions ideaId={idea.id} />

        {/* Resources and Community */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                Cursos Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <div>
                    <p className="font-semibold text-sm">Fundamentos de Contabilidad</p>
                    <p className="text-xs text-muted-foreground">15 minutos</p>
                  </div>
                  <Button size="sm" variant="ghost">Ver</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <div>
                    <p className="font-semibold text-sm">Marketing sin Presupuesto</p>
                    <p className="text-xs text-muted-foreground">20 minutos</p>
                  </div>
                  <Button size="sm" variant="ghost">Ver</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <div>
                    <p className="font-semibold text-sm">Atención al Cliente</p>
                    <p className="text-xs text-muted-foreground">12 minutos</p>
                  </div>
                  <Button size="sm" variant="ghost">Ver</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Ver Academia Completa</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Comunidad
              </CardTitle>
              <CardDescription>
                5 emprendedores de gastronomía en San Luis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <p className="font-semibold text-sm mb-1">¿Alguien usó Banco SJ crédito 0%?</p>
                  <p className="text-xs text-muted-foreground">2 respuestas • hace 3 horas</p>
                </div>
                <div className="p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <p className="font-semibold text-sm mb-1">Proveedores de harina recomendados</p>
                  <p className="text-xs text-muted-foreground">8 respuestas • hace 1 día</p>
                </div>
                <div className="p-3 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors">
                  <p className="font-semibold text-sm mb-1">Tips para reducir costos iniciales</p>
                  <p className="text-xs text-muted-foreground">12 respuestas • hace 2 días</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Unirme a la Comunidad</Button>
            </CardContent>
          </Card>
        </div>

        {/* Regulations Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-primary" />
                Tu Checklist Regulatorio
              </span>
              <Badge variant="outline">
                {regulationsProgress.completed}/{regulationsProgress.total} completados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">AFIP Monotributo</p>
                    <p className="text-sm text-muted-foreground">Costo: $0</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Ver comprobante</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Habilitación Bromatológica</p>
                    <p className="text-sm text-muted-foreground">Costo: $45,000</p>
                  </div>
                </div>
                <Button size="sm">Iniciar trámite</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Circle className="h-5 w-5 text-gray-300" />
                  <div>
                    <p className="font-semibold">ARBA Ingresos Brutos</p>
                    <p className="text-sm text-muted-foreground">Costo: $0</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Ver requisitos</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Circle className="h-5 w-5 text-gray-300" />
                  <div>
                    <p className="font-semibold">Matrícula Municipal</p>
                    <p className="text-sm text-muted-foreground">Costo: $30,000</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Ver requisitos</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Preview */}
        <AIAssistantPreview />

        {/* Activate Business Button */}
        {canActivate && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="py-8 text-center">
              <Rocket className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Estás listo para lanzar tu negocio!</h2>
              <p className="mb-6 opacity-90">
                Completaste más del 70% de preparación. Activá tu negocio para acceder al sistema completo de gestión.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={activateBusiness}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Activar Negocio
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
