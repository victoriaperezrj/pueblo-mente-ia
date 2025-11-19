import { MessageSquare } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function PitchOneLiner() {
  return (
    <ToolPlaceholder
      title="Pitch One-Liner"
      description="Crea tu elevator pitch perfecto en segundos"
      icon={MessageSquare}
      color="from-amber-500 to-orange-600"
    />
  );
}
