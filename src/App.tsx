import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import { GuestSessionProvider } from "@/contexts/GuestSessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Critical pages (loaded immediately)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SelectRole from "./pages/SelectRole";
import DemoSelectRole from "./pages/DemoSelectRole";

// Lazy-loaded pages
const SignupFlow = lazy(() => import("./pages/auth/SignupFlow"));
const NewOnboarding = lazy(() => import("./pages/NewOnboarding"));
const EntrepreneurDashboardPage = lazy(() => import("./pages/dashboards/EntrepreneurDashboard"));
const BusinessDashboardPage = lazy(() => import("./pages/dashboards/BusinessDashboard"));
const PymeDashboardPage = lazy(() => import("./pages/dashboards/PymeDashboard"));
const IdeaValidatorPage = lazy(() => import("./pages/tools/IdeaValidatorPage"));
const CRMPage = lazy(() => import("./pages/business/CRM"));
const AnalyticsPage = lazy(() => import("./pages/business/Analytics"));
const ProfitabilityPage = lazy(() => import("./pages/business/Profitability"));
const PriceOptimizerPage = lazy(() => import("./pages/business/PriceOptimizer"));
const DemoBusinessDashboard = lazy(() => import("./pages/demo/BusinessDashboard"));
const DemoCompanyDashboard = lazy(() => import("./pages/demo/CompanyDashboard"));
const DemoStart = lazy(() => import("./pages/DemoStart"));
const BusinessAIBot = lazy(() => import("./pages/BusinessAIBot"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Classify = lazy(() => import("./pages/onboarding/Classify"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Sales = lazy(() => import("./pages/Sales"));
const Customers = lazy(() => import("./pages/Customers"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Resources = lazy(() => import("./pages/Resources"));
const Settings = lazy(() => import("./pages/Settings"));
const IdeaValidator = lazy(() => import("./pages/IdeaValidator"));
const BusinessBlueprint = lazy(() => import("./pages/BusinessBlueprint"));
const FinancialSimulator = lazy(() => import("./pages/FinancialSimulator"));
const DashboardLayout = lazy(() => import("./pages/DashboardLayout"));
const DataBackup = lazy(() => import("./pages/DataBackup"));
const EntrepreneurStep1 = lazy(() => import("./pages/onboarding/EntrepreneurStep1"));
const IdeaValidation = lazy(() => import("./pages/entrepreneur/IdeaValidation"));
const EntrepreneurAnalyzing = lazy(() => import("./pages/onboarding/EntrepreneurAnalyzing"));
const EntrepreneurResults = lazy(() => import("./pages/onboarding/EntrepreneurResults"));
const EntrepreneurBusinessPlan = lazy(() => import("./pages/onboarding/EntrepreneurBusinessPlan"));
const BusinessStage = lazy(() => import("./pages/onboarding/BusinessStage"));
const EntrepreneurDashboard = lazy(() => import("./pages/entrepreneur/Dashboard"));
const BusinessDashboard = lazy(() => import("./pages/business/Dashboard"));
const PymeDashboard = lazy(() => import("./pages/pyme/Dashboard"));

// Demo pages
const DemoIntro = lazy(() => import("./pages/demo/DemoIntro"));
const DemoIdeaCapture = lazy(() => import("./pages/demo/DemoIdeaCapture"));
const DemoAnalyzing = lazy(() => import("./pages/demo/DemoAnalyzing"));
const DemoResults = lazy(() => import("./pages/demo/DemoResults"));
const DemoFinancialSimulator = lazy(() => import("./pages/demo/DemoFinancialSimulator"));
const DemoEntrepreneurDashboard = lazy(() => import("./pages/demo/entrepreneur/Dashboard"));
const DemoEntrepreneurPlaceholder = lazy(() => import("./pages/demo/entrepreneur/Placeholder"));
const DemoEntrepreneurValidation = lazy(() => import("./pages/demo/entrepreneur/ValidationIdea"));
const DemoLeanCanvas = lazy(() => import("./pages/demo/entrepreneur/LeanCanvas"));
const DemoChecklist = lazy(() => import("./pages/demo/entrepreneur/Checklist"));
const DemoRecursos = lazy(() => import("./pages/demo/entrepreneur/Recursos"));
const DemoConfiguracion = lazy(() => import("./pages/demo/entrepreneur/Configuracion"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white font-semibold">Cargando experiencia...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GuestSessionProvider>
            <DemoProvider>
              <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/demo/select-role" element={<DemoSelectRole />} />
              <Route path="/auth/signup" element={<SignupFlow />} />
              <Route path="/onboarding-new" element={<NewOnboarding />} />
              <Route path="/dashboard" element={<EntrepreneurDashboardPage />} />
              <Route path="/dashboard/business" element={<BusinessDashboardPage />} />
              <Route path="/dashboard/pyme" element={<PymeDashboardPage />} />
              <Route path="/tools/idea-validator" element={<IdeaValidatorPage />} />
              <Route path="/auth" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>} />
                <Route path="/business-ai-bot" element={<BusinessAIBot />} />
                <Route path="/demo-start" element={<DemoStart />} />
              
              {/* Onboarding routes - classify is public for demo, rest are protected */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/onboarding/classify" element={<Classify />} />
              <Route path="/onboarding/business-stage" element={<ProtectedRoute><BusinessStage /></ProtectedRoute>} />
              <Route path="/onboarding/entrepreneur/step1" element={<ProtectedRoute><EntrepreneurStep1 /></ProtectedRoute>} />
              <Route path="/onboarding/entrepreneur/analyzing" element={<ProtectedRoute><EntrepreneurAnalyzing /></ProtectedRoute>} />
              <Route path="/onboarding/entrepreneur/results" element={<ProtectedRoute><EntrepreneurResults /></ProtectedRoute>} />
              <Route path="/onboarding/entrepreneur/business-plan" element={<ProtectedRoute><EntrepreneurBusinessPlan /></ProtectedRoute>} />
              <Route path="/onboarding/entrepreneur/financial-simulator" element={<ProtectedRoute><FinancialSimulator /></ProtectedRoute>} />
              
              {/* Role-specific dashboards - protected */}
              <Route path="/entrepreneur/dashboard" element={<ProtectedRoute><EntrepreneurDashboard /></ProtectedRoute>} />
              <Route path="/emprendedor/validacion" element={<ProtectedRoute><IdeaValidation /></ProtectedRoute>} />
              <Route path="/entrepreneur/validation" element={<ProtectedRoute><IdeaValidation /></ProtectedRoute>} />
              <Route path="/business/dashboard" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
              <Route path="/pyme/dashboard" element={<ProtectedRoute><PymeDashboard /></ProtectedRoute>} />
              
              {/* Business ecosystem routes */}
              <Route path="/business/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
              <Route path="/business/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/business/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/business/profitability" element={<ProtectedRoute><ProfitabilityPage /></ProtectedRoute>} />
              <Route path="/business/price-optimizer" element={<ProtectedRoute><PriceOptimizerPage /></ProtectedRoute>} />
              
              {/* Demo routes */}
              <Route path="/demo/intro" element={<DemoIntro />} />
              <Route path="/demo/idea-capture" element={<DemoIdeaCapture />} />
              <Route path="/demo/analyzing" element={<DemoAnalyzing />} />
              <Route path="/demo/results" element={<DemoResults />} />
              <Route path="/demo/financial-simulator" element={<DemoFinancialSimulator />} />
              
              {/* Demo Entrepreneur routes */}
              <Route path="/demo/emprendedor/dashboard" element={<DemoEntrepreneurDashboard />} />
              <Route path="/demo/entrepreneur/dashboard" element={<DemoEntrepreneurDashboard />} />
              <Route path="/demo/emprendedor/validacion-idea" element={<DemoEntrepreneurValidation />} />
              <Route path="/demo/emprendedor/simulador" element={<DemoFinancialSimulator />} />
              <Route path="/demo/emprendedor/lean-canvas" element={<DemoLeanCanvas />} />
              <Route path="/demo/emprendedor/checklist" element={<DemoChecklist />} />
              <Route path="/demo/emprendedor/recursos" element={<DemoRecursos />} />
              <Route path="/demo/emprendedor/configuracion" element={<DemoConfiguracion />} />
              <Route path="/demo/emprendedor/documentacion" element={<DemoEntrepreneurPlaceholder />} />
              
              {/* Demo Business/PYME routes */}
              <Route path="/demo/business-dashboard" element={<DemoBusinessDashboard />} />
              <Route path="/demo/company-dashboard" element={<DemoCompanyDashboard />} />
              <Route path="/demo/negocio/dashboard" element={<DemoEntrepreneurDashboard />} />
              <Route path="/demo/pyme/dashboard" element={<DemoEntrepreneurDashboard />} />
              
              {/* Business/Pyme routes with DashboardLayout - protected */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/idea-validator" element={<IdeaValidator />} />
                <Route path="/business-blueprint" element={<BusinessBlueprint />} />
                <Route path="/financial-simulator" element={<FinancialSimulator />} />
                <Route path="/backup" element={<DataBackup />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </DemoProvider>
        </GuestSessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
