"use client";

import { useEffect, useState } from "react";
import { GetExpenseSummaryResponseDTO } from "../interface/interface";
import { useGetSummary } from "../hooks/hooks";
import { useParams } from "next/navigation";
import { Wallet, ArrowUp, ArrowDown } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e5e9e5] rounded-lg ${className ?? ""}`} />;
}

export default function ExpenseSummaryPage() {
  const { id } = useParams();
  const { data: summary, isLoading } = useGetSummary(id as string);
  const data = summary?.data
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const isSettled = data.netBalance === 0;
  const isPositive = data.netBalance > 0;

  return (
    <div className="space-y-6">
      {/* ── Total trip expenses ── */}
      <div className="bg-white p-8 rounded-2xl border border-[#e0e3e0]/50 shadow-sm flex flex-col items-center text-center">
        <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-widest mb-3">Total Trip Expenses</p>
        <p className="text-5xl font-extrabold text-[#005440] tracking-tight">{fmt(data.totalExpenses)}</p>
        <p className="text-xs text-[#9ca8a3] mt-2">All squad spending combined</p>
      </div>

      {/* ── Personal metrics grid (4 distinct cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* You Paid */}
        <div className="bg-white p-6 rounded-2xl border border-[#e0e3e0]/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider">You Paid</p>
            <span className="w-7 h-7 rounded-full bg-[#f0faf6] flex items-center justify-center text-[#005440]">
              <ArrowUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#181d1a]">{fmt(data.youPaid)}</p>
          <p className="text-xs text-[#9ca8a3]">Total you covered across all expenses</p>
        </div>

        {/* Your Expense (Share) */}
        <div className="bg-white p-6 rounded-2xl border border-[#e0e3e0]/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider">Your Expense</p>
            <span className="w-7 h-7 rounded-full bg-[#f0faf6] flex items-center justify-center text-[#005440]">
              <ArrowDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#181d1a]">{fmt(data.yourShare)}</p>
          <p className="text-xs text-[#9ca8a3]">Your personal share of trip costs</p>
        </div>

        {/* You Owe */}
        <div className={`bg-white p-6 rounded-2xl shadow-sm space-y-3 ${data.youOwe > 0 ? "border border-[#ffdad6]/70" : "border border-[#e0e3e0]/50"}`}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider">You Owe</p>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${data.youOwe > 0 ? "bg-[#fff4f3] text-[#ba1a1a]" : "bg-[#f1f4f1] text-[#6f7a74]"}`}>
              <ArrowDown className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-extrabold ${data.youOwe > 0 ? "text-[#ba1a1a]" : "text-[#181d1a]"}`}>{fmt(data.youOwe)}</p>
          <p className="text-xs text-[#9ca8a3]">{data.youOwe > 0 ? "Pending to settle with buddies" : "No pending dues to pay"}</p>
        </div>

        {/* You Are Owed */}
        <div className={`bg-white p-6 rounded-2xl shadow-sm space-y-3 ${data.youAreOwed > 0 ? "border border-[#c9eadb]/70" : "border border-[#e0e3e0]/50"}`}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider">You Are Owed</p>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${data.youAreOwed > 0 ? "bg-[#f0faf6] text-[#005440]" : "bg-[#f1f4f1] text-[#6f7a74]"}`}>
              <ArrowUp className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-extrabold ${data.youAreOwed > 0 ? "text-[#005440]" : "text-[#181d1a]"}`}>{fmt(data.youAreOwed)}</p>
          <p className="text-xs text-[#9ca8a3]">{data.youAreOwed > 0 ? "Awaiting repayment from buddies" : "No pending refunds"}</p>
        </div>
      </div>

      {/* ── Net balance banner ── */}
      <div
        className={`p-6 rounded-2xl shadow-md flex justify-between items-center transition-all ${
          isSettled ? "bg-[#005440]" : isPositive ? "bg-[#0f6e56]" : "bg-[#ba1a1a]"
        }`}
      >
        <div>
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Net Balance</p>
          <p className="text-3xl font-extrabold text-white">
            {isPositive ? "+" : ""}
            {fmt(data.netBalance)}
          </p>
          <p className="text-xs text-white/80 mt-1">
            {isSettled
              ? "All settled up — you don't owe anyone and no one owes you."
              : isPositive
              ? "You're ahead — the group owes you more than you owe."
              : "You owe more than you're owed overall."}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-full">
          <Wallet className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* ── Quick breakdown bar ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e0e3e0]/50 shadow-sm space-y-4">
        <p className="text-[10px] font-bold text-[#6f7a74] uppercase tracking-wider">Breakdown</p>
        <div className="space-y-3">
          {[
            { label: "You Paid", value: data.youPaid, total: data.totalExpenses, color: "bg-[#005440]" },
            { label: "Your Expense", value: data.yourShare, total: data.totalExpenses, color: "bg-[#005450]" },
            { label: "You Owe", value: data.youOwe, total: data.totalExpenses, color: "bg-[#ba1a1a]" },
            { label: "You Are Owed", value: data.youAreOwed, total: data.totalExpenses, color: "bg-[#0f6e56]/60" },
          ].map(({ label, value, total, color }) => {
            const pct = total > 0 ? Math.min((value / total) * 100, 100).toFixed(1) : "0";
            return (
              <div key={label}>
                <div className="flex justify-between text-xs font-medium text-[#3f4944] mb-1">
                  <span>{label}</span>
                  <span>
                    {fmt(value)} <span className="text-[#9ca8a3]">/ {fmt(total)}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#f1f4f1] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
