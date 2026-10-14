import { useState } from "react";
import { SWAP_PRESET_TAGS } from "./types";
import { Shuffle, X } from "lucide-react";

interface Props {
  activityTitle: string;
  onConfirm: (instruction?: string) => void;
  onClose: () => void;
}

export function SwapAdviceModal({ activityTitle, onConfirm, onClose }: Props) {
  const [instruction, setInstruction] = useState("");

  const toggleTag = (tag: string) => {
    const cleanTag = tag.replace(/^[^\w\s]+\s*/, "").trim();
    if (instruction.includes(cleanTag)) {
      const updated = instruction
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s !== cleanTag)
        .join(", ");
      setInstruction(updated);
    } else {
      setInstruction((prev) => (prev ? `${prev}, ${cleanTag}` : cleanTag));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c9eadb]/50 text-[#005440] flex items-center justify-center shrink-0">
              <Shuffle size={14} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181d1a]">Swap Activity</h3>
              <p className="text-xs text-[#6f7a74] line-clamp-1">
                Replacing: <span className="font-semibold text-[#181d1a]">&ldquo;{activityTitle}&rdquo;</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6f7a74] hover:text-[#181d1a] p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Chips */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6f7a74] mb-2">
            Quick Preferences (Optional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SWAP_PRESET_TAGS.map((tag) => {
              const cleanTag = tag.replace(/^[^\w\s]+\s*/, "").trim();
              const active = instruction.includes(cleanTag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all border cursor-pointer ${
                    active
                      ? "bg-[#005440] text-white border-[#005440] shadow-2xs"
                      : "bg-[#f1f4f1] border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#c9eadb]/40"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6f7a74] mb-1.5">
            Custom Advice / Preference
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={2}
            placeholder="e.g. Prefer an outdoor rooftop cafe, or something kid-friendly..."
            className="w-full p-2.5 bg-white border border-[#bec9c3]/50 rounded-xl text-xs text-[#181d1a] placeholder:text-[#6f7a74]/60 focus:outline-none focus:border-[#005440] transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#bec9c3]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-[#6f7a74] hover:text-[#181d1a] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            className="px-3.5 py-2 text-xs font-semibold text-[#005440] bg-[#f1f4f1] hover:bg-[#e5e9e5] border border-[#bec9c3]/40 rounded-xl transition-colors cursor-pointer"
          >
            Quick Swap
          </button>
          <button
            type="button"
            onClick={() => onConfirm(instruction)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#005440] hover:bg-[#0f6e56] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle size={14} />
            <span>{instruction.trim() ? "Swap with Advice" : "Swap Activity"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
