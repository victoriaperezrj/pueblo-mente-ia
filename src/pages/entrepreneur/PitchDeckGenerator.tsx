import { FileText } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function PitchDeckGenerator() {
  return (
    <ToolPlaceholder
      title="Pitch Deck Generator"
      description="10 slides profesionales en 5 minutos"
      icon={FileText}
      color="from-pink-500 to-rose-600"
    />
  );
}
