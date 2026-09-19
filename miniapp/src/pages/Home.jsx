import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Wand2 } from "lucide-react";
import StoryBar from "../components/StoryBar";
import { getTelegramUser } from "../lib/telegram";
import { BRAND } from "../config";

export default function Home() {
  const navigate = useNavigate();
  const user = getTelegramUser();

  return (
    <div className="pb-20">
      <header className="flex items-center gap-3 px-4 pt-5 pb-2">
        <img src="/logo.png" alt="logo" className="w-11 h-11 rounded-xl object-cover" />
        <div>
          <p className="text-sm text-gray-500">Xush kelibsiz,</p>
          <p className="font-semibold text-gray-900">{user.first_name}</p>
        </div>
      </header>

      <StoryBar />

      <div className="mx-4 mt-2 rounded-3xl bg-gradient-to-br from-primary to-red-700 p-6 text-white flex flex-col gap-4">
        <div>
          <p className="text-sm opacity-90">{BRAND.name}</p>
          <h2 className="text-2xl font-bold mt-1">Yangi buyurtma berish</h2>
          <p className="text-sm opacity-80 mt-1">Eng so'nggi noutbuk va kompyuterlar shu yerda</p>
        </div>
        <button
          onClick={() => navigate("/catalog")}
          className="bg-white text-primary font-semibold py-3 rounded-2xl self-start px-6"
        >
          Katalogni ko'rish
        </button>
      </div>

      <button
        onClick={() => navigate("/finder")}
        className="mx-4 mt-4 rounded-3xl bg-white border border-gray-100 p-5 flex items-center gap-4 text-left w-[calc(100%-32px)] shadow-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Wand2 size={24} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Qanday kompyuter kerakligini bilmayapsizmi?</p>
          <p className="text-sm text-gray-500 mt-0.5">6 ta savolga javob bering — sizga mos noutbukni tavsiya qilamiz</p>
        </div>
      </button>

      <div className="mx-4 mt-5 bg-white rounded-2xl p-4 flex flex-col gap-2">
        <p className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          {BRAND.name}
        </p>
        <p className="text-sm text-gray-500 pl-6">{BRAND.address}</p>
        <p className="text-sm text-gray-500 flex items-center gap-2 pl-0.5">
          <Phone size={14} className="text-primary" />
          {BRAND.phones[0]}
        </p>
      </div>
    </div>
  );
}
