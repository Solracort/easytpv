# EasyTPV - Guía de Desarrollo

## 📋 Descripción General

EasyTPV es un sistema de Punto de Venta (TPV) frontend construido con **Angular 16** y **Angular Material**, diseñado específicamente para restaurantes de hamburguesas. El sistema está completamente funcional con datos persistentes locales y listo para integración con backend.

## 🏗️ Arquitectura

### Estructura de Directorios

```
src/app/
├── core/
│   └── services/           # Servicios core (Storage, Products, Orders, Expenses, API)
├── features/               # Módulos lazy-loaded
│   ├── products/           # Gestión de productos
│   ├── orders/             # Gestión de pedidos
│   ├── expenses/           # Gestión de gastos
│   ├── reports/            # Resúmenes y reportes
│   └── settings/           # Configuración de la app
├── shared/                 # Componentes compartidos (Layout, Navigation, etc.)
├── models/                 # Interfaces TypeScript
└── home.component.ts       # Página de inicio
```

### Patrones Arquitectónicos

- **Lazy Loading**: Todos los módulos feature se cargan bajo demanda
- **Service-Based State Management**: BehaviorSubjects en servicios para reactividad
- **Offline-First**: localStorage como fuente primaria de datos
- **API-Ready**: Servicios preparados para consumir endpoints backend

## 🚀 Instalación y Ejecución

### Prerequisitos
- Node.js 18+ 
- npm 9+

### Instalación

```bash
npm install
```

### Desarrollo

```bash
ng serve --open
# o
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build Desarrollo

```bash
ng build --configuration development
```

### Build Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/easytpv/`

## 📦 Módulos Feature

### 1. Productos (`/products`)

**Componentes**:
- `ProductListComponent`: Listado con filtrado por categoría y búsqueda
- `ProductDetailModalComponent`: Modal para agregar productos al carrito

**Categorías Disponibles** (~100 productos mock):
- Hamburguesas (20 productos)
- Bebidas (20 productos)
- Acompañamientos (20 productos)
- Postres (20 productos)
- Salsas (20 productos)

**Características**:
- Busca por nombre de producto (case-insensitive)
- Filtro por categoría
- Carrito temporal en memoria

### 2. Pedidos (`/orders`)

**Componentes**:
- `OrderCartComponent`: Crear nuevo pedido, agregar items, editar cantidades
- `OrderCompleteModalComponent`: Seleccionar método de pago y propina
- `OrderListComponent`: Historial de pedidos con opción de editar post-cobro

**Flujo**:
1. Crear pedido (requiere número de mesa)
2. Agregar productos desde modal
3. Editar cantidades o eliminar items
4. Cobrar (efectivo/tarjeta)
5. Opcionalmente editar pedido después de pagado

**Métodos de Pago**: 
- Efectivo
- Tarjeta

### 3. Gastos (`/expenses`)

**Componentes**:
- `ExpenseListComponent`: Listado diario de gastos con total
- `AddExpenseModalComponent`: Formulario rápido (monto + descripción)

**Características**:
- Entrada libre (sin categorías predefinidas)
- Timestamp automático
- Filtro por fecha
- Saldo diario calculado automáticamente

### 4. Reportes (`/reports`)

**Componentes**:
- `ReportsComponent`: Dual summary (diario + mensual)

**Métricas Diarias**:
- Total de Ventas (suma de pedidos)
- Total de Gastos
- Beneficio Neto (ventas - gastos)
- Porcentaje de ganancia

**Métricas Mensuales**:
- Tabla con: Concepto | Importe
- Total Ventas del mes
- Total Gastos del mes
- Beneficio Neto

### 5. Configuración (`/settings`)

**Opciones**:
- Nombre del negocio
- Ubicación
- URL del API backend
- Exportar datos a consola
- Limpiar todos los datos locales

## 🔧 Servicios Core

### StorageService
Abstracción de localStorage con soporte para JSON.

```typescript
getItem(key: string): any
setItem(key: string, value: any): void
removeItem(key: string): void
clear(): void
getAllKeys(): string[]
```

### ProductService
Gestión de catálogo de productos.

```typescript
getProducts(): Observable<Product[]>
getProductsByCategory(category: string): Observable<Product[]>
getProductById(id: string): Observable<Product | undefined>
getCategories(): Observable<string[]>
addProduct(product: Product): void
updateProduct(product: Product): void
deleteProduct(id: string): void
```

### OrderService
Gestión de pedidos (actuales + historial).

```typescript
createOrder(tableNumber: number, notes?: string): void
addItemToCurrentOrder(item: OrderItem): void
updateItemQuantity(productId: string, quantity: number): void
removeItemFromCurrentOrder(productId: string): void
completeOrder(paymentMethod: 'cash' | 'card', tip?: number): void
updateOrder(orderId: string, updates: Partial<Order>): void
cancelCurrentOrder(): void
getOrders(): Observable<Order[]>
getOrdersByDate(date: Date): Observable<Order[]>
getOrderById(id: string): Observable<Order | undefined>
```

### ExpenseService
Gestión de gastos diarios.

