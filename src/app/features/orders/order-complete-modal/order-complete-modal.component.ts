import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-complete-modal',
  templateUrl: './order-complete-modal.component.html',
  styleUrls: ['./order-complete-modal.component.scss']
})
export class OrderCompleteModalComponent {
  paymentMethod: 'cash' | 'card' = 'cash';
  tip: number = 0;

  constructor(
    public dialogRef: MatDialogRef<OrderCompleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private orderService: OrderService
  ) { }

  getTotalWithTip(): number {
    return this.order.total + this.tip;
  }

  completeOrder(): void {
    const completed = this.orderService.completeOrder(this.paymentMethod, this.tip);
    if (completed) {
      this.dialogRef.close(completed);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
