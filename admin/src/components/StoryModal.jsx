import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { ICON_OPTIONS, GRADIENT_OPTIONS } from "../lib/storyOptions";

const emptyForm = {
  label: "",
  icon: ICON_OPTIONS[0].value,
  gradient: GRADIENT_OPTIONS[0].value,
  title: "",
  text: "",
  order: 0,
};

export default function StoryModal({ story, onClose, onSaved }) {
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
        order: story.order || 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [story]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (story) {
        await api.updateStory(story.id, payload);
      } else {
        await api.createStory(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {story ? "Story'ni tahrirlash" : "Yangi story qo'shish"}
        </h2>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <div className="mb-4 rounded-2xl overflow-hidden">
          <div className={`h-24 bg-gradient-to-br ${form.gradient} flex items-center justify-center text-white text-sm font-medium`}>
            {form.title || "Ko'rinish (preview)"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm text-gray-600">Doiradagi nomi (label)</label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Masalan: Chegirmalar"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Tartib raqami</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Ikonka</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
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
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {GRADIENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">To'liq ekrandagi sarlavha</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">To'liq ekrandagi matn</label>
            <textarea
              required
              rows={3}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
