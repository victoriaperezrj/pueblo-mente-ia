import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";

// Critical pages (loaded immediately)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DemoStart from "./pages/DemoStart";

// Lazy-loaded pages
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

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DemoProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </DemoProvider>
  </QueryClientProvider>
);

export default App;
