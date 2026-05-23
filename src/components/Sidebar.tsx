// components/Sidebar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  Search,
  History,
  Store,
  Users2Icon,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Home",
    path: "/home",
    icon: Store,
  },
  {
    name: "Buscar",
    path: "/search",
    icon: Search,
  },
  {
    name: "Historial",
    path: "/history",
    icon: History,
  },
  {
    name: "Proveedores",
    path: "/suppliers",
    icon: Users2Icon,
  },
  {
    name: "Configuración",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`h-full bg-gray-800 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-14" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">

        <button onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeft
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed && <span className="text-sm">© 2026</span>}
      </div>
    </aside>
  );
}