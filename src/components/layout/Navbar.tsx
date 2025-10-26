import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <div className="text-2xl font-bold">Logo</div>
      
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        
        <button onClick={() => navigate('/auth')}>
          Crear cuenta
        </button>
        
        <button onClick={() => navigate('/demo/select-role')}>
          Ver Demo
        </button>
      </div>
    </nav>
  );
}
