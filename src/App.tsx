import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import { GuestSessionProvider } from "@/contexts/GuestSessionProvider";

// Critical pages (loaded immediately)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SelectRole from "./pages/SelectRole";

// Lazy-loaded pages
const DemoStart = lazy(() => import("./pages/DemoStart"));
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
const EntrepreneurAnalyzing = lazy(() => import("./pages/onboarding/EntrepreneurAnalyzing"));
const EntrepreneurResults = lazy(() => import("./pages/onboarding/EntrepreneurResults"));
const EntrepreneurBusinessPlan = lazy(() => import("./pages/onboarding/EntrepreneurBusinessPlan"));
const EntrepreneurDashboard = lazy(() => import("./pages/entrepreneur/Dashboard"));

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
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white font-semibold">Cargando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/demo-start" element={<DemoStart />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/classify" element={<Classify />} />
              <Route path="/onboarding/entrepreneur/step1" element={<EntrepreneurStep1 />} />
              <Route path="/onboarding/entrepreneur/analyzing" element={<EntrepreneurAnalyzing />} />
              <Route path="/onboarding/entrepreneur/results" element={<EntrepreneurResults />} />
              <Route path="/onboarding/entrepreneur/business-plan" element={<EntrepreneurBusinessPlan />} />
              <Route path="/onboarding/entrepreneur/financial-simulator" element={<FinancialSimulator />} />
              <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
              
              {/* Demo routes */}
              <Route path="/demo/intro" element={<DemoIntro />} />
              <Route path="/demo/idea-capture" element={<DemoIdeaCapture />} />
              <Route path="/demo/analyzing" element={<DemoAnalyzing />} />
              <Route path="/demo/results" element={<DemoResults />} />
              <Route path="/demo/financial-simulator" element={<DemoFinancialSimulator />} />
              
              {/* Demo Entrepreneur routes */}
              <Route path="/demo/emprendedor/dashboard" element={<DemoEntrepreneurDashboard />} />
              <Route path="/demo/emprendedor/validacion-idea" element={<DemoEntrepreneurValidation />} />
              <Route path="/demo/emprendedor/simulador" element={<DemoFinancialSimulator />} />
              <Route path="/demo/emprendedor/lean-canvas" element={<DemoLeanCanvas />} />
              <Route path="/demo/emprendedor/checklist" element={<DemoChecklist />} />
              <Route path="/demo/emprendedor/recursos" element={<DemoRecursos />} />
              <Route path="/demo/emprendedor/configuracion" element={<DemoConfiguracion />} />
              <Route path="/demo/emprendedor/documentacion" element={<DemoEntrepreneurPlaceholder />} />
              
              <Route element={<DashboardLayout />}>
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
  </QueryClientProvider>
);

export default App;
