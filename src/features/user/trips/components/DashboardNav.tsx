"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Receipt,
  CheckSquare,
  MessageSquare,
  Users,
} from "lucide-react";

type TabId = "overview" | "itinerary" | "expenses" | "checklist" | "chat" | "members";
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "itinerary", label: "Itinerary", icon: <Map className="w-4 h-4" /> },
  { id: "expenses", label: "Expenses", icon: <Receipt className="w-4 h-4" /> },
  { id: "checklist", label: "Checklist", icon: <CheckSquare className="w-4 h-4" /> },
  { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const params = useParams();

  const tripId = params.id as string;

  return (
    <div className="relative w-full mb-6 sm:mb-8">
      {/* Mobile scroll indicator gradient fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#faf8f5] to-transparent sm:hidden z-10" />

      <nav className="flex overflow-x-auto gap-1 sm:gap-2 border-b border-[#bec9c3]/20 hide-scrollbar pb-0.5 pr-6 sm:pr-0 scroll-smooth">
        {TABS.map((tab) => {
          const href = `/trips/groups/${tripId}/${tab.id}`;
          const active = pathname === href;

          return (
            <Link key={tab.id} href={href}>
              <div
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2
                ${active ? "text-[#0f6e56] border-[#0f6e56] font-bold" : "text-[#3f4944] border-transparent hover:text-[#005440]"}`}
              >
                {tab.icon}
                {tab.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
