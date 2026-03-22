import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Servicio base para comunicación con API remota
 * Nota: Los endpoints exactos serán integrados por el backend team
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Será configurado dinámicamente

  constructor(private http: HttpClient) {
    this.loadApiConfig();
  }

  /**
   * Cargar configuración de API desde settings/localStorage
   */
  private loadApiConfig(): void {
    const savedUrl = localStorage.getItem('API_URL');
    if (savedUrl) {
      this.apiUrl = savedUrl;
    }
  }

  /**
   * Configurar URL base de API
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
    localStorage.setItem('API_URL', url);
  }

  /**
   * GET request genérico
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST request genérico
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request genérico
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request genérico
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Error desconocido en API'));
  }

  /**
   * ENDPOINTS DOCUMENTADOS PARA INTEGRACIÓN BACKEND
   * 
   * PRODUCTOS:
   * GET    /products          - Obtener lista de productos
   * POST   /products          - Crear nuevo producto
   * PUT    /products/:id      - Actualizar producto
   * DELETE /products/:id      - Eliminar producto
   * 
   * PEDIDOS:
   * GET    /orders            - Obtener lista de pedidos
   * POST   /orders            - Crear nuevo pedido
   * PUT    /orders/:id        - Actualizar pedido
   * DELETE /orders/:id        - Eliminar pedido
   * 
   * GASTOS:
   * GET    /expenses          - Obtener lista de gastos
   * POST   /expenses          - Crear nuevo gasto
   * PUT    /expenses/:id      - Actualizar gasto
   * DELETE /expenses/:id      - Eliminar gasto
   * 
   * REPORTES:
   * GET    /reports/daily/:date    - Resumen diario
   * GET    /reports/monthly/:year/:month - Resumen mensual
   */
}
