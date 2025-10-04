import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  itemCount: number;
  maxItems: number;
  canAddItem: boolean;
  addItem: () => void;
  removeItem: () => void;
  resetDemo: () => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const maxItems = 20;

  useEffect(() => {
    // Cargar estado del demo desde localStorage
    const demoState = localStorage.getItem('demoMode');
    const demoCount = localStorage.getItem('demoItemCount');
    
    if (demoState === 'true') {
      setIsDemoMode(true);
      setItemCount(parseInt(demoCount || '0', 10));
    }
  }, []);

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setItemCount(0);
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoItemCount', '0');
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setItemCount(0);
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoItemCount');
    // Limpiar datos de demo
    localStorage.removeItem('demoData');
  };

  const addItem = () => {
    if (itemCount < maxItems) {
      const newCount = itemCount + 1;
      setItemCount(newCount);
      localStorage.setItem('demoItemCount', newCount.toString());
    }
  };

  const removeItem = () => {
    if (itemCount > 0) {
      const newCount = itemCount - 1;
      setItemCount(newCount);
      localStorage.setItem('demoItemCount', newCount.toString());
    }
  };

  const resetDemo = () => {
    setItemCount(0);
    localStorage.setItem('demoItemCount', '0');
    localStorage.removeItem('demoData');
  };

  const canAddItem = itemCount < maxItems;

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        itemCount,
        maxItems,
        canAddItem,
        addItem,
        removeItem,
        resetDemo,
        enterDemoMode,
        exitDemoMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
