import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ExpenseListComponent,
    AddExpenseModalComponent
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ]
})
export class ExpensesModule { }
