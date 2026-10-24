---
name: nextjs-routing-navigation
description: Guía y procedimientos paso a paso para diseñar, estructurar e implementar rutas, layouts anidados, navegación modular descentralizada, RBAC y streaming con loading.tsx en Next.js 16 App Router bajo arquitectura hexagonal. Usar siempre que se creen nuevas páginas, se definan flujos de navegación o se protejan rutas con RBAC.
---

# Next.js 16 App Router — Guía de Procedimiento para Enrutamiento y Navegación Modular

Este skill define el procedimiento estandarizado paso a paso para crear, estructurar y dar de alta nuevas rutas en el frontend del SaaS Contable y POS (Squad 4), aplicando la **Arquitectura Hexagonal Modular por Funcionalidad (*Vertical Slicing*)**, el cascarón estructural bajo `src/shared/layouts/` y la **Navegación Modular Descentralizada con rendimiento $O(1)$**.

---

## 🎯 Protocolo de 4 Fases para Dar de Alta una Nueva Ruta

Toda nueva ruta debe implementarse siguiendo estrictamente este orden secuencial:

```
┌─────────────────────────────────┐
│ Fase 1: Componente en el Módulo │  src/modules/<feature>/ui/components/
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Fase 2: Contribución Modular    │  src/modules/<feature>/ui/<feature>.nav.ts
│         de Navegación           │  + Registro en src/shared/layouts/admin/nav/manifest.ts
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Fase 3: Matriz de Permisos RBAC │  src/shared/config/rbac-routes.ts
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Fase 4: Terna Física en App     │  src/app/(dashboard)/<ruta>/
│         (page, loading, error)  │  (Thin Page con requireRole + Skeleton CLS=0 + ErrorBoundary)
└─────────────────────────────────┘
```

---

## 🪜 Procedimiento Paso a Paso y Plantillas Oficiales

### Fase 1: Construir la Vista en el Módulo Funcional
Antes de crear la ruta en `src/app/`, el componente de la vista debe existir en `src/modules/<feature>/ui/components/`:

```tsx
// src/modules/branches/ui/components/branches-view.tsx
export function BranchesView() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
          Sucursales y Sedes Comerciales
        </h1>
        <p className="text-sm text-text-muted font-body mt-1">
          Gestione las ubicaciones físicas, puntos de venta y bodegas de su empresa.
        </p>
      </header>
      {/* Contenido interactivo, tablas o formularios */}
    </div>
  );
}
```

---

### Fase 2: Crear la Contribución de Navegación Modular

#### A. Definir el ítem dentro del módulo
Crear el archivo `src/modules/<feature>/ui/<feature>.nav.ts`:

```typescript
// src/modules/branches/ui/branches.nav.ts
import { Store } from "lucide-react";
import type { ModuleNavContribution } from "@/shared/layouts";

export const branchesNav: ModuleNavContribution = {
  sectionId: "administration", // "general" | "administration" | "operations" | "reports"
  order: 1,
  item: {
    id: "dashboard-branches",
    label: "Sucursales & Sedes",
    href: "/dashboard/branches",
    icon: Store,
    allowedRoles: ["OWNER", "ADMIN"], // ¡Compartido de forma inmediata!
    order: 1,
  },
};
```

#### B. Registrar en el Manifiesto Central
En `src/shared/layouts/admin/nav/manifest.ts`, añadir el módulo al array `ACTIVE_NAV_MODULES`:

```typescript
// src/shared/layouts/admin/nav/manifest.ts
import type { ModuleNavContribution } from "./types";
import { homeNav } from "./home.nav";
import { tenantsNav } from "@/modules/tenants/ui/tenants.nav";
import { branchesNav } from "@/modules/branches/ui/branches.nav"; // <- 1. Importar

export const ACTIVE_NAV_MODULES: ModuleNavContribution[] = [
  homeNav,
  tenantsNav,
  branchesNav, // <- 2. Registrar en una sola línea
];
```

