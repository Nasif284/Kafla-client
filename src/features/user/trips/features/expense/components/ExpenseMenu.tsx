"use client";

import { useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ExpenseMenu({ onEdit, onDelete, onClose }: { onEdit: () => void; onDelete: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#bec9c3]/20 z-20 py-1 overflow-hidden">
      <button onClick={onEdit} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#181d1a] hover:bg-[#f1f4f1] flex items-center gap-2 cursor-pointer">
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </button>
      <button onClick={onDelete} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/20 flex items-center gap-2 border-t border-[#bec9c3]/10 cursor-pointer">
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
}