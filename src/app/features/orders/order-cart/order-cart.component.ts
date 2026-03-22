import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../../../models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderPaymentModalComponent } from '../order-payment-modal/order-payment-modal.component';
import { OrderProductSelectorModalComponent } from '../order-product-selector-modal/order-product-selector-modal.component';

@Component({
  selector: 'app-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss']
})
export class OrderCartComponent implements OnInit {
  currentOrder: Order | null = null;
  displayedColumns: string[] = ['name', 'quantity', 'ingredients', 'price', 'actions'];

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.orderService.getCurrentOrder().subscribe(order => {
      this.currentOrder = order;
    });
  }

  /**
   * Actualizar cantidad de item
   */
  updateItemQuantity(productId: string, quantity: number): void {
    if (quantity > 0) {
      this.orderService.updateItemQuantity(productId, quantity);
    }
  }

  /**
   * Remover item del carrito
   */
  removeItem(productId: string): void {
    if (confirm('¿Eliminar este producto del carrito?')) {
      this.orderService.removeItemFromCurrentOrder(productId);
    }
  }

  /**
   * Obtener descripción de ingredientes para mostrar
   */
  getIngredientsDescription(item: OrderItem): string {
    if (!item.selectedIngredients) return '--';
    
    const parts: string[] = [];
    
    // Ingredientes removidos
    if (item.selectedIngredients.included && item.selectedIngredients.included.length > 0) {
      parts.push(`✓ ${item.selectedIngredients.included.join(', ')}`);
    }
    
    // Ingredientes adicionales
    if (item.selectedIngredients.additional && item.selectedIngredients.additional.length > 0) {
      parts.push(`+ ${item.selectedIngredients.additional.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : '--';
  }

  /**
   * Abrir modal de pago
   */
  openPaymentDialog(): void {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const dialogRef = this.dialog.open(OrderPaymentModalComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: { order: this.currentOrder }
    });

    dialogRef.afterClosed().subscribe(() => {
      // El modal maneja el cierre y pago
    });
  }

  /**
   * Cancelar orden actual
   */
  cancelOrder(): void {
    if (confirm('¿Cancelar este pedido? Se perderán todos los items.')) {
      this.orderService.cancelCurrentOrder();
    }
  }

  /**
   * Abrir modal de selección de productos
   */
  openProductSelectorModal(): void {
    const dialogRef = this.dialog.open(OrderProductSelectorModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
