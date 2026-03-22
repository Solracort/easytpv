# API Specification - EasyTPV Backend

**Frontend**: Angular 16  
**Target Backend**: REST API  
**Base URL**: Configurable desde Settings (`/settings`)

## 📋 Overview

El frontend de EasyTPV está completamente funcional con mock data y localStorage. El backend debe implementar los endpoints documentados abajo para reemplazar la persistencia local.

### API Configuration

La URL base se configura en Settings del TPV:
- UI Path: `/settings`
- LocalStorage Key: `API_URL` (default: `http://localhost:3000/api`)

## 📡 Endpoints

### 🛍️ Products

#### GET `/api/products`
Obtener toda la lista de productos.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-001",
      "name": "Hamburguesa Clásica",
      "description": "Pan, carne molida, lechuga, tomate",
      "price": 8.99,
      "category": "Hamburguesas",
      "imageUrl": "https://...",
      "available": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Frontend Integration**:
```typescript
// En ProductService.getProducts()
this.apiService.get('/products').pipe(
  tap(response => {
    if (response.success) {
      this.products$.next(response.data);
    }
  })
).subscribe();
```

#### POST `/api/products`
Crear nuevo producto (solo backend admin).

**Request**:
```json
{
  "name": "Hamburguesa BBQ",
  "description": "Con salsa BBQ",
  "price": 9.99,
  "category": "Hamburguesas",
  "imageUrl": "https://...",
  "available": true
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "prod-002",
    ...
  }
}
```

---

### 📦 Orders

#### POST `/api/orders`
Crear nuevo pedido.

**Request**:
```json
{
  "items": [
    {
      "productId": "prod-001",
      "productName": "Hamburguesa Clásica",
      "quantity": 2,
      "price": 8.99,
      "subtotal": 17.98,
      "notes": "Sin cebolla"
    }
  ],
  "tableNumber": 5,
  "customNotes": "Cliente VIP",
  "total": 17.98,
  "paymentMethod": "cash",
  "tip": 0,
  "status": "pending",
  "date": "2024-01-15T14:30:00Z"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "order-550e8400-e29b-41d4-a716-446655440000",
    ...
  }
}
```

**Frontend Integration**:
```typescript
// En OrderService.completeOrder()
this.apiService.post('/orders', order).subscribe(
  response => {
    if (response.success) {
      // Actualizar historial local
    }
  }
);
```

#### GET `/api/orders`
Obtener todos los pedidos (con paginación si necesario).

**Query Parameters** (opcional):
- `page`: número de página (default: 1)
- `limit`: items por página (default: 50)
- `status`: filter por status ('pending', 'completed')

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "order-550e8400-...",
      "items": [...],
      "tableNumber": 5,
      "customNotes": "Cliente VIP",
      "total": 17.98,
      "paymentMethod": "cash",
      "status": "completed",
      "tip": 2.00,
      "date": "2024-01-15T14:30:00Z",
      "createdAt": "2024-01-15T14:30:00Z",
      "updatedAt": "2024-01-15T14:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

#### GET `/api/orders/:id`
Obtener un pedido específico.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-550e8400-...",
    ...
  }
}
```

#### PUT `/api/orders/:id`
Actualizar pedido (ej: cambiar cantidad, agregar items, editar post-cobro).

**Request**:
```json
{
  "items": [
    {
      "productId": "prod-001",
      "quantity": 3,
      ...
    }
  ],
  "tableNumber": 5,
  "total": 26.97,
  "status": "completed"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-550e8400-...",
    ...
  }
}
```

#### GET `/api/orders?date=2024-01-15`
Filtrar pedidos por fecha (QueryParam).

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { ...order1... },
    { ...order2... }
  ],
  "summary": {
    "totalOrders": 2,
    "totalSales": 35.96,
    "count": 2
  }
}
```

---

### 💰 Expenses

#### POST `/api/expenses`
Crear nuevo gasto.

**Request**:
```json
{
  "amount": 45.50,
  "description": "Compra de carne molida",
  "date": "2024-01-15T10:00:00Z"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "exp-001",
    "amount": 45.50,
    "description": "Compra de carne molida",
    "date": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:05:00Z"
  }
}
```

