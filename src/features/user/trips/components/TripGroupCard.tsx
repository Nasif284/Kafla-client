"use client";

import { useState } from "react";
import { GroupData } from "../interfaces/interface";
import AvatarStack from "./AvatarStack";
import Link from "next/link";
import EditTripModal from "./EditTripModal";
import DeleteTripModal from "./DeleteTripModal";
import { Calendar, MapPin, Compass, MoreVertical } from "lucide-react";

interface TripGroupCardProps {
  group: GroupData;
  isPast?: boolean;
}

export default function TripGroupCard({ group, isPast }: TripGroupCardProps) {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isTripPast = isPast ?? (group.dateTo ? new Date(group.dateTo) < new Date() : false);
  const hasValidCover = Boolean(group.coverUrl && group.coverUrl.trim() && !imageError);

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-[#bec9c3]/20 group hover:-translate-y-1 transition-all duration-300 relative">
        {/* Cover image / Fallback banner */}
        <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-[#0f6e56] via-[#0b5341] to-[#043327]">
          {isTripPast && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 text-white/95 backdrop-blur-md border border-white/20">
                Completed
              </span>
            </div>
          )}
          {hasValidCover ? (
            <>
              <img
                src={group.coverUrl!}
                alt={group.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col justify-between p-4 text-white select-none">
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-xs text-emerald-200">
                  <Compass className="w-5 h-5 text-emerald-200" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                  Squad Trip
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-100 truncate">
                  {group.destination || "Adventure"}
                </p>
              </div>
            </div>
          )}

          {/* 3-dot Action Menu */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-xs cursor-pointer flex items-center justify-center"
              aria-label="Trip actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div
                  className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#bec9c3]/20 py-1 z-30 text-xs font-semibold text-[#181d1a]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isTripPast && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setEditModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f4f1] flex items-center gap-2 text-[#181d1a] cursor-pointer"
                    >
                      <span>✏️ Edit Trip</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <span>🗑️ Delete Trip</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2">
          <h3 className="text-base sm:text-lg font-bold text-[#181d1a] font-headline line-clamp-1">{group.name}</h3>
          <p className="text-xs sm:text-sm text-[#3f4944] flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0f6e56] shrink-0" />
            <span className="truncate">{group.destination}</span>
          </p>
          <p className="text-xs sm:text-sm text-[#3f4944] mb-2 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#0f6e56] shrink-0" />
            <span>
              {new Date(group.dateFrom).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}{" "}
              -{" "}
              {new Date(group.dateTo).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>

          <div className="mt-auto pt-3 border-t border-[#bec9c3]/20 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-[#3f4944] uppercase tracking-tight">{group.members.length} Members</span>
              <AvatarStack members={group.members} />
            </div>
            <Link
              href={`/trips/groups/${group.id}/overview`}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0f6e56] text-white hover:bg-[#005440] active:scale-95 transition-all shadow-xs"
            >
              {isTripPast ? "View" : "View Group"}
            </Link>
          </div>
        </div>
      </div>

      {/* Edit & Delete Modals */}
      {editModalOpen && (
        <EditTripModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          group={group}
        />
      )}
      {deleteModalOpen && (
        <DeleteTripModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          groupId={group.id}
          groupName={group.name}
        />
      )}
    </>
  );
}