---

### Fase 3: Registrar la Autorización RBAC en Servidor

En `src/shared/config/rbac-routes.ts`, registrar la regla en la matriz `ROUTE_PERMISSIONS`:

```typescript
// src/shared/config/rbac-routes.ts
export const ROUTE_PERMISSIONS: RoutePermissionRule[] = [
  // ... rutas previas
  {
    pathPrefix: "/dashboard/branches",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  // ...
];
```

---

### Fase 4: Crear la Terna de Robustez en `src/app/(dashboard)/<ruta>/`

#### A. `page.tsx` (Thin Page con `requireRole`)
Debe tener menos de 20 líneas y validar la sesión en el servidor:

```tsx
// src/app/(dashboard)/dashboard/branches/page.tsx
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { BranchesView } from "@/modules/branches/ui/components/branches-view";

export default async function BranchesPage() {
  // Validación estricta en servidor: si no tiene rol autorizado, redirige a /forbidden
  await requireRole(rolesFor("/dashboard/branches"), "/dashboard/branches");

  return (
    <main className="p-6 sm:p-8">
      <BranchesView />
    </main>
  );
}
```

#### B. `loading.tsx` (Skeleton con CLS = 0)
Mantiene exactamente las proporciones de la vista para evitar parpadeos:

```tsx
// src/app/(dashboard)/dashboard/branches/loading.tsx
export default function BranchesLoading() {
  return (
    <main
      role="status"
      aria-label="Cargando sucursales"
      className="p-6 sm:p-8 space-y-6 animate-pulse"
    >
      <span className="sr-only">Cargando información...</span>
      <div className="space-y-2">
        <div className="h-7 w-64 bg-subtle rounded-xl" />
        <div className="h-4 w-96 max-w-full bg-subtle rounded-lg" />
      </div>
      <div className="bg-surface border border-border-default rounded-2xl p-6 h-64" />
    </main>
  );
}
```

#### C. `error.tsx` (Error Boundary Accesible)
Client Component obligatorio con botón de reintento:

```tsx
// src/app/(dashboard)/dashboard/branches/error.tsx
"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BranchesError({ error, reset }: ErrorProps) {
  return (
    <main
      role="alert"
      className="p-6 sm:p-8 flex items-center justify-center min-h-[calc(100vh-10rem)]"
    >
      <div className="max-w-md w-full bg-surface border border-border-default rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text-primary">
            Inconveniente al cargar sucursales
          </h2>
          <p className="text-sm text-text-muted font-body">
            No fue posible procesar la información solicitada.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-default text-text-primary text-sm font-medium font-body hover:bg-subtle transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Panel
          </Link>
        </div>
      </div>
    </main>
  );
}
```

---

## 🧪 Checklist de Verificación para Cada Nueva Ruta

Antes de presentar o commitear una ruta, verificar obligatoriamente:
- [ ] ¿Existe el archivo `<feature>.nav.ts` y está registrado en `manifest.ts`?
- [ ] ¿La ruta está dada de alta en `ROUTE_PERMISSIONS` de `rbac-routes.ts`?
- [ ] ¿Los roles en `nav.ts` coinciden con los roles de `rbac-routes.ts`?
- [ ] ¿`page.tsx` es una Thin Page con menos de 20 líneas y consume `requireRole()`?
- [ ] ¿Cuenta con su correspondiente `loading.tsx` con `role="status"` y `animate-pulse`?
- [ ] ¿Cuenta con su correspondiente `error.tsx` con directiva `'use client'` y `reset()`?
- [ ] ¿TypeScript compila con cero errores (`pnpm tsc --noEmit`)?
- [ ] ¿ESLint valida limpio sobre `src/` (`pnpm eslint "src/**/*.{ts,tsx}"`)?
- [ ] ¿La navegación entre páginas ocurre sin pantalla en blanco ni errores 404?