#### GET `/api/expenses`
Obtener todos los gastos.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "exp-001",
      "amount": 45.50,
      "description": "Compra de carne molida",
      "date": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T10:05:00Z"
    }
  ]
}
```

#### GET `/api/expenses?date=2024-01-15`
Filtrar gastos por fecha.

**Response**:
```json
{
  "success": true,
  "data": [
    { ...expense1... },
    { ...expense2... }
  ],
  "summary": {
    "totalExpenses": 145.50,
    "count": 3
  }
}
```

#### GET `/api/expenses?month=1&year=2024`
Filtrar gastos por mes/año.

**Response**:
```json
{
  "success": true,
  "data": [
    { ...expense... }
  ],
  "summary": {
    "totalExpenses": 2150.00,
    "count": 45,
    "month": 1,
    "year": 2024
  }
}
```

#### DELETE `/api/expenses/:id`
Eliminar un gasto.

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

#### PUT `/api/expenses/:id`
Actualizar un gasto.

**Request**:
```json
{
  "amount": 50.00,
  "description": "Compra de carne molida (actualizado)"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "exp-001",
    ...
  }
}
```

---

### 📊 Reports

#### GET `/api/reports/daily/:date`
Resumen diario (formato: `YYYY-MM-DD`).

**Example**: `GET /api/reports/daily/2024-01-15`

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalSales": 385.50,
    "totalExpenses": 145.50,
    "netProfit": 240.00,
    "orderCount": 12,
    "expenseCount": 8,
    "profitMargin": 62.27
  }
}
```

**Frontend Integration**:
```typescript
// En ReportsComponent.loadDailySummary()
this.apiService.get(`/reports/daily/${formattedDate}`).subscribe(
  response => {
    this.dailySummary = response.data;
  }
);
```

#### GET `/api/reports/monthly?year=2024&month=1`
Resumen mensual con desglose diario (opcional).

**Response**:
```json
{
  "success": true,
  "data": {
    "month": 1,
    "year": 2024,
    "totalSales": 8500.00,
    "totalExpenses": 3200.00,
    "netProfit": 5300.00,
    "orderCount": 280,
    "profitMargin": 62.35,
    "dailyBreakdown": [
      {
        "date": "2024-01-01",
        "totalSales": 245.00,
        "totalExpenses": 85.00,
        "netProfit": 160.00
      },
      ...
    ]
  }
}
```

---

---

## 🥘 Ingredientes & Customización

### Estructura de Ingredientes en Producto

```json
{
  "id": "prod-001",
  "name": "Hamburguesa Clásica",
  "description": "Pan, carne molida, lechuga, tomate",
  "price": 8.99,
  "category": "Hamburguesas",
  "imageUrl": "https://...",
  "available": true,
  "defaultIngredients": [
    "Pan",
    "Carne molida",
    "Lechuga",
    "Tomate",
    "Mayonesa"
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Estructura de Items en Orden (con customización)

```json
{
  "productId": "prod-001",
  "productName": "Hamburguesa Clásica",
  "quantity": 2,
  "price": 8.99,
  "subtotal": 17.98,
  "notes": "Sin cebolla, extra queso",
  "selectedIngredients": {
    "included": [
      "Pan",
      "Carne molida",
      "Lechuga",
      "Tomate",
      "Mayonesa"
    ],
    "additional": [
      "Queso extra",
      "Huevo"
    ]
  }
}
```

### Ingredientes Adicionales Disponibles

**Frontend usa esta lista** (almacenada localmente):
```typescript
export const ADDITIONAL_INGREDIENTS = [
  "Queso extra",
  "Huevo",
  "Bacon",
  "Guacamole",
  "Jalapeños",
  "Salsa BBQ",
  "Salsa Picante",
  "Cebolla caramelizada",
  "Champiñones",
  "Aceitunas"
];
```

---

## 🗄️ Database Schema

### Tabla: Products
```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  imageUrl VARCHAR(500),
  available BOOLEAN DEFAULT true,
  defaultIngredients JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**MongoDB equivalent**:
```javascript
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "available": 1 });
```

### Tabla: Orders
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  items JSON NOT NULL,
  tableNumber VARCHAR(50),
  isForTakeaway BOOLEAN DEFAULT false,
  customerName VARCHAR(255),
  customNotes TEXT,
  total DECIMAL(10, 2) NOT NULL,
  paymentMethod ENUM('cash', 'card'),
  status ENUM('active', 'closed', 'paid') DEFAULT 'active',
  tip DECIMAL(10, 2),
  date TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_date (date),
  INDEX idx_status (status),
  INDEX idx_tableNumber (tableNumber)
);
```

### Tabla: Expenses
```sql
CREATE TABLE expenses (
  id VARCHAR(50) PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(500) NOT NULL,
  date TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_date (date)
);
```

---

## 🛠️ Stack Técnico Recomendado

### Opción 1: Node.js + Express (Recomendado para rapidez)
```
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB / PostgreSQL
Auth: JWT Token
```

### Opción 2: Node.js + Fastify (Alto rendimiento)
```
Runtime: Node.js 18+
Framework: Fastify
Database: PostgreSQL
Auth: JWT Token
```

### Opción 3: Python + FastAPI (DataScience friendly)
```
Runtime: Python 3.10+
Framework: FastAPI
Database: PostgreSQL / MongoDB
Auth: JWT Token
```

---

## 🔐 Autenticación (Opcional pero Recomendado)

### POST `/api/auth/login`
Login con credenciales (para admin panel futuro).

**Request**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-001",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### Authorization Header
Todos los endpoints protegidos requieren:
```
Authorization: Bearer {token}
```

---

## 🔧 Configuración & Variables de Entorno

### `.env` (Backend)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/easytpv
# o para PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/easytpv

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:4200

# Logging
LOG_LEVEL=info
```

