import { LayoutDashboard, ShoppingCart, Package, Users, Calendar, DollarSign, Store, BookOpen, Settings, Plug, Download } from "lucide-react";
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
  { title: "Mi Negocio", url: "/dashboard", icon: LayoutDashboard },
  { title: "Ventas", url: "/sales", icon: ShoppingCart },
  { title: "Productos", url: "/inventory", icon: Package },
  { title: "Clientes", url: "/customers", icon: Users },
  { title: "Turnos", url: "/appointments", icon: Calendar },
  { title: "Gastos", url: "/expenses", icon: DollarSign },
  { title: "Compras en Grupo", url: "/marketplace", icon: Store },
  { title: "Conectar", url: "/integrations", icon: Plug },
  { title: "Aprender", url: "/resources", icon: BookOpen },
  { title: "Respaldar", url: "/backup", icon: Download },
  { title: "Configuración", url: "/settings", icon: Settings },
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
                      <item.icon className="h-4 w-4" />
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
