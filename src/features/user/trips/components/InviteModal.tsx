import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function InviteModal({ onClose, onInvite, isSending = false }: { onClose: () => void; onInvite: (email: string) => void; isSending?: boolean }) {
  const [value, setValue] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onInvite(value.trim());
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div ref={modalRef} className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-[#181d1a] font-headline">Invite Member</h3>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f1f4f1] transition-colors text-[#3f4944] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3f4944] mb-1.5 uppercase tracking-wider">Email Address</label>
            <input type="email" autoFocus required value={value} onChange={(e) => setValue(e.target.value)} placeholder="friend@email.com" className="w-full px-4 py-3 bg-[#f4f5f4] border border-[#e0e3e0] rounded-xl text-sm font-medium text-[#181d1a] focus:outline-none focus:border-[#005440] placeholder:text-[#9ca8a3] transition-all" />
          </div>
          <button type="submit" disabled={isSending} className="w-full h-12 bg-[#005440] text-white font-bold rounded-xl hover:bg-[#004030] transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSending ? "Sending Invite..." : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