### CORS Configuration
```javascript
// Backend (Express example)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📝 Field Constraints & Validations

### Products
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| id | string | ✓ | Unique, format: `prod-XXX` |
| name | string | ✓ | 3-255 chars, no leading/trailing spaces |
| description | string | ✓ | 10-500 chars |
| price | decimal | ✓ | > 0, max 2 decimals |
| category | string | ✓ | Must exist in predefined list |
| imageUrl | string | ✓ | Valid URL format |
| available | boolean | - | Default: true |
| defaultIngredients | array | - | Array of non-empty strings |

### Orders
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| id | string | ✓ | Unique, UUID format |
| items | array | ✓ | Min 1 item |
| tableNumber | string | - | 1-100 chars OR null if takeaway |
| isForTakeaway | boolean | ✓ | Default: false |
| customerName | string | - | Null if table order, required if takeaway |
| total | decimal | ✓ | >= 0, max 2 decimals |
| paymentMethod | enum | - | 'cash' \| 'card' \| null |
| status | enum | ✓ | 'active' \| 'closed' \| 'paid' |
| tip | decimal | - | >= 0, max 2 decimals, null if not paid |

### Expenses
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| id | string | ✓ | Unique, format: `exp-XXX` |
| amount | decimal | ✓ | > 0, max 2 decimals |
| description | string | ✓ | 5-500 chars |
| date | timestamp | ✓ | ISO 8601 format |

---

## 🚀 Setup Local del Backend

### 1. Inicializar proyecto
```bash
mkdir easytpv-backend
cd easytpv-backend
npm init -y

# Instalar dependencias
npm install express cors dotenv
npm install --save-dev nodemon

# MongoDB driver o PostgreSQL
npm install mongodb
# o
npm install pg
```

### 2. Estructura de carpetas recomendada
```
easytpv-backend/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── expenseController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── expenses.js
│   │   └── reports.js
│   ├── database.js
│   └── app.js
├── tests/
├── .env
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

### 3. package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "lint": "eslint src/"
  }
}
```

### 4. Ejecutar localmente
```bash
npm run dev
# API disponible en http://localhost:3000
```

---

## 🧪 Testing con Postman/Thunder Client

### Collection Base URL
```
{{BASE_URL}} = http://localhost:3000/api
```

### Variables reutilizables
```
orderId = creado desde POST /orders
expenseId = creado desde POST /expenses
date = 2024-01-15
```

---

## 📊 Respuesta General de Reportes

### GET `/api/reports/summary?startDate=2024-01-01&endDate=2024-01-31`
Resumen completo del período.

**Response**:
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "days": 31
    },
    "sales": {
      "totalSales": 15500.00,
      "orderCount": 425,
      "averageOrderValue": 36.47,
      "paymentMethods": {
        "cash": 8200.00,
        "card": 7300.00
      }
    },
    "expenses": {
      "totalExpenses": 5200.00,
      "expenseCount": 87,
      "averageExpense": 59.77
    },
    "profit": {
      "netProfit": 10300.00,
      "profitMargin": 66.45
    }
  }
}
```

---

## 🔐 Error Handling

Todos los endpoints deben manejar errores estándar:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "price": "Price must be a positive number",
    "name": "Name must be between 3 and 255 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Missing or invalid token",
  "message": "Authorization header required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "id": "order-550e8400-...",
  "resource": "Order"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Database connection failed",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**Frontend Error Handling**:
```typescript
// En ApiService.interceptor
private handleError(error: HttpErrorResponse) {
  const apiError = error.error?.error || 'Unknown error';
  const details = error.error?.details || {};
  
  console.error(`[${error.status}] ${apiError}`, details);
  
  return throwError(() => ({
    success: false,
    error: apiError,
    details,
    status: error.status,
    timestamp: new Date()
  }));
}
```

