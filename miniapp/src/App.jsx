import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Finder from "./pages/Finder";
import BottomNav from "./components/BottomNav";
import { initTelegram } from "./lib/telegram";

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
      </Routes>
      <BottomNav />
    </div>
  );
}
