import { userApi as api } from "@/src/lib/api-client"
import { EditChecklistTask } from "../interfaces/interface";
import { TaskFormData } from "../validators/validator";

export const checklistServices = {
  getChecklist: async (id: string) => {
    const res = await api.get(`/trips/groups/${id}/checklist`);
    return res.data;
  },
  addTask: async (id: string, data: TaskFormData) => {
    const res = await api.post(`/trips/groups/${id}/checklist`, data);
    return res.data;
  },
  editTask: async (id: string, taskId: string, data: EditChecklistTask) => {
    const res = await api.patch(`/trips/groups/${id}/checklist/${taskId}`, data);
    return res.data;
  },
  completeTask: async (id: string, taskId: string) => {
    const res = await api.patch(`/trips/groups/${id}/checklist/${taskId}/complete`);
    return res.data;
  },
  deleteTask: async (id: string, taskId: string) => {
    const res = await api.delete(`/trips/groups/${id}/checklist/${taskId}`);
    return res.data;
  },
};