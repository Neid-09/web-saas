---
description: Reglas obligatorias para la obtención de datos (Data Fetching), streaming, manejo de cache, idempotencia, resiliencia y clientes HTTP en Next.js 16 App Router bajo arquitectura hexagonal.
globs: "src/shared/http/**/*, src/modules/**/infrastructure/**/*, src/modules/**/application/**/*, src/app/**/*"
alwaysApply: true
---

# Reglas de Obtención de Datos (Data Fetching) y Streaming — Squad 4

Este documento establece las directrices y estándares obligatorios para la comunicación con APIs externas (especialmente Squad 1 `:3001` y microservicios), el consumo de datos, streaming y manejo de fallos en el SaaS Contable y POS (Next.js 16.4.0).

---

## 1. Reglas Sagradas de Infraestructura HTTP

1. **PROHIBIDO Axios o librerías HTTP pesadas:**
   - Queda terminantemente prohibido instalar o importar `axios`, `superagent`, `got` o `request`.
   - Toda llamada HTTP debe utilizar la **Web Fetch API nativa** de JavaScript o el cliente unificado tipado en `src/shared/http/http-client.ts`.

2. **Aislamiento Hexagonal (Cero `fetch` en componentes visuales y hooks):**
   - **PROHIBIDO** escribir llamadas directas a `fetch()`, instanciar URLs (`/api/...`) o escribir funciones de consulta (ej. `fetchUsersFromBff`) dentro de archivos de componentes (`ui/components/*.tsx`), hooks (`ui/hooks/*.ts`) o páginas (`app/**/page.tsx`).
   - Toda llamada HTTP —tanto la comunicación servidor a servidor contra microservicios como las peticiones cliente hacia el BFF local (`/api/...`)— reside **exclusivamente en la capa de Infraestructura del Módulo** (`src/modules/<feature>/infrastructure/bff-<feature>.client.ts` o `http-<feature>.repository.ts`).
   - Los custom hooks de `ui/hooks/` **solo orquestan el ciclo de vida** (TanStack Query, Zustand, RHF) delegando la ejecución en clientes de infraestructura o Server Actions.

3. **Mocks de Contingencia y Pruebas por Módulo:**
   - Cada adaptador HTTP en `infrastructure/` implementa una interfaz puerto de dominio (`*Repository`) y debe contar con una implementación mock en memoria (`InMemory*Repository`).
   - Si la API externa está caída o en desarrollo, el `composition.ts` puede conmutar a los datos mock sin modificar los componentes de UI ni los casos de uso.

---

## 2. La Tríada de Ejecución: Server Components, Client Components y Server Actions

Next.js 16 App Router separa estrictamente las responsabilidades según el entorno de ejecución:

### A. Data Fetching en Server Components (Por Defecto)
Se utiliza para la carga inicial de páginas administrativas (`/usuarios`, `/sucursales`, `/empresa`):
* **Firma asíncrona:** La función de página o layout debe ser `async function`.
* **Seguridad:** Los tokens internos, credenciales de backend y URLs de microservicios permanecen en el servidor y nunca se exponen al bundle del navegador.
* **Memoización y Deduplicación:** Next.js memoiza llamadas idénticas a `fetch()` en el mismo árbol de renderizado.
* **Consumo Hexagonal:** Llama directamente a los casos de uso a través de `infrastructure/composition.ts`.
* **Deduplicación sin fetch:** Si una consulta no usa `fetch` (ej. llamadas a base de datos o utilidades internas), debe envolverse con `React.cache()`.

```tsx
// CORRECTO: src/app/(dashboard)/usuarios/page.tsx (Server Component delgado)
import { userUseCases } from '@/modules/users/infrastructure/composition';

export default async function UsersPage() {
  const users = await userUseCases.getUsers({ isActive: true });
  return <UsersManagementView initialUsers={users} />;
}
```

