import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Finder from "./pages/Finder";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminStories from "./pages/admin/AdminStories";
import BottomNav from "./components/BottomNav";
import { initTelegram } from "./lib/telegram";
import { useAdmin } from "./context/AdminContext";

function RequireAdmin({ children }) {
  const { isAdmin, adminChecked } = useAdmin();

  if (!adminChecked) {
    return <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem("onboarding_done") === "1"
  );

  useEffect(() => {
    initTelegram();
  }, []);

  if (!onboardingDone) {
    return <Onboarding onFinish={() => setOnboardingDone(true)} />;
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/finder" element={<Finder />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="stories" element={<AdminStories />} />
        </Route>
      </Routes>
      <BottomNav />
    </div>
  );
}
