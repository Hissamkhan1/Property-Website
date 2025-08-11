import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export default function Lightbox({ open, images, index, onClose, onIndex }: Props) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, index, images.length, onClose, onIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
      <button onClick={onClose} className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white">✕</button>
      {images.length > 1 && (
        <button onClick={() => onIndex((index - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">‹</button>
      )}
      <img src={images[index]} alt="" className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain" />
      {images.length > 1 && (
        <button onClick={() => onIndex((index + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">›</button>
      )}
    </div>
  );
} 