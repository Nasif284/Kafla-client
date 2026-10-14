"use client";

import React from "react";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { Equal, Percent, Edit3, Share2 } from "lucide-react";
import { Member } from "../../members/interfaces/interfaces";
import { SplitCode } from "../interface/interface";
import { ExpenseFormValues } from "../validators/validators";
import Avatar from "@/src/components/Avatar";
import SplitPreview from "./SplitPreview";

const SPLIT_METHODS: { code: SplitCode; label: string; icon: React.ReactNode }[] = [
  { code: "EQUAL", label: "Equal", icon: <Equal size={16} /> },
  { code: "PERCENTAGE", label: "Percentage", icon: <Percent size={16} /> },
  { code: "CUSTOM", label: "Custom", icon: <Edit3 size={16} /> },
  { code: "SHARES", label: "Shares", icon: <Share2 size={16} /> },
];

interface ExpenseSplitSectionProps {
  control: Control<ExpenseFormValues>;
  watchedMethod: SplitCode;
  totalAmount: number;
  members: Member[];
  memberById: Record<string, Member>;
  fields: FieldArrayWithId<ExpenseFormValues, "participants", "id">[];
  watchedParticipants: { memberId: string; value: string }[];
  equalAmount: string | null;
  getParticipantError: (index: number) => string | undefined;
  participantsGlobalError?: string;
  computeParticipantAmount: (
    method: SplitCode,
    totalAmount: number,
    participants: { memberId: string; value: string }[],
    index: number
  ) => string | null;
}

export default function ExpenseSplitSection({
  control,
  watchedMethod,
  totalAmount,
  members,
  memberById,
  fields,
  watchedParticipants,
  equalAmount,
  getParticipantError,
  participantsGlobalError,
  computeParticipantAmount,
}: ExpenseSplitSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <label className="text-xs sm:text-sm font-bold font-headline text-[#005440] uppercase tracking-wide">
        Split Method
      </label>

      <Controller
        control={control}
        name="splitMethod"
        render={({ field }) => (
          <div className="grid grid-cols-4 p-1 sm:p-1.5 bg-[#e5e9e5] rounded-2xl gap-1">
            {SPLIT_METHODS.map((s) => {
              const active = field.value === s.code;
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => field.onChange(s.code)}
                  className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap ${
                    active ? "bg-white shadow-sm text-[#005440] font-bold" : "text-[#3f4944] hover:text-[#005440]"
                  }`}
                >
                  <span className="shrink-0">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        )}
      />

      {/* ── Equal: show pre-computed amount ──────────────── */}
      {watchedMethod === "EQUAL" && (
        <div className="space-y-2">
          {equalAmount && (
            <p className="text-xs text-[#3f4944] px-1">
              Each person pays <span className="font-bold text-[#005440]">{equalAmount}</span>
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {members.map((m: Member) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#f1f4f1]">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#bec9c3]/20">
                  <Avatar url={m.avatarUrl} name={m.name} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#3f4944] truncate">{m.name}</p>
                  <p className="text-xs sm:text-sm font-black text-[#005440]">{equalAmount ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {watchedMethod !== "EQUAL" && (
        <div className="space-y-3">
          <SplitPreview method={watchedMethod} totalAmount={totalAmount} participants={watchedParticipants} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {fields.map((field, index) => {
              const member = memberById[field.memberId];
              const computedAmt = computeParticipantAmount(watchedMethod, totalAmount, watchedParticipants, index);
              const fieldError = getParticipantError(index);
              const suffix = watchedMethod === "PERCENTAGE" ? "%" : watchedMethod === "SHARES" ? "shares" : "₹";

              return (
                <div
                  key={field.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                    fieldError ? "bg-[#ffdad6]/40 ring-1 ring-[#ba1a1a]/30" : "bg-[#e5e9e5]"
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#bec9c3]/20">
                    <Avatar url={member?.avatarUrl} name={member?.name || "Member"} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3f4944] mb-0.5 truncate">{member?.name}</p>
                    <div className="flex items-center gap-1">
                      {watchedMethod === "CUSTOM" && <span className="text-xs font-bold text-[#005440]">₹</span>}
                      <Controller
                        control={control}
                        name={`participants.${index}.value`}
                        render={({ field: f }) => (
                          <input
                            {...f}
                            type="number"
                            min="0"
                            step={watchedMethod === "SHARES" ? "1" : "any"}
                            placeholder="0"
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-[#005440] outline-none"
                          />
                        )}
                      />
                      {watchedMethod !== "CUSTOM" && (
                        <span className="text-xs font-bold text-[#bec9c3] whitespace-nowrap">{suffix}</span>
                      )}
                    </div>
                    {computedAmt && <p className="text-[10px] font-semibold text-[#3f4944] mt-0.5">= {computedAmt}</p>}
                    {fieldError && <p className="text-[10px] text-[#ba1a1a] mt-0.5">{fieldError}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {participantsGlobalError && (
            <p className="text-xs text-[#ba1a1a] bg-[#ffdad6]/30 px-3 py-2 rounded-xl">
              ⚠ {participantsGlobalError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
