import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onAuthClick?: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const navigate = useNavigate();
  
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <div className="text-2xl font-bold">Logo</div>
      
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        
        <button onClick={onAuthClick || (() => navigate('/auth'))}>
          Crear cuenta
        </button>
        
        <button onClick={() => navigate('/select-role')}>
          Ver Demo
        </button>
      </div>
    </nav>
  );
}
