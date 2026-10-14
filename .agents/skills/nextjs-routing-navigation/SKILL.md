---
name: nextjs-routing-navigation
description: Guía y procedimientos paso a paso para diseñar, estructurar e implementar rutas, layouts anidados, middleware de seguridad/RBAC, streaming con loading.tsx y optimización de prefetching en Next.js 15 App Router bajo arquitectura modular. Usar siempre que se creen nuevas páginas, se definan flujos de navegación, se configure el middleware de rutas o se optimice la carga entre vistas.
---

# Next.js 15 App Router — Guía de Enrutamiento, Navegación y RBAC Modular

Este skill proporciona el procedimiento estándar para diseñar, implementar y mantener la estructura de rutas, navegación y control de acceso en el frontend del SaaS Contable y POS (Squad 4), integrando el patrón de **Arquitectura Hexagonal Modular por Funcionalidad (*Vertical Slicing*)**.

---

## 1. Mapa de Rutas y Conexión con los Módulos de Dominio

En Next.js 15, `src/app/` actúa como un **Adaptador de Entrada Delgado**. Las páginas (`page.tsx`) son cascarones de menos de 20 líneas que delegan en sus respectivos módulos dentro de `src/modules/`:

```
src/app/
├── (auth)/                          # Rutas de autenticación y onboarding
│   ├── layout.tsx                   # Layout minimalista centrado
│   ├── login/
│   │   ├── page.tsx                 # Conecta con: @/modules/auth/components/login-view
│   │   └── loading.tsx              # Skeleton de login
│   └── onboarding/
│       └── branch/
│           ├── page.tsx             # Conecta con: @/modules/branches/components/first-branch-onboarding
│           └── loading.tsx
│
├── (dashboard)/                     # Panel administrativo y backoffice
│   ├── layout.tsx                   # Layout persistente con Sidebar + Topbar
│   ├── page.tsx                     # Resumen / Dashboard general
│   ├── team/
│   │   ├── page.tsx                 # Conecta con: @/modules/users/components/users-management-view
│   │   ├── loading.tsx              # Skeleton de la tabla de usuarios
│   │   └── error.tsx                # Error boundary con botón de reintento
│   ├── branches/
│   │   ├── page.tsx                 # Conecta con: @/modules/branches/components/branches-view
│   │   └── loading.tsx
│   └── company/
│       ├── page.tsx                 # Conecta con: @/modules/company/components/company-settings-view
│       └── loading.tsx
│
├── (pos)/                           # Mostrador de venta rápida (<10s)
│   ├── layout.tsx                   # Layout a pantalla completa (Full Viewport) a 60 FPS
│   └── pos/
│       ├── page.tsx                 # Conecta con: @/modules/pos/components/pos-terminal-view
│       └── loading.tsx              # Skeleton del mostrador
│
├── api/                             # Route Handlers (BFF hacia microservicios)
│   └── auth/
│       ├── login/route.ts           # Proxy que guarda cookies HttpOnly
│       └── logout/route.ts          # Limpieza de cookies de sesión
│
├── not-found.tsx                    # Vista global 404
├── error.tsx                        # Error boundary global
├── layout.tsx                       # Root Layout con fuentes y proveedores
└── middleware.ts                    # Guardia de seguridad RBAC en Edge
```

---

## 2. Procedimiento Paso a Paso para Crear una Nueva Ruta

### Paso 1: Construir la Vista en su Módulo de Dominio
Antes de crear la ruta en `src/app/`, construir el componente y su lógica dentro de `src/modules/<feature>/components/`:

```tsx
// src/modules/users/components/users-management-view.tsx
'use client';

import { UsersTable } from './users-table';
import { UserFormModal } from './user-form-modal';
import { useUsers } from '../application/use-users';

export function UsersManagementView() {
  const { users, isLoading, error } = useUsers();

  return (
    <div className="space-y-6 p-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Personal y Colaboradores
          </h1>
          <p className="text-sm text-slate-500">
            Administre la nómina, asigne roles y controle el acceso por sucursal.
          </p>
        </div>
        <UserFormModal />
      </header>

      <UsersTable users={users} isLoading={isLoading} />
    </div>
  );
}
```

### Paso 2: Crear el Cascarón Delgado en `src/app/` (`page.tsx`)
El archivo de ruta simplemente define metadatos y monta la vista del módulo:

