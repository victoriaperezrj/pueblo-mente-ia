import { Home, ShoppingCart, Package, Users, Calendar, DollarSign, ShoppingBag, Link, BookOpen, Download, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Inicio", url: "/dashboard", icon: Home, color: "#60A5FA" },
  { title: "Ventas", url: "/sales", icon: ShoppingCart, color: "#34D399" },
  { title: "Productos", url: "/inventory", icon: Package, color: "#F59E0B" },
  { title: "Clientes", url: "/customers", icon: Users, color: "#A78BFA" },
  { title: "Turnos", url: "/appointments", icon: Calendar, color: "#FB923C" },
  { title: "Gastos", url: "/expenses", icon: DollarSign, color: "#EF4444" },
  { title: "Compras en Grupo", url: "/marketplace", icon: ShoppingBag, color: "#EC4899" },
  { title: "Conectar", url: "/integrations", icon: Link, color: "#06B6D4" },
  { title: "Aprender", url: "/resources", icon: BookOpen, color: "#10B981" },
  { title: "Respaldar", url: "/backup", icon: Download, color: "#8B5CF6" },
  { title: "Configuración", url: "/settings", icon: Settings, color: "#6B7280" },
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
