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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl p-3 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">
              Proyecto Emprendedurismo
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Gestiona tu negocio de forma inteligente
          </h1>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
            <Button 
              size="lg"
              onClick={() => {
                localStorage.setItem('is_guest_mode', 'true');
                localStorage.setItem('guest_session_id', crypto.randomUUID());
                navigate("/onboarding/classify");
              }}
              className="w-full text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white shadow-xl font-bold"
            >
              EXPLORAR LA DEMO
            </Button>
            
            <Button 
              size="lg" 
              onClick={() => setLoginModalOpen(true)}
              variant="outline"
              className="w-full text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold"
            >
              INICIAR SESIÓN
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate("/auth")}
              className="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              Crear cuenta gratis
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg p-1.5">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                Proyecto Emprendedurismo
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              © 2025 Proyecto Emprendedurismo - Tu negocio paso a paso
            </p>
            <p className="text-xs text-gray-500">
              🇦🇷 Hecho en Argentina
            </p>
          </div>
        </div>
      </footer>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default Index;