### B. Interactividad y Reactividad en Client Components (`'use client'`)
Se utiliza para operaciones interactivas, modales, formularios reactivos y el mostrador de ventas POS:
* **PROHIBIDO** definir componentes clientes como `async function`.
* Para escuchar teclado físico (`F1` a `F12`), eventos de input (`onChange`, `onSubmit`) o estado en memoria RAM, utilizar **Zustand** o hooks de React dentro de `ui/hooks/`.
* Para leer promesas iniciadas en el servidor, usar la API nativa **`use(promise)` de React 19** envuelta en un límite de `<Suspense>`.
* Para mutaciones, disparar Server Actions o mutaciones de TanStack Query desde manejadores de eventos.

### C. Mutaciones Transaccionales con Server Actions (`'use server'`)
Son el estándar obligatorio para toda operación mutacional que involucre persistencia, sesión o cambios de estado:
* **Ubicación:** Se definen en `src/app/<ruta>/actions.ts` con la directiva `'use server'`.
* **Validación en el Servidor:** Todo argumento recibido debe validarse estrictamente con Zod antes de delegar a la capa de aplicación.
* **Gestión Segura de Cookies:** Exclusivo para emitir cookies de sesión con flags `httpOnly: true, secure: true, sameSite: 'lax'` usando `cookies()` de `next/headers` (imposibles de vulnerar vía XSS en el cliente).
* **Aislamiento de Infraestructura:** Solo las Server Actions (y Server Components) importan desde `infrastructure/composition.ts`, permitiendo proteger la infraestructura con `import "server-only"`.
* **Revalidación Automática:** Permiten invocar `revalidatePath('/ruta')` para refrescar los datos del servidor sin recargar toda la ventana.

```tsx
// CORRECTO: src/app/(dashboard)/usuarios/actions.ts (Server Action)
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { userUseCases } from '@/modules/users/infrastructure/composition';

const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'CASHIER', 'WAREHOUSE_MANAGER']),
});

export async function createUserAction(rawInput: unknown) {
  const data = createUserSchema.parse(rawInput); // 1. Valida en servidor
  const user = await userUseCases.createUser(data); // 2. Delega al caso de uso
  revalidatePath('/dashboard/team');              // 3. Revalida la ruta
  return { success: true, user };
}
```

---

## 3. Streaming y Estados de Carga (Cero Bloqueo de UI)

Ninguna vista debe congelar la pantalla o mostrar una página blanca mientras espera respuesta del servidor:

1. **`loading.tsx` Obligatorio por Ruta:**
   - Toda carpeta funcional en `src/app/(dashboard)/*` debe incluir un archivo `loading.tsx` que renderice un **Skeleton UI** con las dimensiones exactas de la tabla o tarjeta final.
2. **Streaming Granular con `<Suspense>`:**
   - Si una página combina datos rápidos (estadísticas) con datos lentos o pesados (auditoría), la sección lenta debe envolverse en su propio `<Suspense fallback={<TableSkeleton />}>`.
   - El contenido rápido se envía inmediatamente al cliente; los datos lentos se transmiten progresivamente por streaming HTTP sin demorar la navegación.

---

## 4. Prevención de Cascadas (No Waterfalls) y Paralelismo

* **PROHIBIDO** encadenar múltiples `await` independientes de forma secuencial:
  ```ts
  // ❌ INCORRECTO: Genera lentitud acumulativa (Waterfall)
  const user = await getUser(id);
  const branches = await getBranches();
  ```

* **OBLIGATORIO** iniciar las promesas simultáneamente y resolverlas en paralelo con `Promise.all` o `Promise.allSettled`:
  ```ts
  // ✅ CORRECTO: Ambas peticiones viajan en paralelo
  const userPromise = getUser(id);
  const branchesPromise = getBranches();

  const [user, branches] = await Promise.all([userPromise, branchesPromise]);
  ```

* **Preloading en Rutas Críticas:**
  - En vistas de alta prioridad, invocar la función de fetch sin `await` al inicio del ciclo para que la red trabaje mientras se ejecutan validaciones previas.

---

