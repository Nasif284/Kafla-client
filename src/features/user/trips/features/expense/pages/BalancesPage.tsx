"use client";

import { useState } from "react";
import { HelpCircle, Check } from "lucide-react";
import { type ExpenseBalanceMemberDTO, type ExpenseBalanceTransactionDTO } from "../interface/interface";

import SettleUpModal from "../components/SettleUpModal";
import Skeleton from "../components/Skeleton";
import MemberRow from "../components/MemberRow";
import { useParams } from "next/navigation";
import { useGetBalances } from "../hooks/hooks";
import { useAuthStore } from "@/src/store/auth.store";

export default function ExpenseBalancesPage() {
  const { id } = useParams();
  const currentUserId = useAuthStore((store) => store.user?.id);
  const [simplify, setSimplify] = useState(true);
  const { data: balancesData, isLoading: loading } = useGetBalances(id as string, simplify ? "SIMPLIFIED" : "ORIGINAL");
  const data = balancesData?.data;
  const [settleTarget, setSettleTarget] = useState<{
    payer: ExpenseBalanceMemberDTO;
    tx: ExpenseBalanceTransactionDTO;
  } | null>(null);

  const currentUser = data?.members.find((m: ExpenseBalanceMemberDTO) => m.memberId === currentUserId);
  const allSettled = data?.members.every((m: ExpenseBalanceMemberDTO) => m.status === "SETTLED");

  return (
    <div className="space-y-6">
      {/* Sub-header + Simplify toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e5e9e5]">
        <div>
          <h2 className="text-2xl font-extrabold text-[#181d1a] font-headline">Balances</h2>
          <p className="text-sm text-[#6f7a74] mt-0.5">See who owes whom and settle outstanding expenses.</p>
        </div>

        {/* Simplify Debts toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-4 bg-[#f1f4f1] px-4 py-3 rounded-2xl border border-[#e0e3e0] self-end sm:self-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#181d1a]">Simplify Debts</span>
              <div className="relative group">
                <HelpCircle className="w-3.5 h-3.5 text-[#9ca8a3] cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#2d312f] text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">Reduces the number of payments while keeping everyone&apos;s final balance the same.</div>
              </div>
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${simplify ? "text-[#005440]" : "text-[#9ca8a3]"}`}>{simplify ? "Enabled" : "Disabled"}</span>
          </div>
          {/* Toggle */}
          <button role="switch" aria-checked={simplify} onClick={() => setSimplify((v) => !v)} className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${simplify ? "bg-[#005440]" : "bg-[#bec9c3]"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${simplify ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {/* All settled empty state */}
      {!loading && allSettled && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#f0faf6] flex items-center justify-center mb-6">
            <Check className="w-9 h-9 text-[#005440]" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#181d1a] font-headline mb-2">Everyone is settled 🎉</h3>
          <p className="text-[#6f7a74] max-w-sm">No outstanding balances. You&apos;re all square!</p>
        </div>
      )}

      {/* Balance list */}
      {!loading && !allSettled && data && (
        <div className="bg-white rounded-2xl border border-[#e5e9e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e9e5] bg-[#f7f8f7]">
            <h3 className="text-[10px] font-bold text-[#9ca8a3] uppercase tracking-widest">Group Balances</h3>
          </div>
          <div>
            {data.members.map((member: ExpenseBalanceMemberDTO) => (
              <MemberRow key={member.memberId} member={member} isCurrentUser={member.memberId === currentUserId} onSettle={(tx) => setSettleTarget({ payer: member, tx })} />
            ))}
          </div>
        </div>
      )}

      {settleTarget && (
        <SettleUpModal
          payer={settleTarget.payer}
          transaction={settleTarget.tx}
          onClose={() => setSettleTarget(null)}
          onSettled={() => {
            // setData((prev) => {
            //   if (!prev) return prev;
            //   return {
            //     members: prev.members.map((m) =>
            //       m.memberId === settleTarget.payer.memberId
            //         ? {
            //             ...m,
            //             transactions: m.transactions.filter((tx) => tx.memberId !== settleTarget.tx.memberId || tx.type !== "PAY"),
            //           }
            //         : m,
            //     ),
            //   };
            // });
          }}
        />
      )}
    </div>
  );
}
