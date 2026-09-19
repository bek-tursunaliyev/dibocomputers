import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const tabs = [
  { to: "/admin", label: "Buyurtmalar", end: true },
  { to: "/admin/products", label: "Mahsulotlar" },
  { to: "/admin/stories", label: "Stories" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-30">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="font-bold text-gray-900">Admin panel</h1>
          <button onClick={() => navigate("/")} className="text-gray-400">
            <X size={22} />
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium ${
                  isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4">
        <Outlet />
      </div>
    </div>
  );
}