## 5. Idempotencia y Normas Financieras

1. **Cabecera `X-Idempotency-Key` Obligatoria:**
   - Toda petición mutacional (`POST`, `PUT`, `PATCH`, `DELETE`), especialmente en ventas del POS, creación de clientes fiados y ajustes de stock, **DEBE** inyectar un UUIDv4 único en la cabecera `X-Idempotency-Key`.
   - Esto evita transacciones duplicadas o dobles cobros si la red se corta y el usuario reintenta la operación.

2. **Timeout Estricto con `AbortController`:**
   - Las peticiones del mostrador POS deben abortar a los **3 segundos** si el servidor no responde, pasando inmediatamente al modo de contingencia.
   - Las consultas administrativas del dashboard tienen un timeout máximo de **8 segundos**.

---

## 6. Intercepción y Manejo Estandarizado de Errores

El cliente unificado `src/shared/http/http-client.ts` debe interceptar las respuestas y aplicar la siguiente matriz de acción:

| Código HTTP | Significado | Acción del Interceptor |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | Token expirado, revocado (`jti` en Redis) o inválido | Limpiar cookie/sesión y redirigir inmediatamente a `/login?reason=session_expired`. |
| **`403 Forbidden`** | Rol insuficiente (RBAC) o intento de cruzar a otro Tenant | Lanzar `ForbiddenError`. Si es navegación de ruta, redirigir a `/forbidden`. |
| **`404 Not Found`** | Endpoint o entidad inexistente | Lanzar `NotFoundError`. En Server Components invocar `notFound()` de Next.js. |
| **`400 / 422 Bad Request`** | Error de validación de formulario (DTO) | Retornar lista de errores tipada `{ field: string, message: string }[]` para que la UI resalte los inputs correspondientes. |
| **`500+ / Fetch Failed`** | Servidor caído, microservicio no disponible | Lanzar `ServiceUnavailableError`. Activar fallback determinista de `mocks/`. |

---

## 7. Integración Oficial de TanStack Query (Estado Asíncrono en Cliente)

Para balancear el rendimiento de los Server Components con la interactividad y velocidad exigidas en el Backoffice y el POS (< 10s), el proyecto adopta **TanStack Query (React Query v5)** como el gestor oficial de caché y estado asíncrono en el cliente.

### A. Dónde es OBLIGATORIO usar TanStack Query
1. **Tablas Dinámicas con Filtros y Paginación (`/usuarios`, `/sucursales`):**
   - Consumo mediante `useQuery` con `placeholderData: keepPreviousData`.
   - Permite alternar entre páginas ya visitadas con **0 ms de latencia** y previene parpadeos al escribir en barras de búsqueda en tiempo real.
2. **Mutaciones con Interfaz Optimista (`useMutation`):**
   - Acciones inmediatas como el switch de activación de usuario (`PATCH /users/:id/status`) o cambio de rol deben actualizar la UI en **0 ms** (`onMutate`) y revertir automáticamente ante fallos (`onError`).
3. **Catálogo y Búsqueda en Mostrador POS (`[F2] Catálogo < 10s`):**
   - Búsqueda de productos en mostrador con `staleTime: 5 * 60 * 1000` (5 minutos) para responder consultas recurrentes desde la memoria RAM del navegador en menos de 5 ms.
4. **Invalidación y Sincronización entre Modales y Vistas:**
   - Tras crear o editar una entidad en un modal, la mutación debe invalidar la clave correspondiente (`queryClient.invalidateQueries({ queryKey: [...] })`) para actualizar la tabla sin recargar la página.

### B. Dónde queda PROHIBIDO TanStack Query (Usar Next.js Nativo)
1. **Flujo de Login y Sesión Inicial (`/login`):** Petición directa con cookies seguras.
2. **Perímetro de Seguridad en Edge (`src/middleware.ts`):** Verificación directa de JWT sin librerías de cliente.
3. **Páginas puramente estáticas o de solo lectura:** Mantener como Server Components puros para no agregar JavaScript innecesario.

