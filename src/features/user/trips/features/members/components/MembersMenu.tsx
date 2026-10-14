import { useEffect, useRef } from "react";
import { MemberMenuProps } from "../interfaces/interfaces";
import Link from "next/link";
import { Crown, UserMinus, User } from "lucide-react";

export default function MemberMenu({ member, isCurrentUserAdmin, onPromote, onRemove, onClose }: MemberMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-10 z-30 bg-white border border-[#bec9c3]/20 rounded-xl shadow-lg shadow-black/10 overflow-hidden min-w-[180px]">
      {isCurrentUserAdmin && member.role === "member" && (
        <button onClick={onPromote} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors cursor-pointer">
          <Crown className="w-4 h-4 text-[#005440]" />
          Make admin
        </button>
      )}

      <Link href={`/profile/${member.userId}`} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#181d1a] hover:bg-[#f1f4f1] transition-colors border-t border-[#bec9c3]/10">
        <User className="w-4 h-4 text-[#3f4944]" />
        View profile
      </Link>

      {isCurrentUserAdmin && (
        <button onClick={onRemove} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors border-t border-[#bec9c3]/10 cursor-pointer">
          <UserMinus className="w-4 h-4" />
          Remove from trip
        </button>
      )}
    </div>
  );
}