---
description: Reglas obligatorias para la arquitectura, estructuración de rutas, navegación y control de acceso en Next.js 15 App Router.
globs:
  - src/app/**/*
  - src/middleware.ts
  - middleware.ts
  - src/modules/**/components/**/*
alwaysApply: true
---

# Reglas de Enrutamiento y Navegación — Next.js 15 App Router

Este documento define las directrices y estándares obligatorios de arquitectura para el enrutamiento y la navegación en el frontend del SaaS Contable y POS (Squad 4).

---

## 1. Prohibición Estricta de Librerías Externas de Enrutamiento
- **PROHIBIDO** instalar o importar `react-router`, `react-router-dom` o cualquier otro enrutador externo.
- Todo el enrutamiento debe ser gestionado **exclusivamente por el App Router nativo de Next.js 15** basado en el sistema de archivos (`src/app/`).

---

## 2. Convenciones de Importación
- **Navegación imperativa:** Importar `useRouter`, `usePathname`, `useSearchParams` exclusivamente desde `'next/navigation'`.
  ```typescript
  // CORRECTO
  import { useRouter, usePathname, useSearchParams } from 'next/navigation';

  // PROHIBIDO (pertenece al Pages Router obsoleto)
  import { useRouter } from 'next/router';
  ```
- **Enlaces declarativos:** Usar siempre el componente `<Link>` de `'next/link'`.
  ```typescript
  import Link from 'next/link';
  ```
  Evitar el uso de etiquetas `<a>` crudas para navegación interna, ya que provocan recargas completas de página (Full Page Reload) y destruyen el estado en memoria de Zustand.

---

## 3. Integración con Arquitectura Modular: Páginas Delgadas (*Thin Pages*)
- Los archivos `page.tsx` en `src/app/` son **adaptadores de entrada delgados**.
- **PROHIBIDO** colocar lógica de negocio compleja, estado de Zustand o tablas extensas directamente en `src/app/**/page.tsx`.
- Cada `page.tsx` debe delegar inmediatamente en el componente de vista principal del módulo correspondiente dentro de `src/modules/<feature>/ui/components/`:
  ```tsx
  // src/app/(dashboard)/team/page.tsx
  import { UsersManagementView } from '@/modules/users/ui/components/users-management-view';

  export const metadata = { title: 'Personal y Colaboradores | Admin' };

  export default function TeamPage() {
    return <UsersManagementView />;
  }
  ```

---

## 4. Organización por Route Groups (Grupos de Rutas)
Para separar las responsabilidades visuales y de layout sin afectar la estructura de las URLs, el proyecto se divide en:

1. **`src/app/(auth)/`**: Flujo de inicio de sesión público y onboarding.
   - Layout minimalista centrado, sin barras laterales ni distracciones.
   - Rutas: `/login`, `/onboarding/branch`.
2. **`src/app/(dashboard)/`**: Panel administrativo y backoffice (`OWNER`, `ADMIN`, `ACCOUNTANT`, `WAREHOUSE_MANAGER`).
   - Layout persistente con Sidebar lateral, Topbar con datos del tenant y avatar de sesión.
   - Rutas: `/dashboard`, `/dashboard/team`, `/dashboard/branches`, `/dashboard/company`, `/dashboard/inventory`.
3. **`src/app/(pos)/`**: Mostrador de venta rápida (<10s) para cajeros (`CASHIER`).
   - Layout a pantalla completa (Full Viewport) a 60 FPS, sin navegación externa.
   - Rutas: `/pos`.

---

## 5. Convención de Archivos Especiales y Jerarquía de Robustez
Toda ruta funcional debe contener la combinación requerida para cumplir con los estándares de robustez:
- **`layout.tsx`**: Envoltura persistente de interfaz compartida. No se re-renderiza al navegar entre rutas hermanas.
- **`page.tsx`**: Contenido de la ruta.
- **`loading.tsx`**: Estado de carga obligatorio con Skeleton UI renderizado vía React Suspense nativo.
- **`error.tsx`**: Error Boundary obligatorio con directiva `'use client'` y función de reintento (`reset()`).
- **`not-found.tsx`**: Vista personalizada para recursos o rutas inexistentes (404).

---

## 6. Manejo de Modales en el Enrutamiento
- **Modales de Operación Rápida (En Memoria):**
  - Modales como Búsqueda rápida de producto (`F2`) y Cobro (`F9`/`F10`) en el POS se controlan mediante estado en memoria/Zustand dentro de `src/modules/pos/components/`. **No cambian la URL** para asegurar latencias inferiores a 16 ms.
- **Modales de Detalle Administrativo (Intercepted Routes):**
  - Si un modal requiere URL compartible o navegación atrás/adelante en el historial (ej: ver ficha de auditoría de un usuario), se implementa mediante la convención de rutas interceptadas de Next.js: `src/app/(dashboard)/team/(.)[id]/page.tsx`.

---

## 7. Parámetros Asíncronos en Next.js 15 (`params` y `searchParams`)
En Next.js 15, `params` y `searchParams` en componentes de servidor son **Promesas**:
```tsx
// CORRECTO en Next.js 15
export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailView userId={id} />;
}
```

---

## 8. Middleware y Protección RBAC de Rutas (`middleware.ts`)
- El control de acceso, redirección por roles y verificación de sesión debe realizarse en `middleware.ts` en la raíz del proyecto.
- **Reglas del guardia:**
  1. Si la ruta es protegida y no existe cookie `accessToken` $\rightarrow$ Redirigir a `/login`.
  2. Si el usuario tiene rol `CASHIER` e intenta acceder a `/dashboard/*` $\rightarrow$ Redirigir inmediatamente a `/pos`.
  3. Si el usuario tiene rol `OWNER` o `ADMIN` e intenta emitir en `/pos` $\rightarrow$ Redirigir a `/dashboard` o mostrar solo modo arqueo/supervisión.
  4. Si el usuario ya está autenticado e intenta acceder a `/login` $\rightarrow$ Redirigir a su ruta por defecto (`/pos` o `/dashboard`).

---

## 9. Rendimiento y Optimización de Navegación
- **Prefetching inteligente:**
  - El prefetching está habilitado por defecto en `<Link>`.
  - En tablas masivas o listados largos (catálogo de más de 20 productos o facturas), **desactivar explícitamente el prefetch** con `prefetch={false}` para evitar congestión de red.
- **Sincronización de filtros y búsqueda:**
  - Utilizar `useSearchParams()` en conjunto con `window.history.pushState` o `router.replace(..., { scroll: false })` para paginación y filtros en tiempo real sin reiniciar el scroll ni disparar parpadeos en pantalla.
