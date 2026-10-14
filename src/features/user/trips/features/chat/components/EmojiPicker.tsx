"use client";

import { useEffect, useRef, useState } from "react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  {
    id: "smileys",
    name: "Smileys",
    icon: "😀",
    emojis: [
      "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
      "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗",
      "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥",
      "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝",
      "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁",
      "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "📁", "💀",
      "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "🙈", "🙉"
    ]
  },
  {
    id: "gestures",
    name: "Gestures",
    icon: "👍",
    emojis: [
      "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘",
      "👌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐",
      "🖖", "👋", "🤙", "💪", "🙏", "👏", "🤝", "🙌", "👐", "🤲"
    ]
  },
  {
    id: "travel",
    name: "Travel",
    icon: "✈️",
    emojis: [
      "✈️", "🚀", "🚁", "⛵", "🚢", "🏖️", "🏝️", "🏕️", "🌋", "⛰️",
      "🏔️", "🚗", "🚕", "🚌", "🏎️", "🚓", "🚑", "🚲", "🛵", "🧳",
      "🗺️", "🧭", "🗽", "🗼", "🎡", "⛲", "⛺", "🌄", "🌅", "🌆"
    ]
  },
  {
    id: "food",
    name: "Food",
    icon: "🍕",
    emojis: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "🥓", "🥚", "🍳", "🥞", "🧇",
      "🥨", "🌮", "🌯", "🥗", "🥪", "🍩", "🍪", "🎂", "🍰", "🍦",
      "☕", "🍵", "🍺", "🍻", "🥂", "🍷", "🍹", "🧃", "🍾", "🍿"
    ]
  },
  {
    id: "symbols",
    name: "Symbols",
    icon: "❤️",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🎁", "🎈",
      "🎉", "🎊", "⭐", "🌟", "✨", "💥", "🔥", "⚡", "🌈", "☀️"
    ]
  }
];

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const currentCategoryObj = EMOJI_CATEGORIES.find((c) => c.id === activeCategory);

  const filteredEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((emoji) => emoji.includes(search.trim()))
    : currentCategoryObj?.emojis || [];

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full right-0 sm:right-12 mb-3 w-72 sm:w-80 rounded-2xl bg-white border border-[#bec9c3]/30 shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Search Header */}
      <div className="p-3 border-b border-[#bec9c3]/15 bg-[#f8faf8]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          className="w-full h-9 rounded-xl bg-white border border-[#e0e3e0] px-3 text-xs text-[#181d1a] outline-none focus:border-[#005440] focus:ring-1 focus:ring-[#005440]"
        />
      </div>

      {/* Category Tabs */}
      {!search && (
        <div className="flex items-center justify-around border-b border-[#bec9c3]/15 bg-[#f1f4f1]/50 p-1.5">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`p-1.5 text-base rounded-xl transition-all ${
                activeCategory === cat.id ? "bg-white shadow-xs scale-110" : "hover:bg-white/50 opacity-70"
              }`}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="p-3 max-h-56 overflow-y-auto hide-scrollbar grid grid-cols-6 sm:grid-cols-7 gap-1">
        {filteredEmojis.map((emoji, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onSelect(emoji);
            }}
            className="h-9 w-9 text-lg flex items-center justify-center rounded-xl hover:bg-[#f1f4f1] active:scale-90 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
