import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });
  
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (selectedTheme: Theme) => {
      let themeToApply: 'light' | 'dark';
      
      if (selectedTheme === 'system') {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToApply = systemPreference ? 'dark' : 'light';
      } else {
        themeToApply = selectedTheme;
      }
      
      root.classList.remove('light', 'dark');
      root.classList.add(themeToApply);
      setEffectiveTheme(themeToApply);
    };
    
    applyTheme(theme);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);
  
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
