import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Classify from "./pages/onboarding/Classify";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Appointments from "./pages/Appointments";
import Marketplace from "./pages/Marketplace";
import Integrations from "./pages/Integrations";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import IdeaValidator from "./pages/IdeaValidator";
import BusinessBlueprint from "./pages/BusinessBlueprint";
import FinancialSimulator from "./pages/FinancialSimulator";
import DashboardLayout from "./pages/DashboardLayout";
import NotFound from "./pages/NotFound";
import DataBackup from "./pages/DataBackup";
import EntrepreneurStep1 from "./pages/onboarding/EntrepreneurStep1";
import EntrepreneurAnalyzing from "./pages/onboarding/EntrepreneurAnalyzing";
import EntrepreneurResults from "./pages/onboarding/EntrepreneurResults";
import EntrepreneurBusinessPlan from "./pages/onboarding/EntrepreneurBusinessPlan";
import EntrepreneurDashboard from "./pages/entrepreneur/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/classify" element={<Classify />} />
          <Route path="/onboarding/entrepreneur/step1" element={<EntrepreneurStep1 />} />
          <Route path="/onboarding/entrepreneur/analyzing" element={<EntrepreneurAnalyzing />} />
          <Route path="/onboarding/entrepreneur/results" element={<EntrepreneurResults />} />
          <Route path="/onboarding/entrepreneur/business-plan" element={<EntrepreneurBusinessPlan />} />
          <Route path="/onboarding/entrepreneur/financial-simulator" element={<FinancialSimulator />} />
          <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
