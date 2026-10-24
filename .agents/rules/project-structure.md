---
description: Reglas obligatorias para la estructura de carpetas, arquitectura hexagonal modular (Vertical Slicing) y separación estricta de responsabilidades en el frontend.
globs: "src/**/*, package.json, tsconfig.json"
alwaysApply: true
---

# Reglas de Estructura de Proyecto y Arquitectura Modular — Squad 4

Este documento establece el estándar obligatorio de organización de archivos, empaquetado por módulos de dominio (*Package by Feature / Vertical Slicing*) y arquitectura hexagonal estricta en el frontend Next.js 16 (React 19).

---

## 1. Filosofía Arquitectónica: Hexagonal Modular por Funcionalidad

- **PROHIBIDO** el empaquetado puramente horizontal en la raíz (ej. una única carpeta global `domain/`, `application/` o `infrastructure/` que mezcle todos los archivos del sistema).
- El sistema se divide verticalmente en **Módulos de Dominio autocontenidos** dentro de `src/modules/`.
- La regla de dependencias hexagonal es unidireccional y estricta:
  ```
  ui / app (entradas) ──► application ──► domain ◄── infrastructure (salidas)
  ```
- `domain` no importa de nadie.
- `application` solo importa de `domain`.
- `infrastructure` importa de `domain` (para implementar los puertos) y de librerías externas / HTTP.
- `ui` y `src/app/` son **adaptadores de entrada**: importan de `application` o del composition root para disparar casos de uso.
- **PROHIBIDO** que `domain` o `application` importen de `infrastructure`, de `ui`, de React (`useState`, `useForm`) o de Next.js.

---

## 2. Árbol de Directorios Estándar

Todo módulo dentro de `src/modules/<feature>/` se estructura bajo las siguientes 4 capas:

```
src/
├── app/                                 # Adaptador de Entrada: Enrutamiento delgado Next.js 16
│   ├── (auth)/                          # Route Group: Autenticación y onboarding
│   ├── (dashboard)/                     # Route Group: Panel administrativo y backoffice
│   ├── (pos)/                           # Route Group: Mostrador de venta rápida (<10s)
│   ├── api/                             # Route Handlers (BFF hacia microservicios)
│   ├── layout.tsx                       # Root Layout (fuentes, temas, providers globales)
│   ├── middleware.ts                    # Guardia de seguridad RBAC en Edge
│   └── not-found.tsx                    # Vista 404 global
│
├── modules/                             # Módulos de Dominio (Vertical Slices autocontenidos)
│   └── <feature>/                       # Un módulo por feature de negocio (auth, pos, users...)
│       ├── domain/                      # 1. ESQUELETO Y REGLAS PURAS
│       │   ├── <entity>.types.ts        # Entidades e interfaces de negocio puras
│       │   ├── <entity>.repository.ts   # PUERTO (interfaz abstracta del repositorio)
│       │   └── <entity>.errors.ts       # Errores de dominio específicos
│       │
│       ├── application/                 # 2. CASOS DE USO Y ORQUESTACIÓN
│       │   ├── <use-case>.use-case.ts   # Función de caso de uso pura (recibe puerto por parámetro)
│       │   └── <feature>.types.ts       # DTOs y tipos planos de entrada/salida de aplicación
│       │
│       ├── infrastructure/              # 3. IMPLEMENTACIÓN Y ADAPTADORES EXTERNOS
│       │   ├── http-<entity>.repository.ts # Adaptador real que implementa el puerto
│       │   ├── in-memory-<entity>.repository.ts # Adaptador mock/offline para pruebas y contingencia
│       │   ├── <entity>-mapper.ts       # Mappers bidireccionales (toDomain / toDto)
│       │   ├── <entity>.schema.ts       # Esquema Zod para validar la respuesta de la API externa
│       │   └── composition.ts           # COMPOSITION ROOT (instancia adaptador y exporta casos de uso listos)
│       │
│       └── ui/                          # 4. ADAPTADOR DE ENTRADA (React)
│           ├── components/              # Componentes JSX que solo pintan y emiten eventos
│           ├── hooks/                   # Custom hooks (useState, RHF, TanStack Query, Zustand)
│           └── schemas/                 # Zod exclusivo de formularios (mensajes en español, UX)
│
└── shared/                              # Recursos transversales agnósticos de negocio
    ├── components/                      # Primitivos UI reutilizables (Button, Input, Modal - Shadcn)
    ├── http/                            # Cliente Web Fetch unificado (Bearer token + X-Idempotency-Key)
    ├── hooks/                           # Hooks utilitarios globales (useMediaQuery, useDebounce)
    ├── config/                          # Configuración global y validación de variables de entorno (env.ts)
    └── utils/                           # Formateadores monetarios (COP tabular-nums), fechas, cookies
```

---

## 3. Responsabilidades de Cada Capa en un Módulo

