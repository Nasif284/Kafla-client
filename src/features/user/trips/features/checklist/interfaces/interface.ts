import { Member } from "../../members/interfaces/interfaces";

export type CategoryId = string;
export type Priority = "low" | "medium" | "high";

export interface ChecklistMember {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
}
export interface CheckItem {
  id: string;
  title: string;
  notes: string | null;

  isCompleted: boolean;

  priorityCode: string;
  categoryCode: string;

  assignee: ChecklistMember | null;

  createdBy: {
    id: string;
    fullName: string;
  };

  createdAt: Date;
  completedAt: Date | null;
}

export interface Category {
  code: string;
  name: string;
  completed: number;
  total: number;
}

export interface TaskFormProps {
  id: string;
  taskId?: string;
  title: string;
  submitLabel: string;
  initialLabel?: string;
  initialCategory?: string;
  initialPriority?: Priority;
  initialAssignee?: string;
  initialNotes?: string;
  categories: Category[];
  members: Member[];
  isEdit: boolean;
  onClose: () => void;
}

export interface EditChecklistTask {
  title: string;
  categoryCode: string;
  priorityCode: string;
  assignedTo: string;
  notes?: string;
}


