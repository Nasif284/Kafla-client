"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalLayout from "@/src/components/Modal";
import { useJoinWithLink } from "../features/members/hooks/hooks";
import { Users, Link as LinkIcon, Loader2, ArrowRight, Clipboard } from "lucide-react";
import { toast } from "sonner";

interface JoinTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinTripModal({ isOpen, onClose }: JoinTripModalProps) {
  const [inviteInput, setInviteInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const router = useRouter();
  const joinMutation = useJoinWithLink();

  // Helper to extract clean invite code from raw code or full URL
  const extractInviteCode = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
      if (trimmed.includes("/join/")) {
        const parts = trimmed.split("/join/");
        const rawCode = parts[parts.length - 1] || "";
        return rawCode.split(/[?#\/]/)[0].trim();
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const code = extractInviteCode(text);
          setInviteInput(code);
          setInputError(null);
          toast.success("Pasted invite code from clipboard");
        }
      }
    } catch {
      // Clipboard access denied or unsupported; ignore silently
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const cleanCode = extractInviteCode(inviteInput);
    if (!cleanCode) {
      setInputError("Please enter a valid trip invite code or link");
      return;
    }

    joinMutation.mutate(cleanCode, {
      onSuccess: (res) => {
        const targetGroupId = res?.data?.groupId;
        onClose();
        setInviteInput("");
        if (targetGroupId) {
          router.push(`/trips/groups/${targetGroupId}/overview`);
        } else {
          router.push("/trips/groups");
        }
      },
      onError: (err) => {
        const msg =
          err.response?.data?.error?.message ||
          "Could not join trip. Please verify the invite code.";
        setInputError(msg);
      },
    });
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Join a Trip Group" size="md">
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
        {/* Visual Header Banner */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f1f4f1]/80 border border-[#bec9c3]/30">
          <div className="w-11 h-11 rounded-xl bg-[#c9eadb] flex items-center justify-center text-[#005440] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#181d1a]">Got an invite from friends?</h4>
            <p className="text-xs text-[#3f4944] mt-0.5 leading-relaxed">
              Enter the unique invite code or paste the link shared by your trip organizer to jump straight into the squad workspace.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div>
          <label className="block text-xs font-bold text-[#181d1a] uppercase tracking-wider mb-2">
            Invite Code or Link
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6f7a74]">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => {
                setInviteInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="e.g. 8kX2pL or https://kafla.app/.../join/8kX2pL"
              className={`w-full pl-10 pr-24 py-3 bg-white border ${
                inputError ? "border-red-500 ring-2 ring-red-500/20" : "border-[#bec9c3]/50 focus:border-[#005440]"
              } rounded-xl text-sm font-medium text-[#181d1a] placeholder:text-[#6f7a74]/60 focus:outline-none transition-all`}
              autoFocus
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute inset-y-1.5 right-1.5 px-3 rounded-lg bg-[#f1f4f1] hover:bg-[#e2e8e4] text-[#005440] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>

          {inputError && (
            <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
              <span>⚠️</span> {inputError}
            </p>
          )}

          <p className="text-[11px] text-[#6f7a74] mt-2">
            Tip: You can paste the whole invite link. We will automatically detect the code for you.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#bec9c3]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#3f4944] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={joinMutation.isPending || !inviteInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#005440] hover:bg-[#0f6e56] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {joinMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Group</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
