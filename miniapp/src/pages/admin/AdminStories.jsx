import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { useAdmin } from "../../context/AdminContext";
import { getIcon } from "../../lib/icons";
import AdminStoryForm from "./AdminStoryForm";

export default function AdminStories() {
  const { adminToken } = useAdmin();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formStory, setFormStory] = useState(undefined);
  const [error, setError] = useState("");

  const loadData = useCallback(() => {
    api
      .getStories()
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDelete(id) {
    if (!confirm("Rostdan ham ushbu story'ni o'chirmoqchimisiz?")) return;
    setError("");
    try {
      await api.deleteStory(adminToken, id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSaved() {
    setFormStory(undefined);
    loadData();
  }

  if (loading) return <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>;

  return (
    <div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

      <button
        onClick={() => setFormStory(null)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 rounded-2xl mb-4"
      >
        <Plus size={18} />
        Yangi story qo'shish
      </button>

      {stories.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Hozircha story yo'q</p>
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((story) => {
            const Icon = getIcon(story.icon);
            return (
              <div key={story.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{story.label}</p>
                  <p className="text-xs text-gray-400 truncate">{story.title}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setFormStory(story)} className="text-primary p-1.5">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(story.id)} className="text-red-500 p-1.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formStory !== undefined && (
        <AdminStoryForm story={formStory} onClose={() => setFormStory(undefined)} onSaved={handleSaved} />
      )}
    </div>
  );
}
