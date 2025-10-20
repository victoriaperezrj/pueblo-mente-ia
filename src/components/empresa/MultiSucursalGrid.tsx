import { MapPin, Users, TrendingUp } from "lucide-react";

interface Sucursal {
  id: string;
  nombre: string;
  ventas: number;
  margen: number;
  empleados: number;
}

interface MultiSucursalGridProps {
  sucursales: Sucursal[];
}

export function MultiSucursalGrid({ sucursales }: MultiSucursalGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sucursales.map((sucursal, index) => (
        <div 
          key={sucursal.id}
          className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover-lift-sm"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-apple-gray-900">{sucursal.nombre}</h4>
              <div className="flex items-center gap-1 text-xs text-apple-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span>Buenos Aires, AR</span>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
              sucursal.margen >= 28 
                ? "bg-secondary/10 text-secondary" 
                : "bg-orange/10 text-orange"
            }`}>
              {sucursal.margen}% margen
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-apple-gray-600 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Ventas</span>
              </div>
              <div className="font-bold text-lg text-apple-gray-900">
                ${(sucursal.ventas / 1000).toFixed(0)}k
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-apple-gray-600 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Empleados</span>
              </div>
              <div className="font-bold text-lg text-apple-gray-900">
                {sucursal.empleados}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
