import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../models';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-payment-modal',
  templateUrl: './order-payment-modal.component.html',
  styleUrls: ['./order-payment-modal.component.scss']
})
export class OrderPaymentModalComponent {
  paymentMethod: 'cash' | 'card' = 'cash';
  tip: number = 0;
  totalWithTip: number = 0;

  constructor(
    private dialogRef: MatDialogRef<OrderPaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order },
    private orderService: OrderService
  ) {
    this.calculateTotal();
  }

  get order(): Order {
    return this.data.order;
  }

  /**
   * Calcular total con propina
   */
  calculateTotal(): void {
    this.totalWithTip = this.order.total + this.tip;
  }

  /**
   * Agregar propina predefinida
   */
  addQuickTip(percentage: number): void {
    this.tip = Math.round((this.order.total * percentage / 100) * 100) / 100;
    this.calculateTotal();
  }

  /**
   * Procesar pago y cerrar pedido
   */
  processPayment(): void {
    const completed = this.orderService.closeAndPayOrder(this.paymentMethod, this.tip);
    
    if (completed) {
      this.dialogRef.close({ success: true, order: completed });
    } else {
      alert('Error al procesar el pago');
    }
  }

  /**
   * Cancelar sin pagar
   */
  cancel(): void {
    this.dialogRef.close({ success: false });
  }
}
