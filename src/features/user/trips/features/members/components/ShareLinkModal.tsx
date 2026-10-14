import { useEffect, useRef, useState } from "react";
import { useGetInviteCode } from "../hooks/hooks";
import { X } from "lucide-react";

export default function ShareLinkModal({ onClose, id }: { onClose: () => void; id: string }) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { data, isLoading } = useGetInviteCode(id);
  const inviteCode = data?.data?.inviteCode;

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-pulse text-center">
          <h2 className="text-base font-bold text-[#181d1a]">Generating invite link...</h2>
        </div>
      </div>
    );
  }

  const inviteLink = `${window.location.origin}/trips/groups/join/${inviteCode}`;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div ref={modalRef} className="bg-white w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-extrabold text-[#181d1a] font-headline">Share Trip Invite</h3>

          <button onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f1f4f1] transition-colors text-[#3f4944] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-[#3f4944] mb-1.5 uppercase tracking-wider">Invite Link</p>

            <div className="flex gap-2">
              <input readOnly value={inviteLink} className="flex-1 h-11 px-3 rounded-xl bg-[#f4f5f4] border border-[#e0e3e0] text-xs sm:text-sm font-medium text-[#181d1a] outline-none" />

              <button onClick={() => copyText(inviteLink)} className="px-4 rounded-xl bg-[#005440] hover:bg-[#004030] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#005440]/10 p-3.5 text-xs sm:text-sm font-medium text-[#005440] leading-relaxed">
            Anyone with this invite link can request to join this travel group.
          </div>
        </div>
      </div>
    </div>
  );
}
