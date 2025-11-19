import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Building2, Globe, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export default function SignupFlow() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const stages = [
    {
      id: 'entrepreneur',
      icon: Lightbulb,
      title: 'Emprendedor',
      subtitle: '0-1 año',
      description: 'Tenés una idea con potencial',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'business',
      icon: TrendingUp,
      title: 'Negocio',
      subtitle: '1-3 años',
      description: 'Tu negocio está validado',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'pyme',
      icon: Building2,
      title: 'Empresa',
      subtitle: '3-10 años',
      description: 'Empresa PYME establecida',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'global',
      icon: Globe,
      title: 'Global',
      subtitle: '10+ años',
      description: 'Multinacional o expansión',
      gradient: 'from-violet-500 to-violet-600'
    }
  ];

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            business_name: formData.businessName,
            user_type: userType
          }
        }
      });

      if (error) throw error;

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep(3);
      
      setTimeout(() => {
        const dashboardRoute = userType === 'entrepreneur' ? '/entrepreneur/dashboard' :
                              userType === 'business' ? '/business/dashboard' :
                              userType === 'global' ? '/dashboard/global' :
                              '/pyme/dashboard';
        navigate(dashboardRoute);
      }, 3000);

    } catch (error: any) {
      toast({
        title: 'Error al crear cuenta',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{
                    scale: step >= s ? 1 : 0.8,
                    backgroundColor: step >= s ? '#3B82F6' : '#1E293B'
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20"
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </motion.div>
                {s < 3 && (
                  <motion.div
                    animate={{
                      scaleX: step > s ? 1 : 0
                    }}
                    className="w-16 h-1 bg-blue-500 mx-2 origin-left"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/70">
            Paso {step} de 3
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Stage */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                ¿En qué etapa está tu negocio?
              </h2>
              <p className="text-white/70 text-center mb-8">
                Esto nos ayuda a personalizar tu experiencia
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stages.map((stage) => {
                  const Icon = stage.icon;
                  const isSelected = userType === stage.id;
                  
                  return (
                    <motion.button
                      key={stage.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUserType(stage.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${stage.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{stage.title}</h3>
                      <p className="text-white/60 text-sm mb-2">{stage.subtitle}</p>
                      <p className="text-white/80 text-sm">{stage.description}</p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!userType}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-white/70 hover:text-white mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>

              <h2 className="text-4xl font-bold text-white mb-2">
                Creá tu cuenta
              </h2>
              <p className="text-white/70 mb-8">
                Solo te tomará un minuto
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-white font-semibold mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Nombre del negocio <span className="text-white/50">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Mi Empresa SRL"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!formData.fullName || !formData.email || !formData.password || loading}
                onClick={handleSignup}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-5xl font-bold text-white mb-4">
                ¡Todo listo!
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Tu cuenta fue creada exitosamente
              </p>
              <p className="text-white/60">
                Redirigiendo a tu dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
