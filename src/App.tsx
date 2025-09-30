import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Appointments from "./pages/Appointments";
import Marketplace from "./pages/Marketplace";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import DashboardLayout from "./pages/DashboardLayout";
import NotFound from "./pages/NotFound";

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
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