```tsx
// src/app/(dashboard)/team/page.tsx
import { UsersManagementView } from '@/modules/users/components/users-management-view';

export const metadata = {
  title: 'Gestión de Personal | SaaS Contable',
  description: 'Directorio de colaboradores y roles de la empresa',
};

export default function TeamPage() {
  return <UsersManagementView />;
}
```

### Paso 3: Crear `loading.tsx` (Skeleton Obligatorio)
Next.js envolverá automáticamente la página en un `<Suspense>` mostrando este esqueleto mientras el cliente o servidor resuelven los datos:

```tsx
// src/app/(dashboard)/team/loading.tsx
import { Skeleton } from '@/shared/components/skeleton';

export default function TeamLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="rounded-md border border-slate-200 p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
```

### Paso 4: Crear `error.tsx` (Error Boundary con Reintento)
Debe ser obligatoriamente un Client Component (`'use client'`):

```tsx
// src/app/(dashboard)/team/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/button';

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error cargando módulo de usuarios:', error);
  }, [error]);

  return (
    <div className="flex h-96 flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-lg font-semibold text-slate-900">
        No se pudo cargar el listado de personal
      </h2>
      <p className="max-w-md text-sm text-slate-500">
        Ocurrió una falla de conexión con el servicio de autenticación. Verifique su red e intente nuevamente.
      </p>
      <Button onClick={() => reset()} variant="outline">
        Reintentar carga
      </Button>
    </div>
  );
}
```

---

## 3. Manejo de Parámetros Dinámicos en Next.js 15 (`[id]`)

En Next.js 15, `params` y `searchParams` se resuelven de forma **asíncrona** en Server Components:

```tsx
// src/app/(dashboard)/team/[id]/page.tsx
import { UserDetailView } from '@/modules/users/components/user-detail-view';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailView userId={id} />;
}
```

---

## 4. Implementación del Middleware RBAC (`middleware.ts`)

El guardia centralizado que controla la navegación según los roles del token JWT:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // 1. Redirección si no está autenticado
  if (!token && !PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirección si ya está autenticado e intenta ir a login
  if (token && PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const payload = decodeJwtPayload(token);
    if (payload?.role === 'CASHIER') {
      return NextResponse.redirect(new URL('/pos', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Reglas de Control de Acceso por Rol (RBAC)
  if (token) {
    const payload = decodeJwtPayload(token);
    const role = payload?.role;

    // Regla 1: CASHIER solo puede operar en /pos
    if (role === 'CASHIER' && !pathname.startsWith('/pos')) {
      return NextResponse.redirect(new URL('/pos', request.url));
    }

    // Regla 2: Administradores no emiten en mostrador (van a su dashboard)
    if ((role === 'OWNER' || role === 'ADMIN') && pathname === '/pos') {
      // Si se desea modo arqueo, permitir; sino redirigir al dashboard:
      // return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|audio/|.*\\..*).*)'],
};

function decodeJwtPayload(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    return JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}
```

---

## 5. Patrones de Navegación y Rendimiento

### A. Navegación Declarativa con Prefetch Selectivo
```tsx
import Link from 'next/link';

// Enlaces normales: prefetch activado por defecto
<Link href="/dashboard/team">Personal</Link>

// En tablas con más de 20 registros: prefetch desactivado para no saturar la red
<Link href={`/dashboard/invoices/${item.id}`} prefetch={false}>
  Factura #{item.consecutive}
</Link>
```

### B. Filtros en URL sin Reinicio de Scroll
```tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserRoleFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    params.set('page', '1');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ...
}
```

---

## 6. Checklist de Verificación para Cada Ruta

- [ ] ¿La lógica reside en `src/modules/<feature>/` y `page.tsx` es solo un cascarón delgado?
- [ ] ¿Los componentes del módulo se encuentran dentro de `components/` (no `ui/`)?
- [ ] ¿Los imports provienen de `'next/navigation'` y `'next/link'`?
- [ ] ¿Si la página recibe `params`, se manejan como `Promise` con `await params` (Next.js 15)?
- [ ] ¿Cuenta con su correspondiente `loading.tsx` con Skeleton accesible?
- [ ] ¿Cuenta con su correspondiente `error.tsx` con botón de reintento?
- [ ] ¿La ruta está validada en `middleware.ts` según el rol requerido?
