import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  Calculator,
  Grid3x3,
  Map,
  BookOpen,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    section: "Principal",
    items: [
      { icon: LayoutDashboard, title: "Dashboard", url: "/entrepreneur/dashboard" },
      { icon: Lightbulb, title: "Validación", url: "/entrepreneur/validation" },
      { icon: Calculator, title: "Simulador", url: "/entrepreneur/simulator" },
      { icon: Grid3x3, title: "Lean Canvas", url: "/entrepreneur/lean-canvas" },
      { icon: Map, title: "Roadmap", url: "/entrepreneur/roadmap" },
    ],
  },
  {
    section: "Recursos",
    items: [
      { icon: BookOpen, title: "Recursos", url: "/entrepreneur/resources" },
      { icon: Users, title: "Comunidad", url: "/entrepreneur/community" },
    ],
  },
  {
    section: "Configuración",
    items: [
      { icon: Settings, title: "Settings", url: "/settings" },
      { icon: HelpCircle, title: "Help", url: "/help" },
    ],
  },
];

export function EntrepreneurSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative bg-background border-r border-border h-screen flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--entrepreneur))] to-purple-600 text-transparent bg-clip-text"
          >
            EmprendIA
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--entrepreneur))] to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </div>
            )}
            {collapsed && <div className="border-t border-border my-2" />}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-[hsl(var(--entrepreneur))]/10 text-[hsl(var(--entrepreneur))] font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--entrepreneur))] rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="truncate"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-20 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
