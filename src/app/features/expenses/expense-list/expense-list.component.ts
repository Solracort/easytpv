import { Component, OnInit } from '@angular/core';
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../core/services/expense.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  todayTotal: number = 0;
  selectedDate: Date = new Date();

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpensesByDate(this.selectedDate).subscribe(expenses => {
      this.expenses = expenses;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.todayTotal = this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.loadExpenses();
  }

  openAddExpenseDialog(): void {
    this.dialog.open(AddExpenseModalComponent, {
      width: '400px'
    }).afterClosed().subscribe(() => {
      this.loadExpenses();
    });
  }

  deleteExpense(id: string): void {
    if (confirm('¿Eliminar este gasto?')) {
      this.expenseService.deleteExpense(id);
      this.loadExpenses();
    }
  }
}
