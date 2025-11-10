import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  color: "blue" | "green" | "purple" | "orange";
  delay?: number;
}

const colorClasses = {
  blue: "from-[hsl(var(--entrepreneur))] to-blue-600",
  green: "from-green-500 to-emerald-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-red-500",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendPositive,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-card rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
            colorClasses[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
              trendPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-2">{subtitle}</div>
      )}
    </motion.div>
  );
}
