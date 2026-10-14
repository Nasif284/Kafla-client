import { Priority, TaskFormProps } from "../interfaces/interface";
import { Member } from "../../members/interfaces/interfaces";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskSchema } from "../validators/validator";
import { useAddTask, useEditTask } from "../hooks/checklist.hooks";
import Avatar from "@/src/components/Avatar";
import { X } from "lucide-react";

const PRIORITY_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  low: { label: "Low", dot: "bg-slate-400", bg: "bg-[#f4f5f4]", text: "text-[#181d1a]" },
  medium: { label: "Medium", dot: "bg-[#0f6e56]", bg: "bg-[#c9eadb]", text: "text-[#022017]" },
  high: { label: "High", dot: "bg-[#ba1a1a]", bg: "bg-[#ffdad6]", text: "text-[#ba1a1a]" },
};

export default function TaskFormModal({
  id,
  taskId,
  title,
  submitLabel,
  initialLabel = "",
  initialCategory = "documents",
  initialPriority = "medium",
  initialNotes = "",
  categories,
  onClose,
  members = [],
  initialAssignee = members[0]?.id || "",
  isEdit = false,
}: TaskFormProps) {
  const add = useAddTask();
  const edit = useEditTask();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: "onBlur",
    defaultValues: {
      title: initialLabel,
      categoryCode: initialCategory.toUpperCase(),
      priorityCode: initialPriority.toUpperCase(),
      assignedTo: initialAssignee,
      notes: initialNotes,
    },
  });
  const onSubmit = (data: TaskFormData) => {
    if (isEdit) {
      edit.mutate({ id, taskId: taskId!, data }, {
        onSuccess: () => {
          onClose()
        }
      })
    } else {
      add.mutate(
        { id, data },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
  }
};

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[560px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-[#bec9c3]/10">
          <h2 className="text-xl sm:text-2xl font-black text-[#181d1a] tracking-tight font-headline">{title}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#f1f4f1] transition-colors text-[#3f4944]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden" noValidate>
          <div className="px-5 sm:px-8 py-4 sm:py-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 [&::-webkit-scrollbar]:hidden">
            {/* Task name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-[#3f4944] px-1">Task Name</label>
              <input type="text" autoFocus {...register("title")} placeholder="e.g., Print flight tickets" className="w-full h-11 sm:h-[52px] px-4 bg-[#f4f5f4] border-none rounded-xl focus:ring-2 focus:ring-[#0f6e56] focus:bg-white transition-all text-sm text-[#181d1a] placeholder:text-[#bec9c3] outline-none" />
              {errors.title && <p className="text-red-500 text-xs mt-1 px-1">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-[#3f4944] px-1">Category</label>
              <Controller
                control={control}
                name="categoryCode"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.code}
                        type="button"
                        onClick={() => field.onChange(cat.code.toUpperCase())}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95
                      ${field.value?.toLowerCase() === cat.code?.toLowerCase() ? "bg-[#0f6e56] text-white shadow-sm" : "bg-[#e5e9e5] text-[#3f4944] hover:bg-[#c9eadb]"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.categoryCode && <p className="text-red-500 text-xs mt-1 px-1">{errors.categoryCode.message}</p>}
            </div>

            {/* Priority */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-[#3f4944] px-1">Priority</label>
              <Controller
                control={control}
                name="priorityCode"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {(["low","medium", "high"] as Priority[]).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const active = field.value?.toLowerCase() === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => field.onChange(p.toUpperCase())}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all active:scale-95
                        ${active ? `${cfg.bg} ${cfg.text} border-transparent shadow-sm` : "border-[#bec9c3]/30 text-[#3f4944] hover:bg-[#e5e9e5]"}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.priorityCode && <p className="text-red-500 text-xs mt-1 px-1">{errors.priorityCode.message}</p>}
            </div>

            {/* Assign to */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-[#3f4944] px-1">Assign To</label>
              <Controller
                control={control}
                name="assignedTo"
                render={({ field }) => (
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 hide-scrollbar">
                    {members.map((member: Member) => {
                      const selected = field.value === member.id;
                      return (
                        <div
                          key={member.id}
                          onClick={() => field.onChange(member.id)}
                          className={`flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-opacity ${
                            selected ? "opacity-100" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center transition-all ${
                                selected
                                  ? "ring-2 sm:ring-3 ring-[#0f6e56] ring-offset-2 shadow-sm"
                                  : "border border-[#bec9c3]/30"
                              }`}
                            >
                              <Avatar src={member.avatarUrl} name={member.name} size="md" className="w-full h-full text-xs sm:text-sm bg-[#005440]/10 text-[#005440]" />
                            </div>
                            {selected && (
                              <div className="absolute -top-1 -right-1 bg-[#0f6e56] text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm pointer-events-none">
                                <span className="text-[9px] sm:text-[10px] font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[11px] sm:text-xs font-bold truncate max-w-[72px] text-center ${
                              selected ? "text-[#0f6e56]" : "text-[#3f4944]"
                            }`}
                          >
                            {member.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              {errors.assignedTo && <p className="text-red-500 text-xs mt-1 px-1">{errors.assignedTo.message}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-[#3f4944] px-1">Notes</label>
              <textarea {...register("notes")} rows={3} placeholder="Additional details about the task..." className="w-full p-3 sm:p-4 bg-[#f4f5f4] border-none rounded-xl focus:ring-2 focus:ring-[#0f6e56] focus:bg-white transition-all text-sm text-[#181d1a] placeholder:text-[#bec9c3] resize-none outline-none" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-2">
            <button type="submit" className="w-full h-12 sm:h-14 bg-[#0f6e56] text-white font-bold text-base sm:text-lg rounded-xl shadow-md hover:bg-[#005440] active:scale-[0.98] transition-all">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
