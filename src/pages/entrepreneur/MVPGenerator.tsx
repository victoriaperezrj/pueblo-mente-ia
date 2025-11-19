import { Rocket } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function MVPGenerator() {
  return (
    <ToolPlaceholder
      title="Generador de MVP"
      description="Qué construir primero + timeline de 4 semanas"
      icon={Rocket}
      color="from-orange-500 to-red-500"
    />
  );
}
