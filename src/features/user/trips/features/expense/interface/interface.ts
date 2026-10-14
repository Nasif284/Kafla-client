import { Member } from "../../members/interfaces/interfaces";

export type ExpenseTransactionType = "PAY" | "RECEIVE";
export type ExpenseBalanceStatus = "OWES" | "GET_BACK" | "SETTLED";

export interface ExpenseBalanceTransactionDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  amount: number;
  type: ExpenseTransactionType;
}

export interface ExpenseBalanceMemberDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  paid: number;
  owes: number;
  balance: number;
  status: ExpenseBalanceStatus;
  transactions: ExpenseBalanceTransactionDTO[];
}

export interface GetExpenseBalancesResponseDTO {
  members: ExpenseBalanceMemberDTO[];
}

export interface ExpenseRowProps {
  expense: ExpenseResponseDTO;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ExpenseModalProps {
  id: string;
  mode: "add" | "edit";
  initial?: ExpenseResponseDTO;
  onClose: () => void;
  members: Member[];
  expenseId?: string;
}

export interface ExpenseFormState {
  title: string;
  amount: string;
  date: string;
  category: CategoryCode;
  paidById: string;
  splitMethod: SplitCode;
  splits: Record<string, string>;
}

export interface ExpenseParticipantResponseDTO {
  memberId: string;
  name: string;
  avatarUrl?: string | null;
  amount: number;
  percentage: number | null;
  shares: number | null;
}

export interface ExpenseResponseDTO {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  expenseDate: Date;
  category: { code: string; name: string };
  splitMethod: { code: string; name: string };
  paidBy: { id: string; name: string; avatarUrl?: string | null };
  participants: ExpenseParticipantResponseDTO[];
}

export interface GetExpensesResponseDTO {
  expenses: ExpenseResponseDTO[];
}

export type CategoryCode = "ACCOMMODATION" | "FOOD" | "TRANSPORT" | "ACTIVITIES" | "SHOPPING" | "TICKETS" | "ENTERTAINMENT" | "MEDICAL" | "OTHERS";

export interface CatConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
  bar: string;
  label: string;
}

export type SplitCode = "EQUAL" | "PERCENTAGE" | "CUSTOM" | "SHARES";

export interface ExpenseParticipantDTO {
  memberId: string;
  percentage?: number;
  amount?: number;
  shares?: number;
}

export interface CreateExpenseRequestDTO {
  title: string;
  description?: string;
  amount: number;
  categoryCode: string;
  splitMethodCode: string;
  paidById: string;
  participants: ExpenseParticipantDTO[];
}

export interface SplitPreviewProps {
  method: SplitCode;
  totalAmount: number;
  participants: { memberId: string; value: string }[];
}

export interface GetExpenseSummaryResponseDTO {
  totalExpenses: number;
  expenseCount?: number;
  youPaid: number;
  youOwe: number;
  yourShare?: number;
  youAreOwed: number;
  netBalance: number;
}

export interface ExpenseOverallReportDTO {
  totalExpenseAmount: number;
  averageExpensePerMember: number;
}

export interface ExpenseCategoryReportDTO {
  category: string;
  totalAmount: number;
  percentage: number;
}

export interface ExpenseMemberReportDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  paid: number;
  owes: number;
  balance: number;
}

export interface ExpenseReportResponseDTO {
  overall: ExpenseOverallReportDTO;
  categories: ExpenseCategoryReportDTO[];
  members: ExpenseMemberReportDTO[];
}
