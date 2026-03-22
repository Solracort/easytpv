import { Component, OnInit } from '@angular/core';
import { DailySummary } from '@models/summary.model';
import { OrderService } from '@core/services/order.service';
import { ExpenseService } from '@core/services/expense.service';

interface PaymentSummary {
  cash: number;
  card: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  selectedDate: Date = new Date();
  selectedMonth: Date = new Date();
  dailySummary: DailySummary | null = null;
  monthlySummary: { label: string; value: number }[] = [];
  paymentSummary: PaymentSummary = { cash: 0, card: 0 };
  totalTips: number = 0;
  topProducts: TopProduct[] = [];

  constructor(
    private orderService: OrderService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    this.loadDailySummary();
    this.loadMonthlySummary();
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.loadDailySummary();
  }

  onMonthChange(): void {
    this.loadMonthlySummary();
  }

  private loadDailySummary(): void {
    this.orderService.getCompletedOrders().subscribe((orders: any[]) => {
      const dateStr = this.formatDate(this.selectedDate);
      const dailyOrders = orders.filter(o => this.formatDate(o.date) === dateStr || this.formatDate(o.createdAt) === dateStr);
      
      const totalSales = dailyOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const expenseTotal = this.expenseService.getTotalExpensesByDate(this.selectedDate);

      // Desglose por método de pago
      this.paymentSummary = {
        cash: dailyOrders
          .filter(o => o.paymentMethod === 'cash')
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        card: dailyOrders
          .filter(o => o.paymentMethod === 'card')
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0)
      };

      // Total de propinas
      this.totalTips = dailyOrders.reduce((sum: number, o: any) => sum + (o.tip || 0), 0);

      // Top 5 productos más vendidos
      this.topProducts = this.getTopProductsFromOrders(dailyOrders);

      this.dailySummary = {
        date: this.selectedDate,
        totalSales,
        totalExpenses: expenseTotal,
        netProfit: totalSales - expenseTotal,
        orderCount: dailyOrders.length,
        expenseCount: 0,
      };

      this.expenseService.getExpensesByDate(this.selectedDate).subscribe((expenses: any[]) => {
        if (this.dailySummary) {
          this.dailySummary.expenseCount = expenses.length;
        }
      });
    });
  }

  private loadMonthlySummary(): void {
    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth() + 1;

    this.orderService.getCompletedOrders().subscribe((orders: any[]) => {
      const monthlyOrders = orders.filter(o => {
        const d = new Date(o.date || o.createdAt);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      const totalSales = monthlyOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const totalExpenses = this.expenseService.getTotalExpensesByMonth(year, month);

      this.monthlySummary = [
        { label: 'Total Ventas', value: totalSales },
        { label: 'Total Gastos', value: totalExpenses },
        { label: 'Beneficio Neto', value: totalSales - totalExpenses },
      ];
    });
  }

  private getTopProductsFromOrders(orders: any[]): TopProduct[] {
    const productMap = new Map<string, { quantity: number; revenue: number }>();

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productKey = item.productName || item.name;
          const current = productMap.get(productKey) || { quantity: 0, revenue: 0 };
          productMap.set(productKey, {
            quantity: current.quantity + (item.quantity || 0),
            revenue: current.revenue + (item.subtotal || 0)
          });
        });
      }
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  getMonthLabel(): string {
    return this.selectedMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }
}
