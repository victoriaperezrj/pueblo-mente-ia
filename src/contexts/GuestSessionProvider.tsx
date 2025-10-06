import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DEMO_SESSION_KEY = 'pe_demo_session';
const DEMO_EVENT_COUNT_KEY = 'pe_demo_event_count';
const MAX_DEMO_EVENTS = 20;

interface DemoSession {
  isDemo: boolean;
  eventCount: number;
  data: Record<string, any>;
}

interface GuestSessionContextType {
  isDemo: boolean;
  eventCount: number;
  incrementEventCount: () => void;
  shouldShowUpgradePrompt: boolean;
  getDemoData: (key: string) => any;
  setDemoData: (key: string, value: any) => void;
  clearDemoSession: () => void;
  migrateToSupabase: () => Promise<void>;
}

const GuestSessionContext = createContext<GuestSessionContextType | null>(null);

export function GuestSessionProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState(0);
  const [demoData, setDemoDataState] = useState<Record<string, any>>({});
  const [shouldShowUpgradePrompt, setShouldShowUpgradePrompt] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem(DEMO_SESSION_KEY);
    const storedCount = localStorage.getItem(DEMO_EVENT_COUNT_KEY);

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setDemoDataState(parsed.data || {});
      } catch (e) {
        console.error('Failed to parse demo session:', e);
      }
    }

    if (storedCount) {
      const count = parseInt(storedCount, 10);
      setEventCount(count);
      if (count >= MAX_DEMO_EVENTS) {
        setShouldShowUpgradePrompt(true);
      }
    }
  }, []);

  // Save to localStorage whenever demoData changes
  useEffect(() => {
    const session: DemoSession = {
      isDemo: true,
      eventCount,
      data: demoData
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(DEMO_EVENT_COUNT_KEY, eventCount.toString());
  }, [eventCount, demoData]);

  const incrementEventCount = () => {
    setEventCount(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_DEMO_EVENTS) {
        setShouldShowUpgradePrompt(true);
      }
      return newCount;
    });
  };

  const getDemoData = (key: string) => {
    return demoData[key];
  };

  const setDemoData = (key: string, value: any) => {
    setDemoDataState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearDemoSession = () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem(DEMO_EVENT_COUNT_KEY);
    setEventCount(0);
    setDemoDataState({});
    setShouldShowUpgradePrompt(false);
  };

  const migrateToSupabase = async () => {
    // Store all demo data for migration after auth
    const migrationData = {
      demoData,
      eventCount,
      timestamp: Date.now()
    };
    localStorage.setItem('pe_pending_migration', JSON.stringify(migrationData));
    console.log('Migration data prepared:', migrationData);
    navigate('/auth');
  };

  // Check if we're in a demo route
  const isDemo = location.pathname.startsWith('/demo');

  return (
    <GuestSessionContext.Provider
      value={{
        isDemo,
        eventCount,
        incrementEventCount,
        shouldShowUpgradePrompt,
        getDemoData,
        setDemoData,
        clearDemoSession,
        migrateToSupabase
      }}
    >
      {children}
    </GuestSessionContext.Provider>
  );
}

export function useGuestSession() {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error('useGuestSession must be used within GuestSessionProvider');
  }
  return context;
}
