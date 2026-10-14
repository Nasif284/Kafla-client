export interface RouteStop {
  id: string;
  number: number;
  time: string;
  title: string;
  location: string;
  category: "Food" | "Activity" | "Transport" | "Stay";
  duration: string;
  distanceFromPrev?: string;
  driveTimeFromPrev?: string;
}

export interface DebtTransfer {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitType: "Equal" | "Exact" | "Percentage";
  date: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: "Documents" | "Gear" | "Clothing" | "Medical";
  assignedTo: string;
  priority: "Urgent" | "High" | "Medium";
  completed: boolean;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  highlight: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ComparisonItem {
  feature: string;
  withoutKafla: string;
  withKafla: string;
}