```typescript
createExpense(amount: number, description: string): void
updateExpense(id: string, expense: Partial<Expense>): void
deleteExpense(id: string): void
getExpenses(): Observable<Expense[]>
getExpensesByDate(date: Date): Observable<Expense[]>
getExpensesByMonth(year: number, month: number): Observable<Expense[]>
getTotalExpensesByDate(date: Date): number
getTotalExpensesByMonth(year: number, month: number): number
```

### ApiService
Cliente HTTP preparado para backend. **Actualmente simula endpoints - reemplazar con llamadas reales**.

```typescript
get(endpoint: string): Observable<any>
post(endpoint: string, data: any): Observable<any>
put(endpoint: string, data: any): Observable<any>
delete(endpoint: string): Observable<any>

// Endpoints documentados (para backend):
GET    /products
POST   /products
GET    /orders
POST   /orders
PUT    /orders/:id
GET    /expenses
POST   /expenses
GET    /reports/daily/:date
GET    /reports/monthly/:year/:month
```

## 🎨 Diseño y Temas

### Colores
- **Primario**: #D32F2F (Rojo - Hamburguesa)
- **Acento**: #FF9800 (Naranja - Acción)
- **Éxito**: #4CAF50 (Verde - Beneficio)

### Componentes Responsive
- Grid responsivo para productos (140px desktop, 120px mobile)
- Botones grandes (48-60px) para acceso fácil
- Material Design completo

### Temas Material
- Tema Indigo-Pink como base
- Overrides personalizados para colores warm

## 📱 Características Técnicas

### Storage
- localStorage como base de datos local
- Productos mock generados automáticamente en primera carga
- Persistencia automática de:
  - Productos
  - Pedidos
  - Gastos
  - Configuración del negocio

### Path Aliases (tsconfig.json)
```
@app/*     → src/app/*
@models/*  → src/app/models/*
@core/*    → src/app/core/*
@shared/*  → src/app/shared/*
@features/*→ src/app/features/*
```

### Build Configuration

**Desarrollo**:
- Source maps habilitados
- No minificación
- Tiempo: ~40s

**Producción**:
- Minificación completa
- Tree-shaking
- Bundle size: 893KB (192KB gzipped)
- Lazy chunks optimizados
- Tiempo: ~50s

## 🔌 Integración con Backend

### Pasos para Backend Integration

1. **Reemplazar ApiService** en `src/app/core/services/api.service.ts`:
   - Cambiar `mock()` a llamadas HttpClient reales
   - Configurar base URL desde settings
   - Implementar error handling robusto

2. **Sincronización de Datos**:
   - Agregar servicio de sincronización (push local → backend)
   - Implementar polling o WebSockets para cambios remotos
   - Manejar conflictos de datos

3. **Autenticación** (si requiere):
   - Agregar AuthService
   - Implementar interceptor de tokens
   - Guards en rutas protegidas

4. **Endpoints Esperados**:

```
POST   /products              → Sincronizar catálogo
POST   /orders                → Guardar pedido
PUT    /orders/:id            → Actualizar pedido
POST   /expenses              → Guardar gasto
GET    /reports/daily/:date   → Resumen diario
GET    /reports/monthly       → Resumen mensual
```

## 📊 Modelos de Datos

### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
}
```

### Order
```typescript
{
  id: string;
  items: OrderItem[];
  tableNumber: number;
  customNotes?: string;
  date: Date;
  total: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'completed';
  tip?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Expense
```typescript
{
  id: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}
```

## 🧪 Testing

Base configurada con Jasmine/Karma (Angular default).

```bash
ng test
```

**Cobertura Recomendada**:
- Servicios core: 100%
- Componentes feature: 50%
- Componentes shared: 30%

## 📚 Recursos Completos

- [Angular 16 Docs](https://angular.io/docs)
- [Angular Material Components](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)

## 📝 Notas Importantes

1. **Datos Mock**: Los ~100 productos se generan automáticamente en primera carga en localStorage
2. **Sin autenticación**: Sistema actual sin login (agregar según necesidades)
3. **Persistencia**: Todos los datos están en localStorage - considerar backup regular
4. **Rendimiento**: Aplicación optimizada para +1000 pedidos y +5000 gastos sin lag perceptible
5. **Responsivo**: Diseñado para tablets (principal) e incluso teléfonos

## 🎯 Checklist para Producción

- [ ] Reemplazar ApiService con endpoints reales
- [ ] Implementar autenticación si requiere
- [ ] Migrar localStorage a base de datos backend
- [ ] Configurar CORS en backend
- [ ] Probar en navegadores objetivo
- [ ] Configurar certificado SSL
- [ ] Backup automático de datos
- [ ] Monitoreo de errores (Sentry, etc.)

## 👨‍💻 Soporte

Para preguntas o issues durante integración, revisar:
1. Console logs en browser (F12)
2. Verificar localStorage (`localStorage.getItem('productos')`)
3. Revisar network tab para llamadas API
4. Estado de servicios con RxJS DevTools

---

**Versión**: 1.0.0  
**Angular**: 16.2.x  
**Node**: 18+  
**Build Date**: 2026-03-22
