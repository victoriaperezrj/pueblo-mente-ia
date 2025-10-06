import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Store, Building2, Check } from "lucide-react";

type UserType = 'entrepreneur' | 'business_owner' | 'enterprise';

const SelectRole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);

  const handleSelect = (type: UserType) => {
    setSelectedRole(type);
    // Store role selection in localStorage for after auth
    localStorage.setItem('pending_role', type);
    // Navigate to auth page
    navigate('/auth');
  };

  const handleSkipToDemo = () => {
    navigate('/demo/intro');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¿En qué etapa estás?
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Elegí la opción que mejor te describa
          </p>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleSkipToDemo}
            size="lg"
            className="border-2"
          >
            Explorar Demo Primero
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* OPCIÓN 1: EMPRENDEDOR */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-purple-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
              Validación
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Tengo una Idea
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Todavía no arranqué. Quiero validar si mi idea funciona, armar el plan y calcular los números antes de invertir.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Validación de viabilidad realista</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Plan de negocio paso a paso</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Simulador financiero con inflación</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Calculadora de producción</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('entrepreneur')}
            >
              Empezar Validación →
            </Button>
          </Card>

          {/* OPCIÓN 2: NEGOCIO ACTIVO */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-blue-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
              Control
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Ya Tengo mi Negocio
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mi emprendimiento está funcionando pero llevo todo a mano o en Excel. Quiero organizarme mejor y crecer.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Registrar ventas y gastos fácil</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Controlar inventario en tiempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Gestionar clientes y agenda</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ver reportes y números claros</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('business_owner')}
            >
              Organizar mi Negocio →
            </Button>
          </Card>

          {/* OPCIÓN 3: PYME/EMPRESA */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-emerald-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
              Automatización
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Soy PYME/Empresa
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tengo un negocio establecido con equipo y procesos. Quiero automatizar, innovar y escalar con IA.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automatización de workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>IA predictiva y análisis avanzado</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Gestión multi-sucursal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Integraciones personalizadas</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('enterprise')}
            >
              Innovar y Automatizar →
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SelectRole;
