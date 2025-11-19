import { Beaker } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function ExperimentsTracker() {
  return (
    <ToolPlaceholder
      title="Tracker de Experimentos"
      description="Hipótesis, costos, resultados, learnings"
      icon={Beaker}
      color="from-teal-500 to-cyan-600"
    />
  );
}
