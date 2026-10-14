"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CheckSquare,
  ListChecks,
  FileText,
  Shirt,
  Sparkles,
  Laptop,
  ShoppingBag,
  Folder,
  Plus,
  PlusCircle,
} from "lucide-react";
import { Category, CategoryId, CheckItem, Priority } from "../interfaces/interface";
import ProgressBar from "../components/ProgressBar";
import ChecklistCategorySidebar, { SidebarCategoryItem } from "../components/ChecklistCategorySidebar";
import ChecklistItemRow from "../components/ChecklistItemRow";
import TaskFormModal from "../components/TaskFormModal";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import { useCompleteTask, useDeleteTask, useGetChecklist } from "../hooks/checklist.hooks";
import { useAuthStore } from "@/src/store/auth.store";
import { useGetMembers } from "../../members/hooks/hooks";
import { Member } from "../../members/interfaces/interfaces";
import { useGetGroup } from "@/src/features/user/trips/hooks/trip.hooks";

function getCategoryIcon(name: string) {
  switch (name.toLowerCase()) {
    case "documents":
      return <FileText size={16} />;
    case "clothing":
      return <Shirt size={16} />;
    case "toiletries":
      return <Sparkles size={16} />;
    case "electronics":
      return <Laptop size={16} />;
    case "essentials":
      return <ShoppingBag size={16} />;
    default:
      return <Folder size={16} />;
  }
}

export default function ChecklistPage() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { id } = useParams();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();
  const { data: checklistData, isLoading } = useGetChecklist(id as string);
  const { data: tripData } = useGetGroup(id as string);
  const isPast = tripData?.data?.dateTo ? new Date(tripData.data.dateTo) < new Date() : false;
  const checklist = checklistData?.data;
  const categories = checklist?.categories ?? [];
  const groupedItems = checklist?.groupedItems ?? {};
  const myTasks = checklist?.myTasks ?? [];
  const summary = checklist?.summary;
  const { data, isLoading: membersLoading } = useGetMembers(id as string);
  const members = data?.data?.members;

  const [activeCategory, setActiveCategory] = useState<CategoryId>("my");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CheckItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CheckItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const anyModalOpen = isAddTaskOpen || !!editingItem || !!deletingItem;

  const sidebarCategories: SidebarCategoryItem[] = [
    {
      id: "my",
      name: "My Tasks",
      icon: <CheckSquare size={16} />,
      packed: myTasks.filter((t: CheckItem) => t.isCompleted).length,
      total: myTasks.length,
    },
    {
      id: "all",
      name: "All Tasks",
      icon: <ListChecks size={16} />,
      packed: summary?.completed ?? 0,
      total: summary?.total ?? 0,
    },
    ...categories.map((c: Category) => ({
      id: c.code,
      name: c.name,
      icon: getCategoryIcon(c.name),
      packed: c.completed,
      total: c.total,
    })),
  ];

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  const pct = summary?.total ? Math.round((summary.completed * 100) / summary.total) : 0;

  const filteredItems = useMemo(() => {
    switch (activeCategory) {
      case "my":
        return myTasks;
      case "all":
        return Object.values(groupedItems).flat();
      default:
        return groupedItems[activeCategory] ?? [];
    }
  }, [activeCategory, groupedItems, myTasks]);

  function toggleItem(taskId: string) {
    completeTask.mutate({ id: id as string, taskId });
  }

  function handleDeleteConfirm() {
    if (!deletingItem) return;
    deleteTask.mutate({ id: id as string, taskId: deletingItem.id });
    setDeletingItem(null);
  }

  const activeCat = useMemo(() => {
    if (activeCategory === "my") return "My Tasks";
    if (activeCategory === "all") return "All Items";
    return categories?.find((c: Category) => c.code === activeCategory)?.name;
  }, [activeCategory, categories]);

  const isAdmin = members?.find((m: Member) => m.userId === currentUserId)?.role === "admin";

  if (isLoading || membersLoading) {
    return <div className="flex-1 px-4 flex flex-col gap-8">Loading...</div>;
  }

  return (
    <>
      <div className="flex-1 px-0 flex flex-col gap-6">
        <div className="w-full max-w-2xl px-4 sm:px-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-[#181d1a]">
              {summary?.completed ?? 0} of {summary?.total ?? 0} items packed
            </span>
            <span className="bg-[#0f6e56]/10 text-[#0f6e56] px-3 py-1 rounded-full text-xs font-black">
              Completed {pct}%
            </span>
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start px-4 sm:px-6">
          <ChecklistCategorySidebar
            categories={sidebarCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Items list */}
          <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 shadow-sm border border-[#bec9c3]/10 w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg sm:text-xl font-black font-headline text-[#181d1a]">{activeCat}</h3>

              {!isPast && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddTaskOpen(true)}
                    className="bg-[#0f6e56] text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs hover:opacity-90 active:scale-95 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add Task
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              {filteredItems.length === 0 && (
                <p className="text-sm text-[#bec9c3] px-4 py-6 text-center">No items yet. Add one below!</p>
              )}
              {filteredItems.map((item: CheckItem) => {
                const isMyTask = item.assignee?.userId === currentUserId;
                const canToggle = !isPast && (isMyTask || isAdmin);

                return (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    isMyTask={isMyTask}
                    canToggle={canToggle}
                    isAdmin={isAdmin}
                    isPast={isPast}
                    activeCategory={activeCategory}
                    isMenuOpen={openMenuId === item.id}
                    onToggle={toggleItem}
                    onToggleMenu={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                    onEdit={setEditingItem}
                    onDelete={setDeletingItem}
                    onCloseMenu={() => setOpenMenuId(null)}
                  />
                );
              })}

              {!isPast && (
                <div className="pt-4 mt-2 border-t border-[#bec9c3]/10">
                  <button
                    onClick={() => setIsAddTaskOpen(true)}
                    className="flex items-center gap-3 px-4 w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <PlusCircle size={20} className="text-[#0f6e56]" />
                    <span className="text-sm font-medium text-[#bec9c3]">Add a new item to {activeCat}…</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isPast && isAddTaskOpen && (
        <TaskFormModal
          id={id as string}
          members={members || []}
          title="Add New Task"
          submitLabel="Add to checklist"
          initialCategory={
            activeCategory === "all" || activeCategory === "my"
              ? categories?.[0]?.code || "essentials"
              : activeCategory
          }
          categories={categories}
          onClose={() => setIsAddTaskOpen(false)}
          isEdit={false}
        />
      )}

      {!isPast && editingItem && (
        <TaskFormModal
          id={id as string}
          taskId={editingItem.id}
          members={members || []}
          title="Edit Task"
          submitLabel="Save changes"
          initialLabel={editingItem.title}
          initialCategory={editingItem.categoryCode?.toLowerCase() || "essentials"}
          initialPriority={(editingItem.priorityCode?.toLowerCase() as Priority) || "medium"}
          initialAssignee={editingItem.assignee?.id}
          isEdit={true}
          initialNotes={editingItem.notes ?? ""}
          categories={categories}
          onClose={() => setEditingItem(null)}
        />
      )}

      {!isPast && deletingItem && (
        <ConfirmDialog
          title="Delete task?"
          description={
            <>
              <span className="font-semibold text-[#181d1a]">&ldquo;{deletingItem.title}&rdquo;</span> will be permanently removed from the checklist.
            </>
          }
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </>
  );
}
