import { Calendar } from "lucide-react";
import ToolPlaceholder from "./ToolPlaceholder";

export default function Roadmap() {
  return (
    <ToolPlaceholder
      title="Roadmap 90 días"
      description="Timeline visual con milestones y confetti"
      icon={Calendar}
      color="from-indigo-500 to-purple-600"
    />
  );
}
