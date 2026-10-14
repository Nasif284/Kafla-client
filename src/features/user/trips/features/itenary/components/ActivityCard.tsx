"use client";

import { useState } from "react";
import { Check, MoreVertical, Clock, MapPin, FileText } from "lucide-react";
import { getCat } from "../utils/data";
import ActivityMenu from "./ActivityMenu";
import { formatDuration } from "../utils/helpers";
import { ItineraryActivityDTO } from "../interfaces/interfaces";
import Avatar from "@/src/components/Avatar";

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  onToggleComplete,
  isReadOnly = false,
}: {
  activity: ItineraryActivityDTO;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  isReadOnly?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = getCat(activity.category.code);

  return (
    <div
      className={`relative flex gap-4 p-4 rounded-xl border transition-all group ${
        activity.isCompleted
          ? "bg-[#f1f4f1] border-[#bec9c3]/10 opacity-60"
          : "bg-white border-[#bec9c3]/15 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {/* Category dot + time column */}
      <div className="flex flex-col items-center gap-1.5 w-10 flex-shrink-0">
        <div className={`w-3 h-3 rounded-full ${cat.dot} mt-1 flex-shrink-0`} />
        {activity.startTime && (
          <span className="text-[10px] font-bold text-[#3f4944] tabular-nums leading-none">
            {activity.startTime}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-bold ${
                activity.isCompleted ? "line-through text-[#6f7a74]" : "text-[#181d1a]"
              }`}
            >
              {activity.title}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.color}`}>
              {activity.category.name}
            </span>
            {activity.isCompleted && (
              <span className="bg-[#c9eadb] text-[#005440] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> Done
              </span>
            )}
          </div>

          {/* 3-dot */}
          {!isReadOnly && (
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="p-1.5 rounded-lg text-[#6f7a74] hover:text-[#181d1a] hover:bg-[#f1f4f1] transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Activity menu"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <ActivityMenu
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggleComplete}
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
          )}
        </div>

        {activity.description && (
          <p className="text-xs text-[#3f4944] mb-2 leading-relaxed">{activity.description}</p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-3 text-[11px] text-[#6f7a74]">
          {activity.durationMinutes && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatDuration(activity.durationMinutes)}
            </span>
          )}
          {activity.location && (
            <span className="flex items-center gap-1 truncate max-w-[180px]">
              <MapPin size={12} /> {activity.location}
            </span>
          )}
          {activity.notes && (
            <span className="flex items-center gap-1 truncate max-w-[180px]" title={activity.notes}>
              <FileText size={12} /> {activity.notes}
            </span>
          )}
          {activity.createdBy && (
            <span className="flex items-center gap-1 ml-auto">
              <Avatar
                size={16}
                src={activity.createdBy.avatarUrl}
                name={activity.createdBy.fullName}
              />
              {activity.createdBy.fullName.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}