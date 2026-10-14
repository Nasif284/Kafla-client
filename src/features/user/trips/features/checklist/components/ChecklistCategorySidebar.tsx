"use client";

import React from "react";
import { CategoryId } from "../interfaces/interface";

export interface SidebarCategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  packed: number;
  total: number;
}

interface ChecklistCategorySidebarProps {
  categories: SidebarCategoryItem[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export default function ChecklistCategorySidebar({
  categories,
  activeCategory,
  onSelectCategory,
}: ChecklistCategorySidebarProps) {
  return (
    <aside className="w-full lg:w-60 shrink-0 relative">
      {/* Mobile scroll indicator gradient fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white via-white/80 to-transparent lg:hidden z-10" />

      <div className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible gap-2 lg:gap-1 pb-2 lg:pb-0 pr-8 lg:pr-0 hide-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <div key={cat.id} className="shrink-0 lg:shrink">
              {cat.id === "all" && <div className="hidden lg:block my-3 border-t border-[#bec9c3]/20" />}

              <button
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap min-w-[120px] lg:min-w-0 lg:w-full gap-2
      ${
        active
          ? "bg-[#0f6e56] text-white shadow-sm"
          : cat.id === "my"
          ? "bg-[#eef8f4] text-[#005440] hover:bg-[#dff1ea]"
          : "text-[#3f4944] hover:bg-[#e5e9e5]"
      }`}
              >
                <span className="flex items-center gap-2">
                  {cat.icon}
                  {cat.name}
                </span>

                <span
                  className={`text-xs font-bold ${
                    active ? "opacity-80" : cat.id === "my" ? "text-[#0f6e56]" : "text-[#005440]"
                  }`}
                >
                  {cat.id === "all" ? cat.total : `${cat.packed}/${cat.total}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