### C. El Patrón Híbrido Oficial (Server Prefetch + Client Hydration)
Las vistas del Dashboard cargan inicialmente en el servidor y transfieren su estado a TanStack Query mediante hidratación:

```tsx
// src/app/(dashboard)/usuarios/page.tsx (Server Component delgado)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userUseCases } from '@/modules/users/infrastructure/composition';
import { UsersManagementView } from '@/modules/users/ui/components/users-management-view';

export default async function UsersPage() {
  const queryClient = new QueryClient();

  // 1. Prefetch en el servidor antes del render delegando en el caso de uso
  await queryClient.prefetchQuery({
    queryKey: ['users', { isActive: true }],
    queryFn: () => userUseCases.getUsers({ isActive: true }),
  });

  // 2. Hidratación inmediata en el cliente (0ms de carga inicial)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersManagementView />
    </HydrationBoundary>
  );
}
```

### D. Convención Estricta de `queryKey`
Las claves de consulta deben estructurarse jerárquicamente como arreglos tipados dentro de la capa `application/`:
* `['users']`: Todos los usuarios.
* `['users', { branchId, role, isActive }]`: Usuarios con filtros específicos.
* `['users', userId]`: Detalle individual de un usuario.
* `['branches']`: Listado de sedes.
* `['tenants', 'current']`: Configuración de la empresa actual.

### E. Sinergia TanStack Query (`useMutation`) + Server Actions
El patrón oficial para mutaciones en el cliente combina la seguridad en el servidor de las **Server Actions** con la fluidez y reactividad en el cliente de **TanStack Query**:

1. **La Server Action ejecuta la mutación segura:** Corre en el servidor, valida con Zod y contacta al microservicio.
2. **`useMutation` orquesta el ciclo de vida en la UI:** Maneja estados `isPending`, spinners, errores accesibles y optimismo.
3. **Invalidación selectiva en memoria:** Tras el éxito, `onSuccess` invalida la `queryKey` correspondiente (`queryClient.invalidateQueries({ queryKey: [...] })`), haciendo que la tabla o vista se actualice automáticamente sin recargas completas de ventana.

```tsx
// ui/hooks/use-create-user.ts (Client Hook)
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserAction } from '@/app/(dashboard)/usuarios/actions';

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUserAction, // 👈 Invoca la Server Action segura
    onSuccess: () => {
      // 👈 Invalida la caché en RAM para refrescar la tabla al instante
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createUser: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
```

### F. Consumo del BFF desde TanStack Query (Delegación Estricta a Infraestructura)
Cuando se consume un Route Handler BFF (`/api/...`) en el cliente, la función que ejecuta `fetch()` **NO DEBE** escribirse dentro del hook. Debe encapsularse como una función asíncrona independiente en la capa de **Infraestructura** para maximizar el Tree-Shaking:

#### 1. Cliente BFF en Infraestructura (`src/modules/<feature>/infrastructure/<feature>.client.ts`):
```typescript
// infrastructure/users.client.ts
import { User } from '../domain/user.types';

export interface UsersQueryParams {
  role?: string;
  search?: string;
}

export async function getUsers(params: UsersQueryParams): Promise<User[]> {
  const query = new URLSearchParams();
  if (params.role) query.set('role', params.role);
  if (params.search) query.set('search', params.search);

  // El navegador inyecta automáticamente la cookie HttpOnly en same-origin
  const res = await fetch(`/api/users?${query.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login?reason=session_expired';
    }
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    throw new Error('Error al obtener la lista de usuarios desde BFF');
  }

  return res.json();
}
```

#### 2. Custom Hook en UI (`src/modules/<feature>/ui/hooks/use-users-query.ts`):
El hook queda 100% limpio de llamadas de red directas y URLs:
```typescript
// ui/hooks/use-users-query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers, UsersQueryParams } from '../../infrastructure/users.client';

export function useUsersQuery(params: UsersQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params), // 👈 Función directa de infraestructura
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}
```


