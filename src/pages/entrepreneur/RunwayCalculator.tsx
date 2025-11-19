import { BarChart3 } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function RunwayCalculator() {
  return (
    <ToolPlaceholder
      title="Calculadora de Runway"
      description="Calcula cuántos meses de vida tiene tu startup"
      icon={BarChart3}
      color="from-blue-500 to-indigo-600"
    />
  );
}
