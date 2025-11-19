import { Search } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function MarketDetective() {
  return (
    <ToolPlaceholder
      title="Detective de Mercado"
      description="Tamaño, competidores, tendencias automáticas"
      icon={Search}
      color="from-cyan-500 to-blue-500"
    />
  );
}
