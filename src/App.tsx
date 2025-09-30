import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShoppingCart, Package, Users, Calendar, DollarSign, Store, BookOpen, Settings } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import PlaceholderPage from "./pages/PlaceholderPage";
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
            <Route
              path="/sales"
              element={<PlaceholderPage title="Ventas" description="Gestión de ventas y transacciones" icon={<ShoppingCart className="h-6 w-6" />} />}
            />
            <Route
              path="/inventory"
              element={<PlaceholderPage title="Inventario" description="Control de stock y productos" icon={<Package className="h-6 w-6" />} />}
            />
            <Route
              path="/customers"
              element={<PlaceholderPage title="Clientes" description="Base de datos de clientes" icon={<Users className="h-6 w-6" />} />}
            />
            <Route
              path="/appointments"
              element={<PlaceholderPage title="Turnos" description="Gestión de citas y reservas" icon={<Calendar className="h-6 w-6" />} />}
            />
            <Route
              path="/expenses"
              element={<PlaceholderPage title="Gastos" description="Control de gastos y finanzas" icon={<DollarSign className="h-6 w-6" />} />}
            />
            <Route
              path="/marketplace"
              element={<PlaceholderPage title="Marketplace" description="Conectá con proveedores locales" icon={<Store className="h-6 w-6" />} />}
            />
            <Route
              path="/resources"
              element={<PlaceholderPage title="Recursos" description="Biblioteca de contenido educativo" icon={<BookOpen className="h-6 w-6" />} />}
            />
            <Route
              path="/settings"
              element={<PlaceholderPage title="Configuración" description="Ajustes de tu cuenta y negocio" icon={<Settings className="h-6 w-6" />} />}
            />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
