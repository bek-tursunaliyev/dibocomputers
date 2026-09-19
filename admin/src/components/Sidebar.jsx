import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    navigate("/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-100">
        <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-xl object-cover" />
        <div>
          <p className="font-bold text-gray-900 leading-tight">DiboComputers</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          📦 Buyurtmalar
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          🖥️ Mahsulotlar
        </NavLink>
        <NavLink
          to="/stories"
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          🎬 Stories
        </NavLink>
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-500 hover:text-primary px-4 py-2.5 rounded-xl hover:bg-gray-50 text-left"
        >
          🚪 Chiqish
        </button>
      </div>
    </aside>
  );
}
