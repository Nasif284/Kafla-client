import { userApi as api } from "@/src/lib/api-client";
import { CreateExpenseRequestDTO } from "../interface/interface";

export const expenseServices = {
  createExpense: async (groupId: string, data: CreateExpenseRequestDTO) => {
    const res = await api.post(`/trips/groups/${groupId}/expenses`, data);
    return res.data;
  },

  getExpenses: async (groupId: string) => {
    const res = await api.get(`/trips/groups/${groupId}/expenses`);
    return res.data;
  },

  updateExpense: async (groupId: string, expenseId: string, data: CreateExpenseRequestDTO) => {
    const res = await api.patch(`/trips/groups/${groupId}/expenses/${expenseId}`, data);
    return res.data;
  },

  deleteExpense: async (groupId: string, expenseId: string) => {
    const res = await api.delete(`/trips/groups/${groupId}/expenses/${expenseId}`);
    return res.data;
  },

  getSummary: async (groupId: string) => {
    const res = await api.get(`/trips/groups/${groupId}/expenses/summary`);
    return res.data;
  },

  getBalances: async (groupId: string, mode: "ORIGINAL" | "SIMPLIFIED") => {
    const res = await api.get(`/trips/groups/${groupId}/expenses/balances`, {
      params: { mode },
    });
    return res.data;
  },

  getReport: async (groupId: string) => {
    const res = await api.get(`/trips/groups/${groupId}/expenses/report`);
    return res.data;
  },

  createSettlement: async (
    groupId: string,
    data: { receiverMemberId: string; amount: number; note?: string },
  ) => {
    const res = await api.post(`/trips/groups/${groupId}/expenses/settle`, data);
    return res.data;
  },
};
