// src/components/dashboard/ToolsGrid.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Tool {
  id: number;
  icon: string;
  name: string;
  description: string;
  path: string;
  color: string;
}

interface ToolsGridProps {
  tools: Tool[];
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          onClick={() => navigate(tool.path)}
          className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all`}
        >
          <div className="text-4xl mb-3">{tool.icon}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tool.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
