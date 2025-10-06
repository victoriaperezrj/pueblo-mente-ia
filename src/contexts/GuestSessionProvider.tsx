import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DEMO_SESSION_KEY = 'pe_demo_session';
const DEMO_EVENT_COUNT_KEY = 'pe_demo_event_count';
const GUEST_SESSION_DATA_KEY = 'guest_session_data';
const MAX_DEMO_EVENTS = 20;

interface GuestSessionData {
  products: any[];
  expenses: any[];
  customers: any[];
  businessContext: string | null;
  selectedRole: string | null;
}

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
  getGuestSessionData: () => GuestSessionData;
  setGuestSessionData: (data: Partial<GuestSessionData>) => void;
  addProduct: (product: any) => void;
  addExpense: (expense: any) => void;
  addCustomer: (customer: any) => void;
}

const GuestSessionContext = createContext<GuestSessionContextType | null>(null);

export function GuestSessionProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState(0);
  const [demoData, setDemoDataState] = useState<Record<string, any>>({});
  const [shouldShowUpgradePrompt, setShouldShowUpgradePrompt] = useState(false);
  const [guestSessionData, setGuestSessionDataState] = useState<GuestSessionData>({
    products: [],
    expenses: [],
    customers: [],
    businessContext: null,
    selectedRole: null,
  });

  // Initialize from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem(DEMO_SESSION_KEY);
    const storedCount = localStorage.getItem(DEMO_EVENT_COUNT_KEY);
    const storedGuestData = localStorage.getItem(GUEST_SESSION_DATA_KEY);

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setDemoDataState(parsed.data || {});
      } catch (e) {
        console.error('Failed to parse demo session:', e);
      }
    }

    if (storedGuestData) {
      try {
        const parsed = JSON.parse(storedGuestData);
        setGuestSessionDataState(parsed);
      } catch (e) {
        console.error('Failed to parse guest session data:', e);
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

  // Save to localStorage whenever demoData or guestSessionData changes
  useEffect(() => {
    const session: DemoSession = {
      isDemo: true,
      eventCount,
      data: demoData
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(DEMO_EVENT_COUNT_KEY, eventCount.toString());
    localStorage.setItem(GUEST_SESSION_DATA_KEY, JSON.stringify(guestSessionData));
  }, [eventCount, demoData, guestSessionData]);

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

  const getGuestSessionData = () => guestSessionData;

  const setGuestSessionData = (data: Partial<GuestSessionData>) => {
    setGuestSessionDataState(prev => ({ ...prev, ...data }));
  };

  const addProduct = (product: any) => {
    setGuestSessionDataState(prev => ({
      ...prev,
      products: [...prev.products, product]
    }));
    incrementEventCount();
  };

  const addExpense = (expense: any) => {
    setGuestSessionDataState(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense]
    }));
    incrementEventCount();
  };

  const addCustomer = (customer: any) => {
    setGuestSessionDataState(prev => ({
      ...prev,
      customers: [...prev.customers, customer]
    }));
    incrementEventCount();
  };

  const migrateToSupabase = async () => {
    // Store all demo data for migration after auth
    const migrationData = {
      demoData,
      eventCount,
      guestSessionData,
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
        migrateToSupabase,
        getGuestSessionData,
        setGuestSessionData,
        addProduct,
        addExpense,
        addCustomer,
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
