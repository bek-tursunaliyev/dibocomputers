import { useEffect, useState } from "react";

// ngrok bepul tarifi <img> so'rovlariga maxsus header qo'shib bo'lmagani uchun
// ogohlantirish sahifasini qaytaradi — shu sabab rasmni fetch() orqali (header bilan)
// yuklab, blob URL sifatida ko'rsatamiz.
export default function SmartImage({ src, alt, className }) {
  const [resolvedSrc, setResolvedSrc] = useState(null);

  useEffect(() => {
    if (!src || !src.startsWith("http")) {
      setResolvedSrc(src);
      return;
    }

    let objectUrl;
    let cancelled = false;

    fetch(src, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setResolvedSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setResolvedSrc(src);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!resolvedSrc) return <div className={`${className} bg-gray-100 animate-pulse`} />;

  return <img src={resolvedSrc} alt={alt} className={className} />;
}
