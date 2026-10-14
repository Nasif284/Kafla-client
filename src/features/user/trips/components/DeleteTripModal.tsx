"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDeleteTripGroup } from "@/src/features/user/trips/hooks/trip.hooks";
import ModalLayout from "@/src/components/Modal";
import { Trash2 } from "lucide-react";

interface DeleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export default function DeleteTripModal({
  isOpen,
  onClose,
  groupId,
  groupName,
}: DeleteTripModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const deleteGroup = useDeleteTripGroup();
  const [confirmInput, setConfirmInput] = useState("");

  const isInsideGroupPage = pathname.includes(`/trips/groups/${groupId}`);

  const handleDelete = () => {
    deleteGroup.mutate(groupId, {
      onSuccess: () => {
        onClose();
        if (isInsideGroupPage) {
          router.push("/trips");
        }
      },
    });
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Delete Trip Squad">
      <div className="p-4 sm:p-6 text-start space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-[#181d1a]">
            Are you sure you want to delete &ldquo;{groupName}&rdquo;?
          </h3>
          <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed">
            This action is permanent and cannot be undone. All itinerary activities, expense splits, shared checklists, and group chat history will be permanently deleted for all group members.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#3f4944]">
            Type <span className="font-bold text-[#181d1a]">&ldquo;{groupName}&rdquo;</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={groupName}
            className="w-full h-11 px-3.5 bg-[#f1f4f1] border border-[#bec9c3]/30 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs sm:text-sm font-medium"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#bec9c3]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#3f4944] hover:bg-[#f1f4f1] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={confirmInput.trim().toLowerCase() !== groupName.trim().toLowerCase() || deleteGroup.isPending}
            onClick={handleDelete}
            className="h-11 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleteGroup.isPending ? "Deleting..." : "Permanently Delete Trip"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
