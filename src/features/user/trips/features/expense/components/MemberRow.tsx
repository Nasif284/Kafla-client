"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { ExpenseBalanceMemberDTO, ExpenseBalanceTransactionDTO } from "../interface/interface";
import Avatar from "@/src/components/Avatar";

const fmt = (n: number) => "₹" + Math.abs(n).toLocaleString("en-IN");

export default function MemberRow({
  member,
  isCurrentUser,
  onSettle,
}: Readonly<{
  member: ExpenseBalanceMemberDTO;
  isCurrentUser: boolean;
  onSettle: (tx: ExpenseBalanceTransactionDTO) => void;
}>) {
  const [expanded, setExpanded] = useState(isCurrentUser);

  const isSettled = member.status === "SETTLED";
  const isOwes = member.status === "OWES";
  const isGetBack = member.status === "GET_BACK";

  const balanceColor = isOwes ? "text-[#ef4444]" : isGetBack ? "text-[#10b981]" : "text-[#6f7a74]";
  const statusLabel = isOwes
    ? `Owes ${fmt(member.balance)} total`
    : isGetBack
    ? `Gets back ${fmt(member.balance)} total`
    : "Settled up";
  const statusColor = isOwes ? "text-[#ef4444]" : isGetBack ? "text-[#10b981]" : "text-[#9ca8a3]";

  return (
    <div className={`border-b border-[#e5e9e5] last:border-0 ${isSettled ? "opacity-55" : ""}`}>
      <button
        onClick={() => !isSettled && setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#f7f8f7] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <Avatar
            url={member.avatarUrl}
            name={member.fullName}
            size={48}
            isCurrentUser={isCurrentUser}
            grayscale={isSettled}
          />
          <div>
            <p className="font-bold text-[#181d1a] font-headline text-sm">{member.fullName}</p>
            <p className={`text-xs font-medium mt-0.5 ${statusColor}`}>{statusLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSettled ? (
            <CheckCircle2 size={20} className="text-[#9ca8a3]" />
          ) : (
            <>
              <span className={`text-xl font-black font-headline ${balanceColor}`}>{fmt(member.balance)}</span>
              <ChevronDown
                size={18}
                className={`text-[#9ca8a3] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </>
          )}
        </div>
      </button>

      {/* Expanded transactions */}
      {expanded && member.transactions.length > 0 && (
        <div className="px-6 pb-5 space-y-2">
          {member.transactions.map((tx, i) => {
            const isPay = tx.type === "PAY";
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-[#f7f8f7] rounded-xl border border-[#e5e9e5]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`flex-shrink-0 ${isPay ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                    {isPay ? <ArrowUp size={16} strokeWidth={2.5} /> : <ArrowDown size={16} strokeWidth={2.5} />}
                  </span>
                  <span className="text-xs text-[#3f4944] truncate">
                    {isPay ? (
                      <>
                        {isCurrentUser ? "You owe" : `${member.fullName} owes`}{" "}
                        <span className="font-bold">{tx.fullName}</span> {fmt(tx.amount)}
                      </>
                    ) : (
                      <>
                        {isCurrentUser ? "You receive" : `${member.fullName} receives`}{" "}
                        {fmt(tx.amount)} from <span className="font-bold">{tx.fullName}</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className={`text-xs font-bold ${isPay ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                    {fmt(tx.amount)}
                  </span>
                  {/* Show Settle Up only on PAY rows for current user */}
                  {isCurrentUser && isPay && (
                    <button
                      onClick={() => onSettle(tx)}
                      className="bg-[#0f6e56] hover:bg-[#005440] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors active:scale-95"
                    >
                      Settle Up
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}