import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowLeft, Sparkles, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUserRole } from '@/hooks/useUserRole';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {ToastComponent}
      
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600/20 via-blue-500/20 to-cyan-400/20 animate-gradient" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Particle Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back button */}
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </motion.button>
        
        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl" />
          {/* Header */}
          <div className="relative flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-2xl blur-md opacity-50"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Zap className="w-7 h-7 text-white relative z-10" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
              >
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Comenzar ahora'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-white/60 font-medium"
              >
                Emprende con IA
              </motion.p>
            </div>
          </div>
          
          {/* Demo Button - DESTACADO */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding/classify?mode=demo')}
            className="relative w-full mb-6 px-6 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white rounded-xl font-bold overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"
              initial={{ x: '100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span className="text-sm tracking-wide">PROBAR MODO DEMO GRATIS</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 backdrop-blur-sm text-white/60 rounded-full">
                O {mode === 'login' ? 'inicia sesión' : 'regístrate'} con email
              </span>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Correo Electrónico
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition backdrop-blur-sm font-medium"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-cyan-400/0 group-focus-within:from-purple-400/10 group-focus-within:via-blue-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Contraseña
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition backdrop-blur-sm font-medium"
                  required
                  minLength={6}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-cyan-400/0 group-focus-within:from-purple-400/10 group-focus-within:via-blue-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </motion.div>
            
            <AnimatePresence>
              {mode === 'login' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-400/50"
                    />
                    <span className="text-white/70 group-hover:text-white transition">Recordarme</span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group mt-6"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <LoadingSpinner size="sm" className="border-t-white" />
                  </motion.div>
                )}
                {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </span>
            </motion.button>
          </form>
          
          {/* Toggle mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-white/60">
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
            </span>{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-purple-400 hover:text-purple-300 font-bold transition"
            >
              {mode === 'login' ? 'Registrate gratis' : 'Iniciá sesión'}
            </motion.button>
          </motion.div>
          
          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-xs text-center text-white/50 mb-3">o continuá con</p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/onboarding/classify`
                    }
                  });
                  if (error) throw error;
                } catch (error: any) {
                  showToast(error.message || 'Error al conectar con Google', 'error');
                }
              }}
              className="relative w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="relative z-10">Continuar con Google</span>
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-white/50"
        >
          Al registrarte, aceptás nuestros{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            términos y condiciones
          </motion.button>
          {' '}y{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            política de privacidad
          </motion.button>
        </motion.p>
      </motion.div>
    </div>
  );
}
