import { motion } from "framer-motion";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function ToolPlaceholder({ title, description, icon: Icon, color }: ToolPlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className={`w-24 h-24 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
          <Icon className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/70 mb-6">{description}</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
            <Construction className="w-5 h-5" />
            <span className="font-semibold">En Desarrollo</span>
          </div>
          <p className="text-white/60 text-sm">
            Esta herramienta estará disponible muy pronto. Estamos trabajando para brindarte la mejor experiencia.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-purple-300 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>

        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
