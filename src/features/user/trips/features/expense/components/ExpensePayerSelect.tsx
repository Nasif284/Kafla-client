"use client";

import { Control, Controller } from "react-hook-form";
import { Check } from "lucide-react";
import { Member } from "../../members/interfaces/interfaces";
import { ExpenseFormValues } from "../validators/validators";
import Avatar from "@/src/components/Avatar";

interface ExpensePayerSelectProps {
  control: Control<ExpenseFormValues>;
  members: Member[];
}

export default function ExpensePayerSelect({ control, members }: ExpensePayerSelectProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <label className="text-xs sm:text-sm font-bold font-headline text-[#005440] uppercase tracking-wide">
        Paid By
      </label>
      <Controller
        control={control}
        name="paidById"
        render={({ field }) => (
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2 pt-1">
            {members.map((m: Member) => {
              const selected = field.value === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => field.onChange(m.id)}
                  className={`flex flex-col items-center gap-1.5 min-w-[64px] sm:min-w-[72px] cursor-pointer transition-opacity shrink-0 ${
                    selected ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center transition-all ${
                        selected
                          ? "ring-3 sm:ring-4 ring-[#005440] ring-offset-2"
                          : "border border-[#bec9c3]/30"
                      }`}
                    >
                      <Avatar url={m.avatarUrl} name={m.name} size="lg" />
                    </div>
                    {selected && (
                      <div className="absolute -bottom-1 -right-1 bg-[#005440] text-white rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold truncate max-w-[80px] text-center ${
                      selected ? "text-[#005440]" : "text-[#3f4944]"
                    }`}
                  >
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
