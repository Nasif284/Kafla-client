"use client";

import { useState } from "react";
import { CategoryCode, ExpenseRowProps } from "../interface/interface";
import { CATEGORY_CONFIG } from "../pages/ExpensePage";
import ExpenseMenu from "./ExpenseMenu";
import Avatar from "@/src/components/Avatar";
import { MoreVertical, ChevronRight, ChevronUp } from "lucide-react";

function formatDate(d: Date | string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ExpenseRow({ expense, expanded, onToggle, onEdit, onDelete }: ExpenseRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const catCode = expense.category?.code as CategoryCode;
  const cfg = CATEGORY_CONFIG[catCode] ?? CATEGORY_CONFIG.OTHERS;
  const splitLabel = expense.splitMethod?.name ?? "Split";
  const isEqualSplit = expense.splitMethod?.code === "EQUAL";

  return (
    <div className={`bg-white rounded-2xl border border-[#bec9c3]/20 shadow-sm transition-all overflow-hidden ${expanded ? "ring-2 ring-[#0f6e56]/20 border-[#0f6e56]/40" : "hover:border-[#bec9c3]/40 hover:shadow-md"}`}>
      {/* Main row */}
      <div className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4">
        {/* Category icon */}
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0 shadow-sm`}>
          {cfg.icon}
        </div>

        {/* Title + meta column */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          {/* Row 1: Title + Split Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-[#181d1a] truncate">{expense.title}</h4>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap shrink-0
              ${isEqualSplit ? "bg-[#c9eadb] text-[#005440]" : "bg-[#e5e9e5] text-[#3f4944]"}`}
            >
              {splitLabel}
            </span>
          </div>

          {/* Row 2: Paid by info + Date */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6f7a74] min-w-0">
            <Avatar name={expense.paidBy.name} avatarUrl={expense.paidBy?.avatarUrl} size={16} />
            <span className="text-[11px] sm:text-xs text-[#3f4944] truncate">
              <span className="hidden sm:inline">Paid </span>By <strong className="text-[#181d1a] font-semibold">{expense.paidBy.name}</strong>
            </span>
            <span className="text-[#bec9c3] shrink-0">·</span>
            <span className="text-[11px] sm:text-xs text-[#6f7a74] shrink-0">{formatDate(expense.expenseDate)}</span>
          </div>
        </div>

        {/* Right side: Amount + Menu + Chevron */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-base sm:text-lg font-black text-[#181d1a] tracking-tight">{formatAmount(expense.amount)}</span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="p-1 hover:bg-[#f1f4f1] rounded-lg transition-colors text-[#6f7a74] hover:text-[#181d1a]"
              aria-label="Expense options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <ExpenseMenu
                onEdit={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                onDelete={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>

          <button onClick={onToggle} className="p-1 text-[#6f7a74] hover:text-[#005440] hover:bg-[#f1f4f1] rounded-lg transition-colors" aria-label="Expand breakdown">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-[#bec9c3]/15 bg-[#f8faf8]">
          <div className="space-y-3">
            {/* Payer Header Banner */}
            <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#bec9c3]/20 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={expense.paidBy.name} avatarUrl={expense.paidBy?.avatarUrl} size={32} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#181d1a] truncate">{expense.paidBy.name}</p>
                  <p className="text-[10px] text-[#6f7a74]">Full payment made</p>
                </div>
              </div>
              <span className="text-sm font-black text-[#0f6e56]">{formatAmount(expense.amount)}</span>
            </div>

            {/* Split Shares Breakdown */}
            <div>
              <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider mb-2 px-1">Participants Breakdown</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {expense.participants.map((p) => (
                  <div key={p.memberId} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#bec9c3]/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={p.name} avatarUrl={p.avatarUrl} size={28} />
                      <span className="text-xs font-semibold text-[#181d1a] truncate">{p.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#181d1a] block">{formatAmount(p.amount)}</span>
                      {expense.splitMethod?.code === "PERCENTAGE" && p.percentage !== null && (
                        <span className="text-[9px] text-[#6f7a74] font-medium">{p.percentage}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
