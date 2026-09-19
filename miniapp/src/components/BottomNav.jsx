import { NavLink } from "react-router-dom";
import { House, Search, ShoppingCart, User, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";
import { ADMIN_URL } from "../config";
import { openExternalLink } from "../lib/telegram";

const tabs = [
  { to: "/", label: "Bosh sahifa", Icon: House },
  { to: "/catalog", label: "Katalog", Icon: Search },
  { to: "/cart", label: "Savatcha", Icon: ShoppingCart },
  { to: "/profile", label: "Profil", Icon: User },
];

export default function BottomNav() {
  const { count } = useCart();
  const { isAdmin, adminToken } = useAdmin();

  function openAdminPanel() {
    openExternalLink(`${ADMIN_URL}?token=${encodeURIComponent(adminToken)}`);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 safe-bottom z-40">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center flex-1 h-full text-[10px] ${
              isActive ? "text-primary font-semibold" : "text-gray-400"
            }`
          }
        >
          <Icon size={22} strokeWidth={2} className="mb-1" />
          {label}
          {to === "/cart" && count > 0 && (
            <span className="absolute top-1 right-6 bg-primary text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </NavLink>
      ))}

      {isAdmin && (
        <button
          onClick={openAdminPanel}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] text-gray-400"
        >
          <ShieldCheck size={22} strokeWidth={2} className="mb-1" />
          Admin panel
        </button>
      )}
    </nav>
  );
}
