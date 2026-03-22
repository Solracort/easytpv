import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models';

@Component({
  selector: 'app-table-selector',
  templateUrl: './table-selector.component.html',
  styleUrls: ['./table-selector.component.scss']
})
export class TableSelectorComponent implements OnInit {
  activeOrders: Order[] = [];
  currentTableId: string | null = null;
  
  // Crear nuevo pedido
  showNewOrderForm = false;
  isForTakeaway = false;
  tableNumberOrName = '';
  
  // Número de mesas disponibles (configurable)
  totalTables = 10;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getActiveOrders().subscribe(orders => {
      this.activeOrders = orders;
    });
    
    this.currentTableId = this.orderService.getCurrentTableId();
  }

  /**
   * Seleccionar una mesa activa
   */
  selectTable(tableId: string): void {
    this.orderService.selectTable(tableId);
    this.currentTableId = tableId;
  }

  /**
   * Mostrar formulario para crear nuevo pedido
   */
  openNewOrderForm(): void {
    this.showNewOrderForm = true;
    this.isForTakeaway = false;
    this.tableNumberOrName = '';
  }

  /**
   * Crear nuevo pedido
   */
  createNewOrder(): void {
    if (!this.tableNumberOrName.trim()) return;

    this.orderService.createOrder(this.isForTakeaway, this.tableNumberOrName);
    this.showNewOrderForm = false;
    this.tableNumberOrName = '';
  }

  /**
   * Cancelar formulario
   */
  cancelNewOrder(): void {
    this.showNewOrderForm = false;
    this.tableNumberOrName = '';
  }

  /**
   * Obtener mesas disponibles (no en activeOrders)
   */
  getAvailableTables(): number[] {
    const activeTableNumbers = this.activeOrders
      .filter(o => o.tableNumber)
      .map(o => parseInt(o.tableNumber || '0', 10));
    
    const available: number[] = [];
    for (let i = 1; i <= this.totalTables; i++) {
      if (!activeTableNumbers.includes(i)) {
        available.push(i);
      }
    }
    return available;
  }

  /**
   * Seleccionar mesa disponible rápidamente
   */
  quickSelectTable(tableNumber: number): void {
    this.isForTakeaway = false;
    this.tableNumberOrName = tableNumber.toString();
    this.createNewOrder();
  }

  /**
   * Abrir formulario para pedido para llevar
   */
  openTakeAwayForm(): void {
    this.isForTakeaway = true;
    this.tableNumberOrName = '';
    this.showNewOrderForm = true;
  }
}
