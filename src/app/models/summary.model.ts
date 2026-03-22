export interface DailySummary {
  date: Date;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  orderCount: number;
  expenseCount: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  dailySummaries: DailySummary[];
}
