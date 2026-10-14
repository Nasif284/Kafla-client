"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useGetGroup } from "../hooks/trip.hooks";
import EditTripModal from "./EditTripModal";
import DeleteTripModal from "./DeleteTripModal";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";

const GroupHeader = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetGroup(id as string);
  const [imageError, setImageError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const group = data?.data;
  const isPast = group?.dateTo ? new Date(group.dateTo) < new Date() : false;

  if (isLoading) {
    return (
      <section className="relative w-full h-[160px] sm:h-[220px] rounded-2xl overflow-hidden mb-6 sm:mb-8 bg-gray-200 animate-pulse border border-[#bec9c3]/20">
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 space-y-2">
          <div className="h-6 w-48 bg-gray-300 rounded-lg" />
          <div className="h-4 w-64 bg-gray-300 rounded-lg" />
        </div>
      </section>
    );
  }

  if (!group) return null;

  const hasValidCover = Boolean(group.coverUrl && group.coverUrl.trim() && !imageError);

  return (
    <>
      <section className="relative w-full h-[160px] sm:h-[220px] rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-sm border border-[#bec9c3]/20 bg-gradient-to-br from-[#0f6e56] via-[#0b5341] to-[#043327]">
        {hasValidCover && (
          <img
            src={group.coverUrl}
            alt={group.name}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-8">
          <div className="flex justify-between items-end flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white font-headline tracking-tight">{group.name}</h1>
                {isPast && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                    Completed
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-white/90 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {new Date(group.dateFrom).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  -{" "}
                  {new Date(group.dateTo).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {group.destination}
                </span>
              </div>
            </div>

            {/* Quick Actions: Edit & Delete Trip */}
            <div className="flex items-center gap-2">
              {!isPast && (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 active:scale-95 cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Trip</span>
                </button>
              )}
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white backdrop-blur-xs transition-all border border-red-400/30 active:scale-95 cursor-pointer"
                title="Delete Trip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

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
};

export default GroupHeader;
