"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { X, ArrowRight, Check, Loader2 } from "lucide-react";
import type { ExpenseBalanceMemberDTO, ExpenseBalanceTransactionDTO } from "../interface/interface";
import Avatar from "@/src/components/Avatar";
import { useCreateSettlement } from "../hooks/hooks";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type SettleState = "idle" | "loading" | "success";

interface Props {
  payer: ExpenseBalanceMemberDTO;
  transaction: ExpenseBalanceTransactionDTO;
  onClose: () => void;
  onSettled: () => void;
}

export default function SettleUpModal({ payer, transaction, onClose, onSettled }: Props) {
  const { id } = useParams();
  const [amount, setAmount] = useState(transaction.amount.toLocaleString("en-IN"));
  const [note, setNote] = useState("");
  const [state, setState] = useState<SettleState>("idle");
  const settleMutation = useCreateSettlement();

  const handleSettle = () => {
    const cleanAmount = Number(amount.replace(/,/g, ""));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    setState("loading");
    settleMutation.mutate(
      {
        id: id as string,
        data: {
          receiverMemberId: transaction.memberId,
          amount: cleanAmount,
          note: note.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setState("success");
          setTimeout(() => {
            onSettled();
            onClose();
          }, 1200);
        },
        onError: () => {
          setState("idle");
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-[#e5e9e5]">
          <h2 className="text-xl font-bold text-[#181d1a] font-headline">Settle Up</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f1f4f1] transition-colors text-[#6f7a74]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Payer → Receiver relationship */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar url={payer.avatarUrl} name={payer.fullName} size={56} ring />
              <span className="text-sm font-semibold text-[#181d1a] font-headline">{payer.fullName}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRight size={24} className="text-[#005440]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#9ca8a3]">Paying</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar url={transaction.avatarUrl} name={transaction.fullName} size={56} />
              <span className="text-sm font-semibold text-[#181d1a] font-headline">{transaction.fullName}</span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6f7a74] mb-2 px-1">
              Amount to Settle
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#6f7a74]">₹</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))}
                className="w-full h-20 pl-10 pr-6 bg-[#f1f4f1] rounded-xl border-none text-4xl font-black text-[#0f6e56] focus:ring-2 focus:ring-[#0f6e56]/20 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-[#9ca8a3] mt-1.5 px-1">Full amount owed: {fmt(transaction.amount)}</p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6f7a74] mb-2 px-1">
              Note <span className="normal-case font-medium">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this payment…"
              className="w-full bg-[#f1f4f1] rounded-xl border-none p-4 text-sm resize-none focus:ring-2 focus:ring-[#0f6e56]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-[#f1f4f1] flex items-center gap-3 border-t border-[#e5e9e5]">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-white border border-[#d4dbd6] text-[#3f4944] font-bold hover:bg-[#f7f8f7] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSettle}
            disabled={state !== "idle"}
            className={`flex-[2] h-12 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              state === "success"
                ? "bg-[#476459]"
                : "bg-[#0f6e56] hover:bg-[#005440] active:scale-[0.98]"
            } disabled:opacity-80 disabled:cursor-not-allowed`}
          >
            {state === "loading" && (
              <Loader2 className="animate-spin w-5 h-5 text-white" />
            )}
            {state === "loading" && "Processing…"}
            {state === "success" && (
              <>
                <Check size={16} strokeWidth={3} />
                Sent successfully
              </>
            )}
            {state === "idle" && "Settle up"}
          </button>
        </div>
      </div>
    </div>
  );
}
