import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import StoryModal from "../components/StoryModal";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalStory, setModalStory] = useState(undefined);

  const loadData = useCallback(() => {
    api.getStories().then((data) => {
      setStories(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDelete(id) {
    if (!confirm("Rostdan ham ushbu story'ni o'chirmoqchimisiz?")) return;
    await api.deleteStory(id);
    loadData();
  }

  function handleSaved() {
    setModalStory(undefined);
    loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <button
          onClick={() => setModalStory(null)}
          className="bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          + Yangi story
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Tartib</th>
              <th className="px-4 py-3">Ko'rinishi</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Sarlavha</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Hozircha story yo'q
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr key={story.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{story.order}</td>
                  <td className="px-4 py-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.gradient}`} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{story.label}</td>
                  <td className="px-4 py-3 text-gray-600">{story.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModalStory(story)} className="text-primary text-xs font-medium">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(story.id)} className="text-red-500 text-xs font-medium">
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalStory !== undefined && (
        <StoryModal story={modalStory} onClose={() => setModalStory(undefined)} onSaved={handleSaved} />
      )}
    </div>
  );
}
