"use client";

import Avatar from "@/src/components/Avatar";

export default function AssigneePill({ name, avatar }: { name: string; avatar?: string | null }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#c9eadb]/30 pr-2.5 pl-1 py-1 rounded-full flex-shrink-0">
      <Avatar size={20} src={avatar} name={name} className="text-[9px]" />
      <span className="text-[10px] font-bold text-[#4d6b5f] uppercase tracking-wide">{name}</span>
    </div>
  );
}