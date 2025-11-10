import { Plus, Download, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export function QuickActionsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="bg-card border-t border-border px-8 py-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--entrepreneur))] to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva validación
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-xl font-semibold hover:border-[hsl(var(--entrepreneur))] hover:text-[hsl(var(--entrepreneur))] hover:shadow-md transition-all"
        >
          <Download className="w-5 h-5" />
          Exportar datos
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 hover:shadow-md transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          Ver tutorial
        </motion.button>
      </div>
    </motion.div>
  );
}
