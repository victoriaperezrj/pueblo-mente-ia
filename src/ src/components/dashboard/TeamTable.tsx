// src/components/dashboard/TeamTable.tsx
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: string;
  performance: number;
}

interface TeamTableProps {
  data: TeamMember[];
}

export function TeamTable({ data }: TeamTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Desempeño
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((member, index) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {member.name}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {member.role}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${member.performance}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {member.performance}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
