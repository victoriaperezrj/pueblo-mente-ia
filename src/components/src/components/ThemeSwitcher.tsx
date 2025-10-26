// src/components/ThemeSwitcher.tsx
// ARCHIVO NUEVO - Creá este archivo en src/components/

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const options = [
    { value: 'light' as const, icon: Sun, label: 'Claro' },
    { value: 'dark' as const, icon: Moon, label: 'Oscuro' },
    { value: 'system' as const, icon: Monitor, label: 'Sistema' },
  ];
  
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${theme === value
              ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }
          `}
          aria-label={`Cambiar a tema ${label}`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
