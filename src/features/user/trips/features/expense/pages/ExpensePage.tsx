"use client";

import { useState, useEffect } from "react";
import { CatConfig, CategoryCode, ExpenseResponseDTO } from "../interface/interface";
import ExpenseModal from "../components/AddExpenceModal";
import ExpenseRow from "../components/ExpenseRow";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import { useParams } from "next/navigation";
import { useGetMembers } from "../../members/hooks/hooks";
import { useDeleteExpense, useGetExpenses } from "../hooks/hooks";
import {
  Hotel,
  Utensils,
  Car,
  Activity,
  ShoppingBag,
  Ticket,
  Film,
  HeartPulse,
  MoreHorizontal,
  Plus,
} from "lucide-react";

export const CATEGORY_CONFIG: Record<CategoryCode, CatConfig> = {
  ACCOMMODATION: {
    icon: <Hotel className="w-5 h-5" />,
    bg: "bg-blue-100",
    text: "text-blue-600",
    bar: "bg-blue-500",
    label: "Accommodation",
  },
  FOOD: {
    icon: <Utensils className="w-5 h-5" />,
    bg: "bg-amber-100",
    text: "text-amber-600",
    bar: "bg-amber-500",
    label: "Food",
  },
  TRANSPORT: {
    icon: <Car className="w-5 h-5" />,
    bg: "bg-purple-100",
    text: "text-purple-600",
    bar: "bg-purple-500",
    label: "Transport",
  },
  ACTIVITIES: {
    icon: <Activity className="w-5 h-5" />,
    bg: "bg-green-100",
    text: "text-green-600",
    bar: "bg-green-500",
    label: "Activities",
  },
  SHOPPING: {
    icon: <ShoppingBag className="w-5 h-5" />,
    bg: "bg-pink-100",
    text: "text-pink-600",
    bar: "bg-pink-500",
    label: "Shopping",
  },
  TICKETS: {
    icon: <Ticket className="w-5 h-5" />,
    bg: "bg-orange-100",
    text: "text-orange-600",
    bar: "bg-orange-500",
    label: "Tickets",
  },
  ENTERTAINMENT: {
    icon: <Film className="w-5 h-5" />,
    bg: "bg-violet-100",
    text: "text-violet-600",
    bar: "bg-violet-500",
    label: "Entertainment",
  },
  MEDICAL: {
    icon: <HeartPulse className="w-5 h-5" />,
    bg: "bg-red-100",
    text: "text-red-600",
    bar: "bg-red-500",
    label: "Medical",
  },
  OTHERS: {
    icon: <MoreHorizontal className="w-5 h-5" />,
    bg: "bg-slate-100",
    text: "text-slate-500",
    bar: "bg-slate-400",
    label: "Others",
  },
};

export default function ExpensesPage() {
  const [expandedId, setExpandedId] = useState<string | null>("exp-001");
  const [editingExp, setEditingExp] = useState<ExpenseResponseDTO | null>(null);
  const [deletingExp, setDeletingExp] = useState<ExpenseResponseDTO | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { id } = useParams();
  const { data, isLoading } = useGetMembers(id as string);
  const members = data?.data?.members;
  const { data: expenseData, isLoading: expensesLoading } = useGetExpenses(id as string);
  const deleteExp = useDeleteExpense()
  const expenses = expenseData?.data?.expenses;
  const anyModal = addModalOpen || !!editingExp || !!deletingExp;
  useEffect(() => {
    document.body.style.overflow = anyModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModal]);

  function handleDelete() {
    if (!deletingExp) return;
    if (expandedId === deletingExp.id) setExpandedId(null);
    deleteExp.mutate({id:id as string,expenseId:deletingExp.id})
    setDeletingExp(null);
  }
  if (isLoading || expensesLoading) {
    return <h1>Loading....</h1>;
  }
  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-[#0f6e56] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Add expense
        </button>
      </div>

      <div className="space-y-3">{expenses?.length === 0 ? <p className="text-sm text-[#bec9c3] text-center py-16">No expenses yet. Add one above!</p> : expenses.map((exp: ExpenseResponseDTO) => <ExpenseRow key={exp.id} expense={exp} expanded={expandedId === exp.id} onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)} onEdit={() => setEditingExp(exp)} onDelete={() => setDeletingExp(exp)} />)}</div>

      {addModalOpen && <ExpenseModal id={id as string} mode="add" onClose={() => setAddModalOpen(false)} members={members} />}
      {editingExp && <ExpenseModal id={id as string} mode="edit" initial={editingExp} onClose={() => setEditingExp(null)} members={members} />}
      {deletingExp && (
        <ConfirmDialog
          title="Delete expense?"
          description={
            <>
              <span className="font-semibold text-[#181d1a]">&ldquo;{deletingExp.title}&rdquo;</span> will be permanently removed and all split records will be lost.
            </>
          }
          confirmLabel="Delete"
          isLoading={deleteExp.isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeletingExp(null)}
        />
      )}
    </>
  );
}
