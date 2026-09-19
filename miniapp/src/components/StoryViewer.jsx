import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getIcon } from "../lib/icons";

const DURATION = 4000;

export default function StoryViewer({ stories, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const pausedRef = useRef(false);

  const story = stories[index];
  const Icon = getIcon(story.icon);

  function goNext() {
    setIndex((i) => {
      if (i >= stories.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
    setProgress(0);
    startRef.current = null;
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
    setProgress(0);
    startRef.current = null;
  }

  useEffect(() => {
    function tick(timestamp) {
      if (pausedRef.current) {
        startRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct >= 100) {
        goNext();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onPointerDown={() => (pausedRef.current = true)}
      onPointerUp={() => (pausedRef.current = false)}
    >
      <div className="flex gap-1.5 px-3 pt-4 safe-top">
        {stories.map((s, i) => (
          <div key={s.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: i < index ? "100%" : i === index ? `${progress}%` : "0%",
                transition: i === index ? "none" : "width 0.2s",
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute top-8 right-3 w-9 h-9 rounded-full bg-black/30 flex items-center justify-center text-white z-10"
      >
        <X size={20} />
      </button>

      <div className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-br ${story.gradient} px-8 relative`}>
        <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mb-6">
          <Icon size={48} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-white text-2xl font-bold text-center mb-3">{story.title}</h2>
        <p className="text-white/90 text-center text-sm leading-relaxed">{story.text}</p>

        <button className="absolute inset-y-0 left-0 w-1/3" onClick={goPrev} aria-label="Oldingi" />
        <button className="absolute inset-y-0 right-0 w-1/3" onClick={goNext} aria-label="Keyingisi" />
      </div>
    </div>
  );
}
