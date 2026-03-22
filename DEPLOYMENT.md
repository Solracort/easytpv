# 🚀 Deployment & Git Guide

## 📦 Pre-Deployment Checklist

- [x] Build completado sin errores: `ng build --configuration production`
- [x] Documentación actualizada (README.md, DEVELOPMENT.md, API_SPECIFICATION.md)
- [x] localStorage mock data funcional
- [x] Lazy loading de módulos verificado
- [x] Responsive design validado
- [ ] (Backend) API endpoints implementados
- [ ] (Backend) CORS configurado
- [ ] Tests ejecutados (opcional para v1)

## 🔧 Setup Inicial Backend Team

### 1. Clonar Repositorio
```bash
git clone <repository-url>
cd easytpv
npm install
```

### 2. Iniciar Dev Server
```bash
ng serve --open
```
Navegará a `http://localhost:4200`

### 3. Build para Producción
```bash
ng build --configuration production
# Archivos en: dist/easytpv/
```

### 4. Servir Build Estático (test rápido)
```bash
npx http-server dist/easytpv/
```

## 📝 Commits Principales (Historia)

Para entender el desarrollo, ver commits:

```bash
# Ver historial
git log --oneline | head -20

# Ver cambios en archivo específico
git log -p src/app/features/orders/order-cart/order-cart.component.ts
```

## 🔀 Ramas Recomendadas

```bash
# Estructura de ramas
main/                          # Producción
├── develop/                   # Desarrollo
│   ├── feature/orders-api     # Features por módulo
│   ├── feature/auth           # Autenticación (si necesario)
│   └── fix/sync-issues        # Bug fixes
```

## 📤 Push a Repositorio

### Primera vez
```bash
git remote add origin https://github.com/tu-org/easytpv.git
git branch -M main
git push -u origin main
```

### Commits regulares
```bash
# Frontend estable
git add .
git commit -m "feat: modulo de reportes completado"
git push origin main
```

### Workflow para Backend Integration

```bash
# 1. Crear rama de backend
git checkout -b develop/api-integration
git pull origin main

# 2. Implementar endpoints
# (archivos modificados)

# 3. Commit
git add src/app/core/services/api.service.ts
git commit -m "feat: conectar ApiService a backend endpoints"

# 4. Push y PR
git push origin develop/api-integration
# Crear Pull Request en GitHub
```

## 🐳 Docker (Opcional)

### Dockerfile para Producción
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:1.21-alpine
COPY --from=builder /app/dist/easytpv /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build Docker
```bash
docker build -t easytpv:1.0 .
docker run -p 8080:80 easytpv:1.0
# Acceder: http://localhost:8080
```

## ☁️ Deployment Recomendado

### Opción 1: Firebase (Rápido)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Opción 2: Vercel (Simple)
```bash
npm i -g vercel
vercel
# Configurar build: `npm run build`
# Output: dist/easytpv
```

### Opción 3: Digital Ocean App Platform
```bash
# 1. Push a GitHub
# 2. Connect repo en app.digitalocean.com
# 3. Auto-deploy en push
```

### Opción 4: AWS S3 + CloudFront
```bash
# Build
ng build --configuration production

# Upload a S3
aws s3 sync dist/easytpv s3://my-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

## 🔒 Environment Variables

Crear `.env.production`:
```bash
# .env.production (no commitear)
NG_APP_API_BASE_URL=https://api.example.com
NG_APP_APP_NAME=EasyTPV Production
```

Usar en código:
```typescript
const apiUrl = process.env['NG_APP_API_BASE_URL'];
```

## 📊 Monitoreo

### Errores en Producción
Agregar Sentry:
```bash
npm install @sentry/angular
```

```typescript
// main.ts
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://your-sentry-dsn",
  environment: "production",
});
```

### Analytics
```typescript
// Agregar Google Analytics en index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## 🆘 Troubleshooting

### Build falla con "Module not found"
```bash
rm -rf .angular/cache node_modules
npm install
ng build
```

### API calls no funcionan
```bash
# 1. Verificar headers CORS en backend
# 2. Revisar console (F12)
# 3. Verificar URL en settings (/settings)
```

### localStorage lleno (quota exceeded)
```typescript
// Limpiar en settings
localStorage.clear()
```

## 📋 Documentación Complementaria

- [README.md](./README.md) - Visión general
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía técnica completa
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Spec de endpoints

## 🎯 Release Checklist (v1.0 → v1.1)

```bash
# 1. Actualizar version
npm version minor

# 2. Build
ng build --configuration production

# 3. Tag
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin --tags

# 4. Deploy
# (según tu plataforma)
```

## 📞 Support

Para issues:
1. Revisar [DEVELOPMENT.md](./DEVELOPMENT.md#-checklist-para-producción)
2. Verificar [API_SPECIFICATION.md](./API_SPECIFICATION.md)
3. Revisar console logs (F12 → Console)

---

**Documento**: Deployment Guide  
**Versión**: 1.0  
**Última actualización**: 2026-03-22
