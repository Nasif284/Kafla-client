"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Tabs = () => {
  const pathname = usePathname();
  const { id } = useParams();

  const tabs = [
    {
      label: "Expenses",
      href: `/trips/groups/${id}/expenses`,
    },
    {
      label: "Summary",
      href: `/trips/groups/${id}/expenses/summary`,
    },
    {
      label: "Balances",
      href: `/trips/groups/${id}/expenses/balances`,
    },
    {
      label: "Report",
      href: `/trips/groups/${id}/expenses/report`,
    },
  ];

  return (
    <div className="flex bg-[#f1f4f1] p-1 rounded-xl gap-1 overflow-x-auto hide-scrollbar w-full sm:w-auto shrink-0">
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href} className={`px-4 sm:px-6 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 ${pathname === tab.href ? "bg-white text-[#005440] shadow-sm font-bold" : "text-[#3f4944] hover:bg-white/50 font-medium"}`}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
