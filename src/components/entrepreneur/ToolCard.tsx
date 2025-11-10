import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  color: string;
  route: string;
  delay?: number;
}

export function ToolCard({
  icon: Icon,
  title,
  description,
  badge,
  color,
  route,
  delay = 0,
}: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Link to={route}>
        <div className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-[hsl(var(--entrepreneur))]/50 cursor-pointer h-full">
          {/* Badge */}
          {badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full shadow-md"
            >
              {badge}
            </motion.span>
          )}

          {/* Icon */}
          <div
            className={cn(
              "w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform shadow-lg",
              color
            )}
          >
            <Icon className="w-8 h-8" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[hsl(var(--entrepreneur))] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center text-[hsl(var(--entrepreneur))] font-semibold text-sm group-hover:translate-x-2 transition-transform">
            Empezar
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
