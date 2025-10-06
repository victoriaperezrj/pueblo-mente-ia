import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2 } from "lucide-react";
import { PasswordStrengthIndicator, validatePasswordStrength } from "@/components/PasswordStrengthIndicator";
import { z } from "zod";

const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAndCreateProfile(session.user.id, session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await checkAndCreateProfile(session.user.id, session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAndCreateProfile = async (userId: string, email: string | undefined) => {
    try {
      // Check if profile exists
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Check for pending role selection
      const pendingRole = localStorage.getItem('pending_role');
      
      // If profile doesn't exist, create it
      if (!profile) {
        const userType = pendingRole as 'entrepreneur' | 'business_owner' | null;
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: email?.split('@')[0] || 'Usuario',
            user_type: userType,
          });

        if (insertError) throw insertError;
        
        // Migrar datos del demo a Supabase si existen
        const pendingMigration = localStorage.getItem('pe_pending_migration');
        if (pendingMigration) {
          try {
            const migrationData = JSON.parse(pendingMigration);
            console.log('Migrating demo data to Supabase:', migrationData);
            
            // Si hay una idea de negocio, guardarla
            if (migrationData.demoData?.businessContext || migrationData.demoData?.ideaText) {
              const businessContext = migrationData.demoData.businessContext || migrationData.demoData.ideaText;
              await supabase.from('business_ideas').insert({
                user_id: userId,
                idea_description: businessContext,
                business_context: businessContext,
                location: migrationData.demoData.location || 'No especificado',
                industry: migrationData.demoData.industry || 'No especificado',
              });
              console.log('Business idea migrated successfully');
              
              toast({
                title: "¡Datos guardados!",
                description: "Tus datos del demo han sido guardados correctamente.",
              });
            }
            
            // Limpiar datos de migración
            localStorage.removeItem('pe_pending_migration');
            localStorage.removeItem('pe_demo_session');
            localStorage.removeItem('pe_demo_event_count');
          } catch (migrationError) {
            console.error('Migration error:', migrationError);
            // No bloquear el flujo si falla la migración
          }
        }
        
        // Clear pending role
        localStorage.removeItem('pending_role');
        
        // Navigate based on role
        if (userType === 'entrepreneur') {
          navigate('/onboarding/entrepreneur/step1');
        } else if (userType) {
          navigate('/dashboard');
        } else {
          navigate("/onboarding/classify");
        }
      } else {
        // Profile exists, navigate based on existing user_type
        if (profile.user_type === 'entrepreneur') {
          navigate('/onboarding/entrepreneur/step1');
        } else if (profile.user_type) {
          navigate('/dashboard');
        } else {
          navigate("/onboarding/classify");
        }
      }
    } catch (error: any) {
      console.error('Error checking/creating profile:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al configurar tu perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength before submitting
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Contraseña débil",
        description: passwordValidation.errors[0],
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate with Zod schema
      passwordSchema.parse(password);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "¡Cuenta creada!",
        description: "Iniciá sesión para comenzar.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Contraseña inválida",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al registrarse",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      toast({
        title: "Redirigiendo...",
        description: "Serás redirigido a Google para autenticarte.",
      });
    } catch (error: any) {
      toast({
        title: "Error al conectar con Google",
        description: error.message || "No se pudo iniciar sesión con Google. Intenta de nuevo.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      toast({
        title: "Redirigiendo...",
        description: "Serás redirigido a Apple para autenticarte.",
      });
    } catch (error: any) {
      toast({
        title: "Error al conectar con Apple",
        description: error.message || "No se pudo iniciar sesión con Apple. Intenta de nuevo.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Navigate directly to demo without authentication
    navigate("/demo/intro");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Card className="w-full max-w-md border-2 shadow-2xl animate-scale-in">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary rounded-2xl p-4 shadow-lg animate-bounce-subtle">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Proyecto Emprendedurismo
          </CardTitle>
          <CardDescription className="text-base">
            Tu plataforma de gestión empresarial con IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Mode Button - Primary CTA */}
          <Button
            type="button"
            size="lg"
            onClick={handleDemoMode}
            className="w-full mb-8 h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            👉 PROBAR MODO DEMO
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-card px-3 text-muted-foreground font-medium">
                O iniciá sesión
              </span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-base">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-base">
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Correo Electrónico</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombre Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Correo Electrónico</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres con mayúscula, minúscula y número"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11"
                  />
                  <PasswordStrengthIndicator password={password} showRequirements={true} />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Cuenta Gratis
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O continuar con
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continuar con Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={handleAppleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              Continuar con Apple
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Al registrarte, aceptás nuestros términos y condiciones
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
