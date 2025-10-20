import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function RoleBasedRedirect() {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role) {
      switch (role) {
        case 'entrepreneur':
          navigate('/entrepreneur/dashboard');
          break;
        case 'business':
        case 'pyme_enterprise':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/onboarding/classify');
      }
    } else if (!loading && !role) {
      navigate('/onboarding/classify');
    }
  }, [role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-text-secondary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return null;
}
