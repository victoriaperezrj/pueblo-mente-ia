import { Megaphone } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function LandingGenerator() {
  return (
    <ToolPlaceholder
      title="Landing Page Generator"
      description="Genera copy y estructura de landing con IA"
      icon={Megaphone}
      color="from-rose-500 to-pink-600"
    />
  );
}
