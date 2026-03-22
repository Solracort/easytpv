import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses$ = new BehaviorSubject<Expense[]>([]);
  private readonly STORAGE_KEY = 'expenses';

  constructor(private storage: StorageService) {
    this.initializeExpenses();
  }

  /**
   * Inicializar gastos desde localStorage
   */
  private initializeExpenses(): void {
    const saved = this.storage.getItem<Expense[]>(this.STORAGE_KEY);
    if (saved) {
      const expenses = saved.map(e => ({
        ...e,
        date: new Date(e.date),
        createdAt: new Date(e.createdAt),
      }));
      this.expenses$.next(expenses);
    }
  }

  /**
   * Obtener todos los gastos
   */
  getExpenses(): Observable<Expense[]> {
    return this.expenses$.asObservable();
  }

  /**
   * Obtener gastos del día
   */
  getExpensesByDate(date: Date): Observable<Expense[]> {
    return new Observable(observer => {
      this.expenses$.subscribe(expenses => {
        const dateStr = this.formatDate(date);
        const filtered = expenses.filter(e => this.formatDate(e.date) === dateStr);
        observer.next(filtered);
      });
    });
  }

  /**
   * Obtener gastos del mes
   */
  getExpensesByMonth(year: number, month: number): Observable<Expense[]> {
    return new Observable(observer => {
      this.expenses$.subscribe(expenses => {
        const filtered = expenses.filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        });
        observer.next(filtered);
      });
    });
  }

  /**
   * Obtener gasto por ID
   */
  getExpenseById(id: string): Expense | undefined {
    return this.expenses$.value.find(e => e.id === id);
  }

  /**
   * Crear nuevo gasto
   */
  createExpense(amount: number, description: string): Expense {
    const newExpense: Expense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      description,
      date: new Date(),
      createdAt: new Date(),
    };

    const updated = [...this.expenses$.value, newExpense];
    this.expenses$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);

    return newExpense;
  }

  /**
   * Actualizar gasto
   */
  updateExpense(id: string, changes: Partial<Expense>): void {
    const updated = this.expenses$.value.map(e =>
      e.id === id
        ? { ...e, ...changes, id: e.id, createdAt: e.createdAt }
        : e
    );
    this.expenses$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  /**
   * Eliminar gasto
   */
  deleteExpense(id: string): void {
    const updated = this.expenses$.value.filter(e => e.id !== id);
    this.expenses$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  /**
   * Obtener suma de gastos por fecha
   */
  getTotalExpensesByDate(date: Date): number {
    const dateStr = this.formatDate(date);
    return this.expenses$.value
      .filter(e => this.formatDate(e.date) === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * Obtener suma de gastos por mes
   */
  getTotalExpensesByMonth(year: number, month: number): number {
    return this.expenses$.value
      .filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);
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