### 1. `domain/` (El Esqueleto del Negocio)
* Entidades, Value Objects y tipos de negocio puros en TypeScript estricto.
* **Puertos de salida (*Driven Ports*):** Interfaces abstractas que describen las operaciones requeridas (ej. `AuthRepository`, `ProductRepository`).
* Reglas de cálculo matemático y validaciones puras (ej. IVA 19%, subtotales, regla no-degradación de rol `OWNER`).
* **Cero dependencias externas:** Prohibido importar Zod, React, Next.js, `fetch` o librerías externas.

### 2. `application/` (Los Casos de Uso)
* Funciones de caso de uso puras que reciben los puertos mediante **inyección de dependencias** (currying o parámetro):
  ```ts
  export const getProductsUseCase = (repo: ProductRepository) => () => repo.findAll();
  ```
* Tipos de entrada/salida planos de aplicación (`Credentials`, `LoginResult`).
* **Regla estricta:** TypeScript puro. **PROHIBIDO** incluir `'use client'`, hooks de React (`useState`, `useForm`), enrutador de Next.js (`useRouter`) o importar desde `ui/` o `infrastructure/`.

### 3. `infrastructure/` (Implementaciones y Librerías)
* Adaptadores concretos que implementan los puertos de dominio consumiendo las APIs del backend o almacenamiento local.
* **Clientes BFF para el Navegador (`<feature>.client.ts`):** Funciones asíncronas independientes (`export async function get...`) que encapsulan las llamadas `fetch('/api/...')` hacia los Route Handlers del BFF (enviando automáticamente cookies `HttpOnly`), extrayendo query params y manejando códigos de respuesta. Optimizadas para Tree-Shaking.
* Mappers bidireccionales (`toDomain` al leer y `toDto` al enviar).
* Esquemas Zod para validar contratos de microservicios externos.
* **Composition Root (`composition.ts`):** Archivo central del módulo que instancia los adaptadores y exporta los casos de uso ya ensamblados:
  ```ts
  // infrastructure/composition.ts
  const repo = new HttpProductRepository();
  export const productUseCases = {
    getProducts: getProductsUseCase(repo),
    createProduct: createProductUseCase(repo),
  };
  ```
* **Mocks de contingencia:** Implementaciones alternativas (`InMemory*Repository`) para operar ante fallas del backend o pruebas unitarias sin red.

### 4. `ui/` (Adaptador de Entrada de React)
* **`ui/components/`**: Componentes visuales puros. Solo reciben datos por props o desde un hook de `ui/hooks/`. No hacen fetch ni conocen mappers de API.
* **`ui/hooks/`**: Custom hooks (`useLogin`, `usePosCart`, `useUsersQuery`). Aquí residen `react-hook-form`, `zodResolver`, Zustand y TanStack Query.
  * **REGLA ESTRICTA (Cero `fetch`):** Prohibido escribir llamadas a `fetch()`, instanciar URLs (`/api/...`) o escribir funciones de red dentro de los hooks. El hook **solo orquesta** y delega la ejecución a funciones de `infrastructure/<feature>.client.ts` (ej. `import { getUsers } from '../../infrastructure/users.client'`) o a Server Actions.
* **`ui/schemas/`**: Esquemas de Zod **exclusivos de formularios** (mensajes amigables para el usuario, `coerce`, validación en tiempo real).

---

## 4. Regla de "Páginas Delgadas" (*Thin Pages*) en `src/app/`

- Los archivos `page.tsx` dentro de `src/app/` son adaptadores de entrada y **NO DEBEN** contener JSX complejo, estilos directos de tablas ni llamadas de red directas.
- Cada `page.tsx` debe ser un cascarón de menos de 20 líneas que solo define metadatos de Next.js y monta la vista principal del módulo:
  ```tsx
  // src/app/(dashboard)/team/page.tsx
  import { UsersManagementView } from '@/modules/users/ui/components/users-management-view';

  export const metadata = {
    title: 'Personal y Colaboradores | Admin',
  };

  export default function TeamPage() {
    return <UsersManagementView />;
  }
  ```
- Para Server Actions (`actions.ts`), se colocan en `src/app/<ruta>/actions.ts` con directiva `'use server'`, validan los argumentos con Zod y delegan inmediatamente en los casos de uso expuestos por el `composition.ts` del módulo.

---

## 5. Reglas de Aislamiento y Comunicación entre Módulos

- **Independencia modular:** Un módulo **NO DEBE** importar archivos de la infraestructura interna de otro módulo.
- La comunicación entre módulos se realiza exclusivamente a través de los puertos/casos de uso públicos o hooks expuestos en la interfaz pública del módulo.
- Si dos módulos necesitan compartir componentes visuales básicos (como un botón o modal genérico), ese componente pertenece a `src/shared/components/`.
- La información de sesión actual y tokens se comparte a través del módulo transversal `auth`.
