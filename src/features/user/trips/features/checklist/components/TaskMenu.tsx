import { useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TaskMenu({ onEdit, onDelete, onClose }: { onEdit: () => void; onDelete: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-8 z-30 bg-white border border-[#bec9c3]/20 rounded-xl shadow-lg shadow-black/10 overflow-hidden min-w-[140px]">
      <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors">
        <Pencil size={15} className="text-[#3f4944]" />
        Edit
      </button>
      <button onClick={onDelete} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors border-t border-[#bec9c3]/10">
        <Trash2 size={15} />
        Delete
      </button>
    </div>
  );
}