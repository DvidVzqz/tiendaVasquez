// components/Sidebar.tsx
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  Search,
  History,
  Store,
  Users2Icon,
  Plus,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { deleteCartStore, getActiveCartIds } from "../hooks/useCartStore";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Buscar", path: "/search", icon: Search },
  { name: "Historial", path: "/history", icon: History },
  { name: "Proveedores", path: "/suppliers", icon: Users2Icon },
  { name: "Configuración", path: "/settings", icon: Settings },
];

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(true);
  const [activeSales, setActiveSales] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  // Cada vez que la ruta cambia, refrescamos la lista de ventas activas
  useEffect(() => {
    setActiveSales(getActiveCartIds());
  }, [location]);

  const handleCreateNewSale = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newId = crypto.randomUUID().substring(0, 8);
    setCollapsed(true);
    navigate(`/home/${newId}`);
  };

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

        {/* ELEMENTO ESPECIAL: HOME / VENTAS */}
        <div className="space-y-1">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 group text-gray-300">
            <button onClick={handleCreateNewSale} className="flex items-center gap-3">
              <Plus size={20} />
              {!collapsed && <span className="font-medium">Agregar Venta</span>}
            </button>

            {!collapsed && (
              <button
                onClick={handleCreateNewSale}
                className="p-1 hover:bg-blue-600 bg-blue-500 rounded text-white transition-colors"
                title="Nueva Venta"
              >
                <Store size={16} />
              </button>
            )}
          </div>

          {/* Sublista de Ventas Activas (Solo si no está colapsado) */}
          {activeSales.length > 0 && (
            <div className={`${!collapsed ? 'pl-6  ml-5' : ''} space-y-1 border-l border-gray-700`}>
              {activeSales.map((id, index) => (
                <NavLink
                  key={id}
                  to={`/home/${id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded-md text-sm transition-colors
                    ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`
                  }
                >
                  <ShoppingBag size={14} />
                  <span className="truncate">{!collapsed ? `Venta #${index + 1} (${id})` : index + 1}</span>
                  {!collapsed && (
                    <button
                      onClick={() => deleteCartStore(id)}
                      className="p-1 hover:bg-blue-600 bg-blue-500 rounded text-white transition-colors"
                      title="Eliminar Venta"
                    >
                      <Trash size={13} />
                    </button>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`
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