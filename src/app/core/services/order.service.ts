import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderItem } from '../../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private completedOrders$ = new BehaviorSubject<Order[]>([]);
  private activeOrders$ = new BehaviorSubject<Map<string, Order>>(new Map());
  private currentTableId$ = new BehaviorSubject<string | null>(null);
  private readonly STORAGE_KEY = 'orders_completed';

  constructor(private storage: StorageService) {
    this.initializeOrders();
  }

  /**
   * Inicializar órdenes completadas desde localStorage
   */
  private initializeOrders(): void {
    const saved = this.storage.getItem<Order[]>(this.STORAGE_KEY);
    if (saved) {
      const orders = saved.map(o => ({
        ...o,
        date: new Date(o.date),
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      }));
      this.completedOrders$.next(orders);
    }
  }

  /**
   * Obtener todas las órdenes completadas
   */
  getCompletedOrders(): Observable<Order[]> {
    return this.completedOrders$.asObservable();
  }

  /**
   * Obtener órdenes activas (por mesa)
   */
  getActiveOrders(): Observable<Order[]> {
    return new Observable(observer => {
      this.activeOrders$.subscribe(map => {
        observer.next(Array.from(map.values()));
      });
    });
  }

  /**
   * Obtener orden actual (de la mesa seleccionada)
   */
  getCurrentOrder(): Observable<Order | null> {
    return new Observable(observer => {
      this.activeOrders$.subscribe(map => {
        const tableId = this.currentTableId$.value;
        if (tableId && map.has(tableId)) {
          observer.next(map.get(tableId) || null);
        } else {
          observer.next(null);
        }
      });
    });
  }

  /**
   * Obtener ID de mesa actual
   */
  getCurrentTableId(): string | null {
    return this.currentTableId$.value;
  }

  /**
   * Seleccionar/cambiar mesa actual
   */
  selectTable(tableId: string): void {
    this.currentTableId$.next(tableId);
  }

  /**
   * Crear nueva orden para mesa o llevar
   */
  createOrder(isForTakeaway: boolean, tableNumberOrName: string): Order {
    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: [],
      isForTakeaway,
      tableNumber: !isForTakeaway ? tableNumberOrName : undefined,
      customerName: isForTakeaway ? tableNumberOrName : undefined,
      date: new Date(),
      total: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const activeMap = this.activeOrders$.value;
    activeMap.set(tableNumberOrName, newOrder);
    this.activeOrders$.next(new Map(activeMap));
    this.currentTableId$.next(tableNumberOrName);

    return newOrder;
  }

  /**
   * Agregar item a la orden de la mesa actual
   */
  addItemToCurrentOrder(item: OrderItem): void {
    const tableId = this.currentTableId$.value;
    if (!tableId) return;

    const activeMap = this.activeOrders$.value;
    const current = activeMap.get(tableId);
    if (!current) return;

    // Buscar si el producto ya existe (sin ingredientes)
    // OJO: esto es simplificado, en realidad deberías comparar ingredientes también
    const existingItem = current.items.find(i => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      current.items.push(item);
    }

    this.recalculateOrderTotal(current);
    activeMap.set(tableId, { ...current });
    this.activeOrders$.next(new Map(activeMap));
  }

  /**
   * Actualizar cantidad de item en orden actual
   */
  updateItemQuantity(productId: string, quantity: number): void {
    const tableId = this.currentTableId$.value;
    if (!tableId) return;

    const activeMap = this.activeOrders$.value;
    const current = activeMap.get(tableId);
    if (!current) return;

    const item = current.items.find(i => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        current.items = current.items.filter(i => i.productId !== productId);
      } else {
        item.quantity = quantity;
        item.subtotal = quantity * item.price;
      }
      this.recalculateOrderTotal(current);
      activeMap.set(tableId, { ...current });
      this.activeOrders$.next(new Map(activeMap));
    }
  }

  /**
   * Eliminar item de orden actual
   */
  removeItemFromCurrentOrder(productId: string): void {
    const tableId = this.currentTableId$.value;
    if (!tableId) return;

    const activeMap = this.activeOrders$.value;
    const current = activeMap.get(tableId);
    if (!current) return;

    current.items = current.items.filter(i => i.productId !== productId);
    this.recalculateOrderTotal(current);
    activeMap.set(tableId, { ...current });
    this.activeOrders$.next(new Map(activeMap));
  }

  /**
   * Cerrar y cobrar orden
   */
  closeAndPayOrder(paymentMethod: 'cash' | 'card', tip: number = 0): Order | null {
    return this._completeOrder(paymentMethod, tip);
  }

  /**
   * Completar orden con método de pago y propina (alias para modal)
   */
  completeOrder(paymentMethod: 'cash' | 'card', tip: number = 0): Order | null {
    return this._completeOrder(paymentMethod, tip);
  }

  /**
   * Implementación interna de completar orden
   */
  private _completeOrder(paymentMethod: 'cash' | 'card', tip: number = 0): Order | null {
    const tableId = this.currentTableId$.value;
    if (!tableId) return null;

    const activeMap = this.activeOrders$.value;
    const current = activeMap.get(tableId);
    if (!current || current.items.length === 0) return null;

    const completed: Order = {
      ...current,
      paymentMethod,
      tip,
      total: current.total + tip,
      status: 'paid',
      updatedAt: new Date(),
    };

    // Guardar en órdenes completadas
    const completed_orders = [...this.completedOrders$.value, completed];
    this.completedOrders$.next(completed_orders);
    this.storage.setItem(this.STORAGE_KEY, completed_orders);

    // Remover de órdenes activas
    activeMap.delete(tableId);
    this.activeOrders$.next(new Map(activeMap));
    this.currentTableId$.next(null);

    return completed;
  }

  /**
   * Cancelar orden actual
   */
  cancelCurrentOrder(): void {
    const tableId = this.currentTableId$.value;
    if (!tableId) return;

    const activeMap = this.activeOrders$.value;
    activeMap.delete(tableId);
    this.activeOrders$.next(new Map(activeMap));
    this.currentTableId$.next(null);
  }

  /**
   * Calcular total de la orden
   */
  private recalculateOrderTotal(order: Order): void {
    order.total = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /**
   * Utilidad: formatear fecha a string YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }
}
