import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@/src/components/Avatar";
import Link from "next/link";
import { useAddMembers, useGetConnections } from "../hooks/hooks";
import { Connection, Member } from "../interfaces/interfaces";
import { Users, X, Search, Check } from "lucide-react";

export default function AddConnectionsModal({ groupId, onClose, members }: { groupId: string; onClose: () => void; members: Member[] }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetConnections();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const connectionsData = data?.data?.connections;
  const memberIds = useMemo(() => new Set(members.map((m) => m.userId)), [members]);
  const connections = useMemo(() => connectionsData?.filter((c: Connection) => !memberIds.has(c.userId)) ?? [], [connectionsData, memberIds]);
  const add = useAddMembers();

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => connections?.filter((c: Connection) => c.fullName.toLowerCase().includes(search.toLowerCase())), [search, connections]);
  const selectedList = connections?.filter((c: Connection) => selected.has(c.userId));
  const count = selected.size;

  const handleAdd = () => {
    add.mutate(
      { id: groupId, members: [...selected] },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-pulse text-center">
          <h3 className="text-base font-bold text-[#181d1a]">Loading connections...</h3>
        </div>
      </div>
    );
  }

  if (!isLoading && connections?.length === 0) {
    return (
      <div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
        onClick={(e) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
          }
        }}
      >
        <div ref={modalRef} className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 text-center shadow-2xl max-h-[92vh] flex flex-col overflow-y-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-[#005440]/10 flex items-center justify-center text-[#005440] shrink-0">
            <Users className="w-9 h-9" />
          </div>

          <h3 className="mt-5 text-xl sm:text-2xl font-extrabold text-[#181d1a] font-headline">No Connections Available</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#3f4944] leading-relaxed">
            All your travel connections are already in this group, or you haven&apos;t connected with travel buddies yet.
          </p>

          <div className="flex flex-col gap-2.5 mt-6">
            <Link
              href="/matches"
              className="h-11 sm:h-12 rounded-xl bg-[#005440] hover:bg-[#004030] text-white font-bold text-sm flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              Find Travel Buddies
            </Link>

            <button
              onClick={onClose}
              className="h-11 sm:h-12 rounded-xl border border-[#e0e3e0] text-[#181d1a] font-bold text-sm hover:bg-[#f1f4f1] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
      <div ref={modalRef} className="bg-white w-full max-w-lg rounded-2xl overflow-hidden border border-[#bec9c3]/20 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#bec9c3]/15">
          <div>
            <h3 className="text-lg font-extrabold text-[#181d1a] font-headline">Add Connections</h3>
            <p className="text-xs text-[#6f7a74] mt-0.5">Select travel connections to add to this group</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full border border-[#e0e3e0] flex items-center justify-center text-[#6f7a74] hover:bg-[#f5f7f6] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca8a3] w-4 h-4" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search connections…" className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e0e3e0] bg-[#f8faf8] text-sm text-[#181d1a] placeholder:text-[#9ca8a3] outline-none focus:border-[#005440] focus:bg-white transition-all" />
          </div>

          {/* Selected Chips */}
          {selectedList?.length > 0 && (
            <div className="pb-3 border-b border-[#bec9c3]/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7a74]">Selected ({count})</span>
                <button onClick={() => setSelected(new Set())} className="text-[11px] font-bold text-[#ba1a1a] hover:underline">
                  Clear all
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedList?.map((c: Connection) => (
                  <button key={c.userId || c.id} onClick={() => toggle(c.userId)} className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border border-[#005440]/20 bg-[#005440]/5 hover:bg-[#005440]/10 transition-colors">
                    <Avatar src={c.avatarUrl} alt={c.fullName} size={22} />
                    <span className="text-xs font-semibold text-[#181d1a]">{c.fullName.split(" ")[0]}</span>
                    <X className="w-2.5 h-2.5 text-[#6f7a74] ml-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of Connections */}
          <div className="space-y-1 max-h-[260px] overflow-y-auto hide-scrollbar">
            {filtered?.map((c: Connection) => {
              const sel = selected.has(c.userId);
              return (
                <button key={c.userId || c.id} onClick={() => toggle(c.userId)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${sel ? "bg-[#005440]/10 border-[#005440]/30 shadow-2xs" : "border-transparent hover:bg-[#f1f4f1]"}`}>
                  <Avatar src={c.avatarUrl} alt={c.fullName} size={40} ring={sel} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#181d1a] truncate">{c.fullName}</p>
                    <p className="text-xs text-[#6f7a74]">Travel Buddy connection</p>
                  </div>
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${sel ? "bg-[#005440] text-white" : "border border-[#bec9c3] bg-white"}`}>
                    {sel && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
            {filtered?.length === 0 && <p className="text-xs text-[#6f7a74] text-center py-6">No connections match your search.</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 p-4 sm:px-6 border-t border-[#bec9c3]/15 bg-[#f8faf8]">
          <button onClick={onClose} className="h-10 px-4 rounded-xl border border-[#bec9c3] bg-white text-xs sm:text-sm font-bold text-[#3f4944] hover:bg-[#f1f4f1] transition-colors">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={count === 0} className={`h-10 px-5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm active:scale-95 ${count > 0 ? "bg-[#005440] hover:bg-[#004030] cursor-pointer" : "bg-[#005440]/40 cursor-not-allowed"}`}>
            {count > 0 ? `Add ${count} Member${count > 1 ? "s" : ""}` : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
