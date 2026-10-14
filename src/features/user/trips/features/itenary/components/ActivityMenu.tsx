export default function ActivityMenu({ onEdit, onDelete, onToggle, onClose }: { onEdit: () => void; onDelete: () => void; onToggle: () => void; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-6 z-20 bg-white border border-[#bec9c3]/20 rounded-xl shadow-lg overflow-hidden w-40" onClick={(e) => e.stopPropagation()}>
      {[
        { label: "Edit", fn: onEdit },
        { label: "Mark complete", fn: onToggle },
        { label: "Delete", fn: onDelete, danger: true },
      ].map(({ label, fn, danger }) => (
        <button
          key={label}
          onClick={() => {
            fn();
            onClose();
          }}
          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors
            ${danger ? "text-[#ba1a1a] hover:bg-[#ffdad6]/20" : "text-[#181d1a] hover:bg-[#f1f4f1]"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}