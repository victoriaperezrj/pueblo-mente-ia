import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowLeft, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUserRole } from '@/hooks/useUserRole';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode as 'login' | 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const { role, loading: roleLoading } = useUserRole();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  // Redirect if already authenticated - only redirect if they have a role
  useEffect(() => {
    if (!roleLoading && role) {
      // User has a role assigned - redirect to their dashboard
      switch (role) {
        case 'entrepreneur':
          navigate('/entrepreneur/dashboard');
          break;
        case 'business':
        case 'pyme_enterprise':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/dashboard');
          break;
        default:
          // Should not happen with valid roles
          navigate('/onboarding/classify');
      }
    }
    // Note: if roleLoading is false and role is null, user is authenticated but has no role
    // This is fine - they'll see the login page and after login will be sent to classify
  }, [role, roleLoading, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (error) throw error;
        
        showToast('Sesión iniciada correctamente', 'success');
        
        // Get user role to redirect appropriately - ONLY check user_roles, not profiles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        // If user has a role assigned, redirect to their dashboard
        if (roleData && roleData.role) {
          switch (roleData.role) {
            case 'entrepreneur':
              navigate('/entrepreneur/dashboard');
              break;
            case 'business':
            case 'pyme_enterprise':
              navigate('/dashboard');
              break;
            case 'admin':
              navigate('/dashboard');
              break;
            default:
              // Should not happen, but redirect to classify if unknown role
              navigate('/onboarding/classify');
          }
        } else {
          // No role found - this is a new user or user who never completed onboarding
          // Redirect to classify to choose their profile
          navigate('/onboarding/classify');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding/classify`
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          showToast('Cuenta creada exitosamente', 'success');
          // Redirigir a selección de perfil
          navigate('/onboarding/classify');
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Ocurrió un error', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      {ToastComponent}
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver al inicio</span>
        </button>
        
        {/* Card */}
        <div className="bg-white border-2 border-border-light rounded-2xl p-8 shadow-hard">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-entrepreneur-500 to-business-500 rounded-xl flex items-center justify-center shadow-soft">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
              </h1>
              <p className="text-sm text-text-tertiary">
                Proyecto Emprendedurismo
              </p>
            </div>
          </div>
          
          {/* Demo Button - DESTACADO */}
          <button
            onClick={() => navigate('/onboarding/classify?mode=demo')}
            className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-entrepreneur-500 to-business-500 text-white rounded-xl font-bold hover:shadow-hard transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
            PROBAR MODO DEMO GRATIS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-tertiary">
                O {mode === 'login' ? 'inicia sesión' : 'regístrate'} con email
              </span>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border-DEFAULT rounded-lg text-text-primary placeholder-text-tertiary focus:border-entrepreneur-500 focus:outline-none focus:ring-2 focus:ring-entrepreneur-500/20 transition"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-bg-secondary border border-border-DEFAULT rounded-lg text-text-primary placeholder-text-tertiary focus:border-entrepreneur-500 focus:outline-none focus:ring-2 focus:ring-entrepreneur-500/20 transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-text-tertiary hover:text-text-primary transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border-DEFAULT text-entrepreneur-500 focus:ring-entrepreneur-500"
                  />
                  <span className="text-text-secondary">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-entrepreneur-600 hover:text-entrepreneur-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-entrepreneur-500 hover:bg-entrepreneur-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-soft"
            >
              {loading && <LoadingSpinner size="sm" className="border-t-white" />}
              {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>
          
          {/* Toggle mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-text-tertiary">
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
            </span>{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-entrepreneur-600 hover:text-entrepreneur-700 font-bold"
            >
              {mode === 'login' ? 'Registrate gratis' : 'Iniciá sesión'}
            </button>
          </div>
          
          {/* Social (opcional) */}
          <div className="mt-6">
            <p className="text-xs text-center text-text-tertiary mb-3">o continuá con</p>
            <button
              type="button"
              className="w-full py-3 bg-white border-2 border-border-DEFAULT text-text-primary font-semibold rounded-lg hover:bg-bg-secondary transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <p className="mt-6 text-center text-xs text-text-tertiary">
          Al registrarte, aceptás nuestros{' '}
          <button className="text-entrepreneur-600 hover:text-entrepreneur-700">
            términos y condiciones
          </button>
          {' '}y{' '}
          <button className="text-entrepreneur-600 hover:text-entrepreneur-700">
            política de privacidad
          </button>
        </p>
      </div>
    </div>
  );
}
