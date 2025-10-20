import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface Alerta {
  tipo: "warning" | "success" | "info";
  mensaje: string;
  timestamp: string;
}

interface AlertasPanelProps {
  alertas: Alerta[];
}

export function AlertasPanel({ alertas }: AlertasPanelProps) {
  const getIcon = (tipo: Alerta["tipo"]) => {
    switch (tipo) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getBgColor = (tipo: Alerta["tipo"]) => {
    switch (tipo) {
      case "warning":
        return "bg-orange/5 border-orange/20";
      case "success":
        return "bg-secondary/5 border-secondary/20";
      case "info":
        return "bg-primary/5 border-primary/20";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-apple p-6">
      <h4 className="font-semibold text-apple-gray-900 mb-4">Alertas Inteligentes</h4>
      <div className="space-y-3">
        {alertas.map((alerta, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${getBgColor(alerta.tipo)} transition-all hover:shadow-sm`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(alerta.tipo)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-apple-gray-700 mb-1">
                  {alerta.mensaje}
                </p>
                <span className="text-xs text-apple-gray-500">
                  {alerta.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
