import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoginModal } from "@/components/LoginModal";

const Index = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Get user profile to redirect to correct dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile?.user_type === 'entrepreneur') {
          navigate('/entrepreneur/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // No session - activate guest mode automatically
        localStorage.setItem('is_guest_mode', 'true');
        localStorage.setItem('guest_session_id', crypto.randomUUID());
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl p-5 shadow-lg">
            <Building2 className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Proyecto Emprendedurismo
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Gestiona tu negocio de forma inteligente
          </p>
          <p className="text-sm text-gray-600">
            Valida ideas • Organiza • Automatiza
          </p>
        </div>
        
        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            onClick={() => {
              localStorage.setItem('is_guest_mode', 'true');
              localStorage.setItem('guest_session_id', crypto.randomUUID());
              navigate("/onboarding/classify");
            }}
            className="w-full bg-purple-600 text-white py-6 px-8 rounded-lg font-bold text-lg hover:bg-purple-700 transition shadow-lg"
          >
            PROBAR DEMO
          </Button>
          
          <Button 
            size="lg"
            onClick={() => setLoginModalOpen(true)}
            variant="outline"
            className="w-full border-2 border-purple-600 text-purple-600 py-6 px-8 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            INICIAR SESIÓN
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 pt-2">
          ¿No tienes cuenta?{' '}
          <button 
            onClick={() => navigate("/auth")}
            className="text-purple-600 underline font-semibold hover:text-purple-700"
          >
            Crear cuenta gratis
          </button>
        </p>
      </div>
      
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default Index;