---

## 🔄 Sync Strategy (Recomendado)

### Data Flow
```
Frontend (localStorage) 
  ↓ (on create/update/delete)
Backend API 
  ↓ (confirms)
Frontend (update local cache)
```

### Offline Fallback
```typescript
// Si API no disponible:
1. Guardar en localStorage
2. Enqueue en sync queue
3. Retry en background
4. Notificar usuario cuando sincronizado
```

---

## 📝 Sample Requests (cURL)

### Obtener todos los productos
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Content-Type: application/json"
```

### Crear producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hamburguesa BBQ",
    "description": "Con salsa BBQ premium",
    "price": 9.99,
    "category": "Hamburguesas",
    "imageUrl": "https://...",
    "available": true,
    "defaultIngredients": ["Pan", "Carne molida", "Salsa BBQ", "Cebolla"]
  }'
```

### Crear Pedido completo (con customización)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-001",
        "productName": "Hamburguesa Clásica",
        "quantity": 2,
        "price": 8.99,
        "subtotal": 17.98,
        "notes": "Sin cebolla",
        "selectedIngredients": {
          "included": ["Pan", "Carne molida", "Lechuga", "Tomate", "Mayonesa"],
          "additional": ["Queso extra"]
        }
      }
    ],
    "tableNumber": "5",
    "isForTakeaway": false,
    "total": 17.98,
    "paymentMethod": "cash",
    "status": "pending",
    "date": "2024-01-15T14:30:00Z"
  }'
```

### Obtener órdenes por fecha
```bash
curl -X GET "http://localhost:3000/api/orders?date=2024-01-15" \
  -H "Content-Type: application/json"
```

### Crear Gasto
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 45.50,
    "description": "Compra de carne molida 5kg",
    "date": "2024-01-15T10:00:00Z"
  }'
```

### Obtener Resumen Diario
```bash
curl -X GET http://localhost:3000/api/reports/daily/2024-01-15 \
  -H "Content-Type: application/json"
```

### Obtener Resumen Mensual
```bash
curl -X GET "http://localhost:3000/api/reports/monthly?year=2024&month=01" \
  -H "Content-Type: application/json"
```

### Obtener Resumen Completo (período)
```bash
curl -X GET "http://localhost:3000/api/reports/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Content-Type: application/json"
```

### Obtener Gasto específico
```bash
curl -X GET http://localhost:3000/api/expenses/exp-001 \
  -H "Content-Type: application/json"
```

### Actualizar Orden
```bash
curl -X PUT http://localhost:3000/api/orders/order-550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid",
    "paymentMethod": "card",
    "tip": 2.00
  }'
```

### Eliminar Gasto
```bash
curl -X DELETE http://localhost:3000/api/expenses/exp-001 \
  -H "Content-Type: application/json"
```

---

## 🧪 Testing Checklist

### Productos
- [ ] GET /api/products - Retorna lista de productos
- [ ] GET /api/products - Productos incluyen defaultIngredients
- [ ] POST /api/products - Crea producto con ingredientes
- [ ] POST /api/products - Valida que name esté entre 3-255 chars
- [ ] POST /api/products - Valida que price sea positivo

### Órdenes
- [ ] POST /api/orders - Crea orden y retorna ID
- [ ] POST /api/orders - Permite items con selectedIngredients
- [ ] POST /api/orders - Valida mínimo 1 item en orden
- [ ] POST /api/orders - Calcula total correctamente
- [ ] PUT /api/orders/:id - Actualiza orden existente
- [ ] PUT /api/orders/:id - Permite actualizar status y payment
- [ ] GET /api/orders - Retorna lista de órdenes
- [ ] GET /api/orders?date=... - Filtra por fecha exacta
- [ ] GET /api/orders/:id - Retorna orden específica

### Gastos
- [ ] POST /api/expenses - Crea gasto
- [ ] POST /api/expenses - Valida amount > 0
- [ ] GET /api/expenses - Retorna lista de gastos
- [ ] GET /api/expenses?date=... - Filtra por fecha
- [ ] GET /api/expenses?month=1&year=2024 - Filtra por mes/año
- [ ] PUT /api/expenses/:id - Actualiza gasto
- [ ] DELETE /api/expenses/:id - Elimina gasto
- [ ] GET /api/expenses/:id - Retorna gasto específico

### Reportes
- [ ] GET /api/reports/daily/... - Retorna resumen diario correcto
- [ ] GET /api/reports/daily/... - Calcula netProfit correctamente
- [ ] GET /api/reports/monthly - Retorna resumen mensual
- [ ] GET /api/reports/monthly - Incluye dailyBreakdown
- [ ] GET /api/reports/summary - Retorna período completo

