import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";
import { useAdmin } from "../../context/AdminContext";
import { ICON_OPTIONS, GRADIENT_OPTIONS } from "../../lib/storyOptions";
import { getIcon } from "../../lib/icons";

const emptyForm = {
  label: "",
  icon: ICON_OPTIONS[0].value,
  gradient: GRADIENT_OPTIONS[0].value,
  title: "",
  text: "",
  order: 0,
};

export default function AdminStoryForm({ story, onClose, onSaved }) {
  const { adminToken } = useAdmin();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (story) {
      setForm({
        label: story.label || "",
        icon: story.icon || ICON_OPTIONS[0].value,
        gradient: story.gradient || GRADIENT_OPTIONS[0].value,
        title: story.title || "",
        text: story.text || "",
        order: story.order ?? 0,
      });
    }
  }, [story]);

  const PreviewIcon = getIcon(form.icon);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (story) {
        await api.updateStory(adminToken, story.id, payload);
      } else {
        await api.createStory(adminToken, payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <header className="sticky top-0 bg-white border-b border-gray-100 flex items-center gap-3 px-4 py-4">
        <button onClick={onClose} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-900">{story ? "Story'ni tahrirlash" : "Yangi story"}</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 pb-10 flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className={`h-28 rounded-2xl bg-gradient-to-br ${form.gradient} flex flex-col items-center justify-center gap-2 text-white`}>
          <PreviewIcon size={28} />
          <span className="text-sm font-medium">{form.title || "Ko'rinish"}</span>
        </div>

        <div>
          <label className="text-sm text-gray-600">Doiradagi nomi (label)</label>
          <input
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Ikonka</label>
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Rang (gradient)</label>
          <select
            value={form.gradient}
            onChange={(e) => setForm({ ...form, gradient: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            {GRADIENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">To'liq ekrandagi sarlavha</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To'liq ekrandagi matn</label>
          <textarea
            required
            rows={3}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Tartib raqami</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl disabled:opacity-60 mt-2"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
