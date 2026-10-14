"use client";

import React from "react";
import { Check, Flag, MoreVertical } from "lucide-react";
import { CheckItem, CategoryId } from "../interfaces/interface";
import AssigneePill from "./AssigneePill";
import TaskMenu from "./TaskMenu";

interface ChecklistItemRowProps {
  item: CheckItem;
  isMyTask: boolean;
  canToggle: boolean;
  isAdmin: boolean;
  isPast: boolean;
  activeCategory: CategoryId;
  isMenuOpen: boolean;
  onToggle: (taskId: string) => void;
  onToggleMenu: () => void;
  onEdit: (item: CheckItem) => void;
  onDelete: (item: CheckItem) => void;
  onCloseMenu: () => void;
}

export default function ChecklistItemRow({
  item,
  isMyTask,
  canToggle,
  isAdmin,
  isPast,
  activeCategory,
  isMenuOpen,
  onToggle,
  onToggleMenu,
  onEdit,
  onDelete,
  onCloseMenu,
}: ChecklistItemRowProps) {
  return (
    <div className="group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl hover:bg-[#f1f4f1] transition-all">
      {/* Left: checkbox + label + flag */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <button
          disabled={!canToggle}
          onClick={() => canToggle && onToggle(item.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            item.isCompleted ? "bg-[#0f6e56] border-[#0f6e56]" : "border-[#bec9c3]"
          } ${canToggle ? "cursor-pointer hover:border-[#005440]" : "cursor-default opacity-70"}`}
        >
          {item.isCompleted && <Check size={14} strokeWidth={3} className="text-white" />}
        </button>

        <span
          className={`font-semibold text-xs sm:text-sm truncate transition-all ${
            item.isCompleted ? "line-through text-[#3f4944] opacity-60" : "text-[#181d1a]"
          }`}
        >
          {item.title}
        </span>

        {item.priorityCode === "HIGH" && !item.isCompleted && (
          <Flag size={14} className="text-[#ba1a1a] fill-[#ba1a1a] flex-shrink-0" />
        )}
      </div>

      {/* Right: assignee + 3-dot menu */}
      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        {activeCategory !== "my" && (
          <AssigneePill
            name={isMyTask ? "You" : item.assignee?.fullName || "Unassigned"}
            avatar={item.assignee?.avatarUrl}
          />
        )}

        {/* 3-dot trigger */}
        {isAdmin && !isPast && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#bec9c3] hover:text-[#3f4944] hover:bg-[#e5e9e5] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <TaskMenu
                onEdit={() => {
                  onEdit(item);
                  onCloseMenu();
                }}
                onDelete={() => {
                  onDelete(item);
                  onCloseMenu();
                }}
                onClose={onCloseMenu}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
