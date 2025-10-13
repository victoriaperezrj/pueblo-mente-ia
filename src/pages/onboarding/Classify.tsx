import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Rocket, TrendingUp, BarChart3, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { assignUserRole } from '@/hooks/useUserRole';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type ProfileType = 'entrepreneur' | 'business' | 'pyme_enterprise';

export default function OnboardingClassify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isDemoMode = searchParams.get('mode') === 'demo';
  
  useEffect(() => {
    checkAuthAndRole();
  }, []);
  
  const checkAuthAndRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    
    // If user is authenticated, check if they already have a role
    if (user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If user already has a role, redirect them to their dashboard
      if (roleData && roleData.role) {
        if (roleData.role === 'entrepreneur') {
          navigate('/entrepreneur/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  };
  
  const handleSelectProfile = async (profile: ProfileType) => {
    setLoading(true);
    
    try {
      if (isDemoMode || !isAuthenticated) {
        // Modo demo - solo localStorage
        localStorage.setItem('is_guest_mode', 'true');
        localStorage.setItem('demo_profile', profile);
        
        if (profile === 'entrepreneur') {
          navigate('/demo/entrepreneur/dashboard');
        } else if (profile === 'business') {
          navigate('/demo/negocio/dashboard');
        } else {
          navigate('/demo/pyme/dashboard');
        }
      } else {
        // Usuario autenticado - guardar en BD
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          showToast('Debes iniciar sesión primero', 'error');
          navigate('/auth');
          return;
        }

        // Asignar rol al usuario
        const result = await assignUserRole(user.id, profile);
        
        if (!result.success) {
          showToast(result.error || 'Error al asignar perfil', 'error');
          return;
        }

        // Actualizar perfil con user_type
        await supabase
          .from('profiles')
          .update({ user_type: profile })
          .eq('id', user.id);

        showToast('Perfil configurado exitosamente', 'success');
        
        // Redirigir según el tipo de perfil
        if (profile === 'entrepreneur') {
          navigate('/entrepreneur/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Error en selección de perfil:', error);
      showToast('Ocurrió un error inesperado', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4">
      {ToastComponent}
      
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-8 transition"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            ¿En qué etapa está tu proyecto?
          </h1>
          <p className="text-lg text-text-secondary">
            Elegí tu perfil para acceder a herramientas personalizadas
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProfileCard
            icon={Rocket}
            badge="DESDE CERO"
            title="Emprendedor"
            subtitle="Tengo una Idea"
            description="Aún no arranqué, pero tengo una idea clara. Necesito validarla y hacer números."
            features={[
              'Lean Canvas interactivo',
              'Análisis con IA',
              'Simulador financiero',
              'Checklist AFIP'
            ]}
            buttonText="Empezar Validación"
            color="entrepreneur"
            onClick={() => handleSelectProfile('entrepreneur')}
            loading={loading}
          />
          
          <ProfileCard
            icon={TrendingUp}
            badge="1-3 AÑOS"
            title="Negocio"
            subtitle="Tengo un Negocio"
            description="Ya vendo, pero llevo todo en Excel. Quiero organizarme mejor."
            features={[
              'Dashboard de ventas',
              'CRM de clientes',
              'Control de gastos',
              'Facturación AFIP'
            ]}
            buttonText="Organizar Negocio"
            color="business"
            onClick={() => handleSelectProfile('business')}
            popular
            loading={loading}
          />
          
          <ProfileCard
            icon={BarChart3}
            badge="+3 AÑOS"
            title="PYME"
            subtitle="Tengo una Empresa"
            description="Tengo equipo y procesos. Quiero automatizar y escalar."
            features={[
              'Gestión de equipo',
              'Automatización',
              'Multi-sucursal',
              'Reportes ejecutivos'
            ]}
            buttonText="Automatizar Empresa"
            color="enterprise"
            onClick={() => handleSelectProfile('pyme_enterprise')}
            loading={loading}
          />
        </div>
        
        <div className="text-center text-sm text-text-tertiary bg-business-50 border border-business-200 rounded-lg p-4">
          <p className="font-medium text-business-700">
            Tip: Podés cambiar de perfil en cualquier momento desde Configuración
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProfileCardProps {
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonText: string;
  color: 'entrepreneur' | 'business' | 'enterprise';
  onClick: () => void;
  popular?: boolean;
  loading?: boolean;
}

function ProfileCard({ icon: Icon, badge, title, subtitle, description, features, buttonText, color, onClick, popular, loading }: ProfileCardProps) {
  const colors = {
    entrepreneur: {
      bg: 'from-entrepreneur-50 to-entrepreneur-100',
      border: 'border-entrepreneur-300',
      icon: 'from-entrepreneur-500 to-entrepreneur-600',
      badge: 'bg-entrepreneur-100 text-entrepreneur-700',
      button: 'bg-entrepreneur-500 hover:bg-entrepreneur-600 text-white',
      check: 'text-entrepreneur-500'
    },
    business: {
      bg: 'from-business-50 to-business-100',
      border: 'border-business-300',
      icon: 'from-business-500 to-business-600',
      badge: 'bg-business-100 text-business-700',
      button: 'bg-business-500 hover:bg-business-600 text-white',
      check: 'text-business-500'
    },
    enterprise: {
      bg: 'from-enterprise-50 to-enterprise-100',
      border: 'border-enterprise-300',
      icon: 'from-enterprise-500 to-enterprise-600',
      badge: 'bg-enterprise-100 text-enterprise-700',
      button: 'bg-enterprise-500 hover:bg-enterprise-600 text-white',
      check: 'text-enterprise-500'
    }
  };
  
  const c = colors[color];
  
  return (
    <div className={`relative bg-gradient-to-br ${c.bg} border-2 ${c.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-medium cursor-pointer`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-warning text-white text-xs font-bold rounded-full shadow-soft">
          MÁS POPULAR
        </div>
      )}
      
      <div className={`w-14 h-14 bg-gradient-to-br ${c.icon} rounded-xl flex items-center justify-center mb-4 shadow-soft`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <div className={`inline-block px-3 py-1 ${c.badge} text-xs font-bold rounded-full mb-3`}>
        {badge}
      </div>
      
      <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
      <h4 className="text-lg font-semibold text-text-secondary mb-3">{subtitle}</h4>
      <p className="text-sm text-text-tertiary mb-4 leading-relaxed">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className={`w-4 h-4 ${c.check} mt-0.5 flex-shrink-0`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full py-3 ${c.button} rounded-lg font-semibold transition flex items-center justify-center gap-2 group shadow-soft disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <LoadingSpinner size="sm" className="border-t-white" />
        ) : (
          <>
            {buttonText}
            <Icon className="w-4 h-4 group-hover:translate-x-1 transition" />
          </>
        )}
      </button>
    </div>
  );
}
