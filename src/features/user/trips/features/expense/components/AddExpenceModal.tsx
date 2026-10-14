"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save } from "lucide-react";

import {
  CategoryCode,
  CreateExpenseRequestDTO,
  ExpenseModalProps,
  ExpenseParticipantDTO,
  ExpenseResponseDTO,
  SplitCode,
} from "../interface/interface";
import { CATEGORY_CONFIG } from "../pages/ExpensePage";
import { ExpenseFormValues, expenseSchema } from "../validators/validators";
import { useCreateExpense, useUpdateExpense } from "../hooks/hooks";
import ExpensePayerSelect from "./ExpensePayerSelect";
import ExpenseSplitSection from "./ExpenseSplitSection";

function formatAmount(n: number): string {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function ExpenseModal({ id, mode, initial, onClose, members, expenseId }: ExpenseModalProps) {
  const memberById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);

  function buildDefaultParticipants(splitMethod: string): { memberId: string; value: string }[] {
    const defaultVal =
      splitMethod === "SHARES"
        ? "1"
        : splitMethod === "PERCENTAGE"
        ? String(Math.round(100 / members.length))
        : "0";
    return members.map((m) => ({ memberId: m.id, value: defaultVal }));
  }

  function fromDTO(exp: ExpenseResponseDTO): ExpenseFormValues {
    return {
      title: exp.title,
      amount: String(exp.amount),
      category: exp.category.code,
      paidById: exp.paidBy.id,
      splitMethod: exp.splitMethod.code as SplitCode,
      description: exp.description ?? "",
      participants: exp.participants.map((p) => {
        let value = "0";
        if (exp.splitMethod.code === "PERCENTAGE") value = String(p.percentage ?? 0);
        else if (exp.splitMethod.code === "CUSTOM") value = String(p.amount);
        else if (exp.splitMethod.code === "SHARES") value = String(p.shares ?? 1);
        else value = String(p.percentage ?? Math.round(100 / members.length));
        return { memberId: p.memberId, value };
      }),
    };
  }

  const defaultValues: ExpenseFormValues = initial
    ? fromDTO(initial)
    : {
        title: "",
        amount: "",
        category: "OTHERS",
        paidById: members[0]?.id || "me",
        splitMethod: "EQUAL",
        description: "",
        participants: buildDefaultParticipants("EQUAL"),
      };

  function computeParticipantAmount(
    method: SplitCode,
    total: number,
    participants: { memberId: string; value: string }[],
    index: number
  ): string | null {
    const raw = parseFloat(participants[index]?.value || "0") || 0;
    if (total <= 0) return null;

    if (method === "EQUAL") {
      return formatAmount(total / participants.length);
    }
    if (method === "PERCENTAGE") {
      const amount = (raw / 100) * total;
      return raw > 0 ? formatAmount(amount) : null;
    }
    if (method === "CUSTOM") {
      return raw > 0 ? formatAmount(raw) : null;
    }
    if (method === "SHARES") {
      const totalShares = participants.reduce((a, p) => a + (parseFloat(p.value) || 0), 0);
      if (totalShares <= 0 || raw <= 0) return null;
      return formatAmount((raw / totalShares) * total);
    }
    return null;
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields } = useFieldArray({ control, name: "participants" });

  const watchedAmount = watch("amount");
  const watchedMethod = watch("splitMethod") as SplitCode;
  const watchedParticipants = watch("participants");

  const totalAmount = parseFloat(watchedAmount) || 0;

  useEffect(() => {
    const defaults = buildDefaultParticipants(watchedMethod);
    defaults.forEach((d, i) => {
      setValue(`participants.${i}.value`, d.value, { shouldValidate: false });
    });
  }, [watchedMethod]);

  const add = useCreateExpense();
  const edit = useUpdateExpense();

  function onSubmit(values: ExpenseFormValues) {
    const amt = parseFloat(values.amount);

    const createDTO: CreateExpenseRequestDTO = {
      title: values.title,
      description: values.description || undefined,
      amount: amt,
      categoryCode: values.category,
      splitMethodCode: values.splitMethod,
      paidById: values.paidById,
      participants: values.participants.map((p) => {
        const raw = parseFloat(p.value) || 0;
        const dto: ExpenseParticipantDTO = { memberId: p.memberId };
        if (values.splitMethod === "EQUAL") {
          dto.amount = amt / values.participants.length;
          dto.percentage = 100 / values.participants.length;
          dto.shares = 1;
        } else if (values.splitMethod === "PERCENTAGE") {
          dto.percentage = raw;
          dto.amount = (raw / 100) * amt;
        } else if (values.splitMethod === "CUSTOM") {
          dto.amount = raw;
        } else if (values.splitMethod === "SHARES") {
          const totalShares = values.participants.reduce((a, pp) => a + (parseFloat(pp.value) || 0), 0);
          dto.shares = raw;
          dto.amount = totalShares > 0 ? (raw / totalShares) * amt : 0;
        }
        return dto;
      }),
    };

    if (mode === "add") {
      add.mutate(
        { id, data: createDTO },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      const targetId = initial?.id || expenseId;
      if (!targetId) {
        throw new Error("expense id missing");
      }
      edit.mutate(
        { id, expenseId: targetId, data: createDTO },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  }

  const equalAmount = totalAmount > 0 ? formatAmount(totalAmount / members.length) : null;

  function getParticipantError(index: number): string | undefined {
    return errors.participants?.[index]?.value?.message;
  }
  const participantsGlobalError = errors.participants?.message as string | undefined;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[640px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-8 pb-3 sm:pb-4 border-b border-[#bec9c3]/10">
          <h2 className="text-xl sm:text-2xl font-extrabold font-headline tracking-tight text-[#005440]">
            {mode === "add" ? "Add New Expense" : "Edit Expense"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#e5e9e5] transition-colors text-[#3f4944]"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-5 sm:px-8 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-6 sm:space-y-8 pb-8 flex-1">
            {/* Amount */}
            <div className="text-center py-2 sm:py-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#005440] font-headline">₹</span>
                <input
                  {...register("amount")}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  className="w-36 sm:w-48 text-4xl sm:text-6xl font-black font-headline text-[#181d1a] border-none focus:ring-0 bg-transparent placeholder:text-[#e0e3e0] text-center outline-none"
                />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#3f4944] mt-2">
                Enter Amount
              </p>
              {errors.amount && <p className="text-xs text-[#ba1a1a] mt-1">{errors.amount.message}</p>}
            </div>

            {/* Expense name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-bold font-headline text-[#005440] uppercase tracking-wide">
                Expense Name
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g., Boat Rental to Nusa Penida"
                className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#e5e9e5] border-none focus:bg-white focus:ring-2 focus:ring-[#0f6e56]/20 transition-all text-[#181d1a] placeholder:text-[#bec9c3] outline-none text-sm"
              />
              {errors.title && <p className="text-xs text-[#ba1a1a]">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-bold font-headline text-[#005440] uppercase tracking-wide">
                Category
              </label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORY_CONFIG) as CategoryCode[]).map((code) => {
                      const cfg = CATEGORY_CONFIG[code];
                      const active = field.value === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => field.onChange(code)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                            active
                              ? "bg-[#0f6e56] text-white shadow-sm"
                              : "bg-[#e5e9e5] text-[#3f4944] hover:bg-[#e0e3e0]"
                          }`}
                        >
                          <span className={active ? "text-white" : cfg.text}>{cfg.icon}</span>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Paid by */}
            <ExpensePayerSelect control={control} members={members} />

            {/* Split method */}
            <ExpenseSplitSection
              control={control}
              watchedMethod={watchedMethod}
              totalAmount={totalAmount}
              members={members}
              memberById={memberById}
              fields={fields}
              watchedParticipants={watchedParticipants}
              equalAmount={equalAmount}
              getParticipantError={getParticipantError}
              participantsGlobalError={participantsGlobalError}
              computeParticipantAmount={computeParticipantAmount}
            />
          </div>

          {/* Footer */}
          <footer className="p-4 sm:p-8 pt-3 sm:pt-4 border-t border-[#bec9c3]/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 bg-[#005440] text-white font-headline font-bold text-base sm:text-lg rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 sm:gap-3 shadow-lg shadow-[#005440]/20 hover:bg-[#0f6e56] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSubmitting ? "Saving…" : "Save Expense"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
