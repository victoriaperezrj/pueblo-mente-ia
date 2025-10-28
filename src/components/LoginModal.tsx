import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Iniciando sesión...",
      });

      // Obtener perfil del usuario para redirigir según su rol
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single();

      onOpenChange(false);
      
      // Redirigir según el tipo de usuario
      if (profile?.user_type === 'entrepreneur') {
        navigate('/entrepreneur/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Verifica tu email y contraseña",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    onOpenChange(false);
    localStorage.setItem('is_guest_mode', 'true');
    localStorage.setItem('guest_session_id', crypto.randomUUID());
    navigate('/demo/intro');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-cyan-900/95 backdrop-blur-xl border border-white/20 text-white">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-2xl blur-lg opacity-60"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-white/60 text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-white/90 font-semibold">Email</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-xl h-12 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-cyan-400/0 group-focus-within:from-purple-400/10 group-focus-within:via-blue-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-white/90 font-semibold">Contraseña</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-xl h-12 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-cyan-400/0 group-focus-within:from-purple-400/10 group-focus-within:via-blue-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="mr-2 h-4 w-4" />
                  </motion.div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </motion.div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/10 backdrop-blur-sm px-4 text-white/60 rounded-full">
              o
            </span>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className="w-full text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/20 rounded-xl h-11"
            onClick={handleGuestMode}
          >
            ¿No tienes cuenta?{" "}
            <span className="ml-1 font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Explora sin registro
            </span>
            <Sparkles className="ml-2 w-4 h-4 text-purple-400" />
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
