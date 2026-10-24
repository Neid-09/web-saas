---
description: Reglas obligatorias para la arquitectura, estructuración de rutas, navegación modular y control de acceso en Next.js 16 App Router.
globs:
  - src/app/**/*
  - src/shared/config/rbac-routes.ts
  - src/shared/layouts/**/*
  - src/modules/**/ui/*.nav.ts
alwaysApply: true
---

# Reglas Maestras de Enrutamiento, Navegación y RBAC — Next.js 16 App Router

Este documento define las directrices y estándares obligatorios de arquitectura para el enrutamiento, la navegación modular y el control de acceso en el frontend del SaaS Contable y POS (Squad 4).

---

## 1. Las 4 Leyes Mandatorias para Dar de Alta Rutas

### Ley 1: Cero Rutas Fantasma (Principio YAGNI Estricto)
* **PROHIBIDO TERMINANTEMENTE** registrar prefijos de ruta en `ROUTE_PERMISSIONS` o añadir enlaces en la navegación si la carpeta física en `src/app/` y su archivo `page.tsx` no existen.
* Toda ruta visible en el Sidebar o declarada en la matriz de seguridad debe ser 100% navegable en tiempo real y libre de errores 404.

### Ley 2: Terna Obligatoria de Robustez
Toda ruta en `src/app/(dashboard)/...` debe constar obligatoriamente de sus tres (3) archivos de resiliencia:
1. **`page.tsx` (Thin Page):** Server Component de menos de 20 líneas que valida la sesión y autorización en el servidor con `await requireRole(rolesFor('/ruta'), '/ruta')` y monta la vista del módulo.
2. **`loading.tsx` (Skeleton UI):** Estado de carga obligatorio con Skeleton accesible (`role="status"`, `animate-pulse`) que replique exactamente las dimensiones del lienzo para garantizar **CLS = 0**.
3. **`error.tsx` (Error Boundary):** Client Component (`'use client'`) con `role="alert"`, reporte descriptivo y botón accesible de reintento (`reset()`).

### Ley 3: Navegación Modular Descentralizada
* **PROHIBIDO** editar archivos monolíticos de datos para agregar botones al menú lateral.
* Cada módulo funcional es soberano de su navegación y debe exportar su contribución en `src/modules/<feature>/ui/<feature>.nav.ts` implementando el contrato `ModuleNavContribution`.
* El montaje se realiza exclusivamente en una sola línea dentro del array `ACTIVE_NAV_MODULES` en `src/shared/layouts/admin/nav/manifest.ts`.
* La resolución del menú en caliente debe mantenerse en **complejidad $O(1)$** mediante el caché en memoria de `src/shared/layouts/admin/nav/config.ts`.

### Ley 4: Sincronización Estricta de Seguridad (RBAC)
* Todo nuevo prefijo de ruta administrativa debe registrarse en la matriz `ROUTE_PERMISSIONS` de `src/shared/config/rbac-routes.ts` con sus roles permitidos (`allowedRoles`).
* Los roles permitidos en el archivo `<feature>.nav.ts` deben coincidir exactamente con los declarados en `ROUTE_PERMISSIONS`.

---

## 2. Convenciones de Importación y Enrutamiento Nativo
* **PROHIBIDO** instalar o importar `react-router`, `react-router-dom` o cualquier otro enrutador externo. Se usa exclusivamente el App Router nativo de Next.js 16 basado en el sistema de archivos (`src/app/`).
* **Navegación imperativa:** Importar `useRouter`, `usePathname`, `useSearchParams` exclusivamente desde `'next/navigation'`. (Prohibido `'next/router'`).
* **Enlaces declarativos:** Usar siempre el componente `<Link>` de `'next/link'`. Prohibido usar etiquetas `<a>` crudas para navegación interna (provocan recargas completas y destruyen el estado en memoria de Zustand).

---

## 3. Arquitectura Hexagonal y Thin Pages
* Los archivos `page.tsx` en `src/app/` actúan únicamente como adaptadores de entrada delgados del framework.
* **PROHIBIDO** colocar lógica de negocio compleja, llamadas a repositorios o estado interactivo directamente en `src/app/**/page.tsx`.
* Cada `page.tsx` delega inmediatamente en los componentes o vistas del módulo dentro de `src/modules/<feature>/ui/components/`.

---

## 4. Organización por Route Groups
Para separar las responsabilidades visuales y de layout sin afectar las URLs:
1. **`src/app/(auth)/`**: Flujo de inicio de sesión público y onboarding.
   - Layout minimalista centrado, sin barras laterales.
2. **`src/app/(dashboard)/`**: Panel administrativo y backoffice.
   - Envuelto por `AdminShell` desde `@/shared/layouts` con Topbar y Sidebar persistentes.
   - Soporta discriminación polimórfica en `/dashboard` según el rol autenticado.
3. **`src/app/(pos)/`**: Mostrador de venta rápida (<10s) para cajeros (`CASHIER`).
   - Layout a pantalla completa (Full Viewport) a 60 FPS, sin navegación externa ni sidebar administrativo.

---

## 5. Parámetros Asíncronos en Next.js 16 (`params` y `searchParams`)
En Next.js 16, `params` y `searchParams` en componentes de servidor son **Promesas asíncronas obligatorias**:
```tsx
// CORRECTO en Next.js 16
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeatureDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  return <FeatureDetailView id={id} query={query} />;
}
```
