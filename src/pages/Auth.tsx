import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2, Mail, Lock, User, ArrowLeft, Sparkles } from "lucide-react";
import { PasswordStrengthIndicator, validatePasswordStrength } from "@/components/PasswordStrengthIndicator";
import { z } from "zod";
import { logger } from "@/lib/logger";

const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
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
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName || email?.split('@')[0] || 'Usuario',
            user_type: 'entrepreneur',
          });

        if (insertError) throw insertError;
        
        navigate('/onboarding/entrepreneur/step1');
      } else {
        if (profile.user_type === 'entrepreneur') {
          navigate('/onboarding/entrepreneur/step1');
        } else if (profile.user_type) {
          navigate('/dashboard');
        } else {
          navigate("/onboarding/classify");
        }
      }
    } catch (error: any) {
      logger.error('Error checking/creating profile:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al configurar tu perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      setMode('signin');
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
    } catch (error: any) {
      toast({
        title: "Error al conectar con Google",
        description: error.message || "No se pudo iniciar sesión con Google. Intenta de nuevo.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver al inicio</span>
        </button>
        
        {/* Card */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <CardTitle className="text-2xl font-bold text-white">
                  {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Proyecto Emprendedurismo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Demo Button - DESTACADO */}
            <Button
              type="button"
              size="lg"
              onClick={() => navigate('/onboarding/classify')}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              PROBAR MODO DEMO
            </Button>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/50 text-slate-400">
                  O {mode === 'signin' ? 'inicia sesión' : 'regístrate'}
                </span>
              </div>
            </div>
            
            {/* Forms */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-300">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-300">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-sky-500 hover:bg-sky-600" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-300">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-300">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-300">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      />
                    </div>
                    <PasswordStrengthIndicator password={password} showRequirements={true} />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-sky-500 hover:bg-sky-600" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Cuenta Gratis
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Google Sign In */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-800/50 text-slate-400">
                    O continuar con
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-700 hover:bg-slate-700 text-white"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </Button>
            </div>
            
            {/* Footer */}
            <p className="text-center text-xs text-slate-500">
              Al registrarte, aceptás nuestros términos y condiciones
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
