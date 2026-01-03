
export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

export interface MonthData {
  id: string;
  month: string; // e.g., "Janeiro"
  year: number;
  revenue: number;
  expenses: ExpenseItem[];
  adminFeePercent: number;
  partnersCount: number;
  createdAt: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  adminFeeAmount: number;
  perPartnerAmount: number;
}