### Error Handling
- [ ] POST sin datos requeridos retorna 400 con validation details
- [ ] GET orden inexistente retorna 404
- [ ] DELETE gasto inexistente retorna 404
- [ ] Todos los endpoints retornan success: true en OK
- [ ] Todos los endpoints retornan success: false en error

### Validaciones
- [ ] Product.price debe tener máximo 2 decimales
- [ ] Order.total debe tener máximo 2 decimales
- [ ] Expense.amount debe tener máximo 2 decimales
- [ ] No se puede crear orden para takeaway sin customerName
- [ ] No se puede crear orden para mesa con customerName
- [ ] Items.selectedIngredients.included debe respetar defaultIngredients
- [ ] Items.selectedIngredients.additional debe ser ingredientes válidos

---

## 📚 Frontend Integration Guide

Ver [DEVELOPMENT.md](./DEVELOPMENT.md#integración-con-backend) para instrucciones paso a paso.

### Configuración del URL en Frontend
El frontend permite cambiar la URL de la API desde la página de Settings:
- Path: `/settings`
- Key: `API_URL`
- Default: `http://localhost:3000/api`
- LocalStorage: `@storage.API_URL`

### Headers que el Frontend Envía
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Si se implementa auth
}
```

---

## ⚠️ Consideraciones Importantes

### 1. **Timestamps**
- Todos los timestamps deben ser en **ISO 8601 format** (UTC)
- Ejemplo: `2024-01-15T14:30:00Z`
- El frontend maneja conversión a zona horaria local

### 2. **Decimales en Moneda**
- Todos los precios/montos deben tener **máximo 2 decimales**
- Usar DECIMAL(10, 2) en SQL o number con validación en backend
- Evitar floating point issues

### 3. **IDs Únicos**
- Pueden ser UUID, ULID, o cadenas formateadas
- El frontend genera IDs localmente usando `Date.now() + random string`
- Backend debe validar que sean únicos

### 4. **Paginación**
- Implementar con query params: `?page=1&limit=50`
- Retornar siempre `pagination` object con `total`
- Útil para histórico de órdenes/gastos

### 5. **Filtros por Fecha**
- Formato obligatorio: `YYYY-MM-DD` para query params
- Backend debe parsear como inicio del día (00:00:00)
- Retornar todas las órdenes/gastos del día completo

### 6. **Status de Órdenes**
- `active`: Orden abierta, aún se pueden agregar items
- `closed`: Orden lista para pagar, no se pueden agregar items
- `paid`: Pago completado, histórico

### 7. **Transactionalidad**
- PUT /api/orders/:id debe ser atómico
- POST /api/orders debe ser atómico + retornar ID
- No debe haber órdenes parcialmente creadas

### 8. **Índices de Base de Datos**
Crear índices para optimizar:
```sql
CREATE INDEX idx_orders_date ON orders(date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tableNumber ON orders(tableNumber);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);
```

### 9. **Caching Recomendado**
- GET /api/products: cachear 5 minutos (raramente cambia)
- GET /api/reports/*: cachear 1 minuto
- POST/PUT/DELETE: invalidar caches relevantes

### 10. **Logging Recomendado**
```
[timestamp] [level] [endpoint] [status] [duration]
[2024-01-15T14:30:00Z] [INFO] POST /api/orders 201 45ms
[2024-01-15T14:30:01Z] [ERROR] GET /api/orders/invalid-id 404 5ms
```

---

## 🔗 Integración Paso a Paso

### Fase 1: Setup Backend
1. Crear proyecto base (Express, Fastify, Django, etc.)
2. Implementar estructura base de carpetas
3. Conectar base de datos
4. Crear modelos/schemas

### Fase 2: Endpoints CRUD Básicos
1. GET /api/products ✓
2. POST /api/orders ✓
3. GET /api/orders ✓
4. POST /api/expenses ✓
5. GET /api/expenses ✓

### Fase 3: Filtros y Reportes
1. GET /api/orders?date=...
2. GET /api/expenses?date=...
3. GET /api/reports/daily/:date
4. GET /api/reports/monthly

### Fase 4: Validaciones y Error Handling
1. Validar campos requeridos
2. Validar tipos y rangos
3. Retornar errores con formato consistent
4. Logging completo

### Fase 5: Despliegue
1. Configurar variables de entorno
2. Setup CORS correcto
3. Pruebas en producción
4. Monitoreo y logging

---

**API Version**: 1.0  
**Last Updated**: 2026-03-22  
**Status**: ✅ Listo para implementación backend
