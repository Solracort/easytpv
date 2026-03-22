import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor HTTP para logging y manejo centralizado
 * Puede ser extendido para autenticación, reintentos, etc.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Las mejoras (autenticación, reintentos) pueden agregarse aquí
    // cuando el backend esté listo
    return next.handle(request);
  }
}
