import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getIcon } from "../lib/icons";
import StoryViewer from "./StoryViewer";

export default function StoryBar() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    api.getStories().then(setStories).catch(() => {});
  }, []);

  if (stories.length === 0) return null;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 py-3">
        {stories.map((story, index) => {
          const Icon = getIcon(story.icon);
          return (
            <button
              key={story.id}
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${story.gradient} p-[2px]`}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Icon size={26} className="text-gray-700" strokeWidth={1.75} />
                </div>
              </div>
              <span className="text-[11px] text-gray-600">{story.label}</span>
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <StoryViewer stories={stories} startIndex={activeIndex} onClose={() => setActiveIndex(null)} />
      )}
    </>
  );
}
