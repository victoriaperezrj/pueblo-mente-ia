import { Globe } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function LaunchStrategy() {
  return (
    <ToolPlaceholder
      title="Estrategia de Lanzamiento"
      description="Plan de go-to-market personalizado con IA"
      icon={Globe}
      color="from-green-500 to-teal-600"
    />
  );
}
