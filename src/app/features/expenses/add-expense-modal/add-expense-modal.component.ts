import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../../../core/services/expense.service';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss']
})
export class AddExpenseModalComponent {
  amount: number = 0;
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddExpenseModalComponent>,
    private expenseService: ExpenseService
  ) { }

  addExpense(): void {
    if (this.amount <= 0 || !this.description.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.expenseService.createExpense(this.amount, this.description);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
