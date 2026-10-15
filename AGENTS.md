<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Contexto del Proyecto y Reglas Maestras (Squad 4)

## 1. Identidad y Contexto del Proyecto

* **Proyecto:** Sistema SaaS Empresarial Contable, POS y Gestión Comercial Multi-Tenant.
* **Institución:** Institución Universitaria del Putumayo — UniPutumayo (Sede Mocoa).
* **Programa:** Tecnología en Desarrollo de Software — VI Semestre (Diplomado Opción de Grado 4.0).
* **Docente Titular y Arquitecto:** Anderson Stiven Moncayo Bermeo.
* **Escuadrón Responsable:** **Escuadrón 4 (Web Desktop Admin & High-Speed POS)**.
* **Misión de este Repositorio (`web-diplomado`):**
  Construir la aplicación web de escritorio para la administración general del SaaS (Backoffice de Propietarios y Administradores) y el **Mostrador de Punto de Venta (POS) de Alta Velocidad** diseñado para liquidar transacciones comerciales en **menos de 10 segundos**, 100% operable mediante teclado físico y con rendimiento a 60 FPS.

---

## 2. Stack Tecnológico Base

* **Framework:** Next.js `16.4.0` (App Router, motor Turbopack, React 19).
* **Gestor de Paquetes:** `pnpm` (exclusivo).
* **Estilos:** Tailwind CSS `v4` con directivas `@theme` y `@utility` en `src/app/globals.css`.
* **Lenguaje:** TypeScript 5.9+ (modo estricto).
* **Iconografía:** `lucide-react`.
* **Estado Asíncrono y Caché de Servidor:** TanStack Query (React Query v5) para el cliente.
* **Estado Síncrono / Memoria Local:** Zustand (para carrito POS y UI interactiva).
* **Validación de Esquemas y Dominio:** Zod (para validación de DTOs, `.env` y tipos inferidos `z.infer`).
* **Gestión de Formularios:** React Hook Form (`@hookform/resolvers/zod`).

---

## 3. Arquitectura y Reglas Establecidas

### A. Arquitectura Hexagonal Modular por Funcionalidad (*Vertical Slicing*)
* **PROHIBIDO** el empaquetado por capas horizontales globales en la raíz.
* El código de negocio reside en **`src/modules/<feature>/`** (`auth`, `pos`, `users`, `branches`, `company`).
* Cada módulo es autocontenido y posee sus 4 capas hexagonales estrictas:
  * `domain/`: Entidades, reglas puras y **contratos de puertos/interfaces de repositorio** (`*Repository`) en TypeScript estricto (cero dependencias externas: cero React, cero Next.js, cero Zod, cero `fetch`).
  * `application/`: **Casos de uso puros** con inyección de dependencias (reciben los puertos por parámetro) y tipos planos de aplicación (`Credentials`). TypeScript puro: **cero hooks de React** (`useState`, `useForm`), cero Next.js y cero importación directa de infraestructura o UI.
  * `infrastructure/`: Implementaciones de los puertos (`Http*Repository`), mappers bidireccionales (`toDomain` / `toDto`), esquemas Zod del contrato de la API externa y **Composition Root** (`composition.ts`) que conecta puertos con adaptadores e inyecta los casos de uso.
  * `ui/`: **Adaptador de entrada de React**, organizado en:
    * `ui/components/`: Componentes visuales que solo renderizan y emiten eventos.
    * `ui/hooks/`: Custom hooks de React (`useForm`, React Query, Zustand) que orquestan el estado de vista y conectan con casos de uso o Server Actions.
    * `ui/schemas/`: Esquemas de validación Zod exclusivos de formularios (UX, mensajes legibles en español, `coerce`).
* Recursos transversales agnósticos de negocio van en **`src/shared/`** (`components` o `ui`, `http`, `utils`, `hooks`, `config`).
* La carpeta **`src/app/`** actúa como el **Adaptador de Entrada de Next.js**: *Thin Pages* de menos de 20 líneas que solo montan la vista o consumen Server Actions (`actions.ts` con validación Zod en el servidor delegando en `composition.ts`) y Route Handlers.

### B. Enrutamiento y Navegación
* **PROHIBIDO** `react-router` o `react-router-dom`. Se usa exclusivamente el App Router de Next.js.
* Imports de navegación obligatorios desde `'next/navigation'` y enlaces desde `'next/link'`.
* División por Route Groups:
  * `(auth)`: Login y onboarding.
  * `(dashboard)`: Panel administrativo con Sidebar y Topbar persistentes.
  * `(pos)`: Mostrador a pantalla completa para el cajero.
* Toda ruta debe contar con sus archivos de robustez: `page.tsx`, `loading.tsx` (Skeleton) y `error.tsx` (Error Boundary con reintento).
* En Next.js 16, `params` y `searchParams` se consumen como Promesas asíncronas (`await params`).
* Control de acceso RBAC centralizado en `src/middleware.ts` mediante decodificación de JWT en cookies `HttpOnly`.

### C. Normas Financieras, Contables y NIIF
* **Inmutabilidad Financiera:** Prohibido el borrado destructivo (`DELETE`) en base de datos; únicamente desactivación lógica (*Soft-Disable* `is_active = false`).
* **Precisión Numérica:** Toda cifra monetaria, cantidad, IVA y devuelta debe incluir obligatoriamente la clase `font-mono tabular-nums`.
* **Idempotencia:** Toda petición transaccional de venta y cobro debe inyectar la cabecera `X-Idempotency-Key` (UUIDv4) para evitar dobles cobros ante fallas de red.

---

## 4. Fuentes de Verdad del Diseño (Dónde Consultar en Caso de Duda)

Si un agente o desarrollador tiene dudas sobre diseño, colores, fuentes, layouts o componentes, **debe consultar los siguientes documentos maestros antes de escribir código**:

| Tema / Duda | Documento de Referencia | Ubicación del Archivo |
| :--- | :--- | :--- |
| **Sistema de Diseño Maestro** | `DESIGN.md` | [`DESIGN.md`](file:///c:/dev-proyects/diplomado/web-diplomado/DESIGN.md) o [`docs/DESIGN.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/DESIGN.md) |
| **Colorimetría y Paleta Oficial** | Manual Institucional UniPutumayo (Res. 0565) | [`docs/identidad-visual/COLORIMETRIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/COLORIMETRIA.md) |
| **Reglas de Agente para Colores** | Directivas obligatorias de Tailwind `@theme` | [`.agents/rules/colorimetria.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/colorimetria.md) |
| **Prohibición Clases Arbitrarias** | Tolerancia cero a `bg-[#...]` y valores en corchetes | [`.agents/rules/tailwind-no-arbitrary-classes.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/tailwind-no-arbitrary-classes.md) |
| **Tipografía Oficial y Formato** | Guía de fuentes Raleway, Fira Sans y JetBrains Mono | [`docs/identidad-visual/TIPOGRAFIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/TIPOGRAFIA.md) |
| **Reglas de Agente para Tipografía**| Normas de fuentes, tamaños mínimos y `tabular-nums` | [`.agents/rules/tipografia.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/tipografia.md) |
| **Estructura de Directorios** | Reglas de Arquitectura Hexagonal Modular | [`.agents/rules/project-structure.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/project-structure.md) |
| **Enrutamiento y RBAC** | Reglas de rutas, Route Groups y middleware | [`.agents/rules/nextjs-routing.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/nextjs-routing.md) |
| **Obtención de Datos (Fetching)** | Web Fetch, streaming, idempotencia y mocks | [`.agents/rules/data-fetching.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/data-fetching.md) |
| **Procedimientos Paso a Paso** | Skill de creación de páginas y optimización | [`.agents/skills/nextjs-routing-navigation/SKILL.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/skills/nextjs-routing-navigation/SKILL.md) |
| **Feedback y Alertas UI** | Regla obligatoria de Toasts y Notificaciones | [`.agents/rules/ui-feedback.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/ui-feedback.md) |
| **Semántica HTML5 y Divitis** | Reglas obligatorias de estructura HTML5 y accesibilidad | [`.agents/rules/html-semantica.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/html-semantica.md) |
| **Auditoría Técnica Backend E1** | Diagnóstico del Core Auth, endpoints y JWT de Squad 1 | [`docs/AUDITORIA_TECNICA_COMPLETA_SQUAD1.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/AUDITORIA_TECNICA_COMPLETA_SQUAD1.md) |

---

## 5. Directrices de Comportamiento para Agentes

1. **Mantener la Integridad de Archivos:** No sobreescribir ni eliminar el bloque superior `<!-- BEGIN:nextjs-agent-rules -->`.
2. **Priorizar el Rendimiento:** No añadir librerías pesadas (ej. Axios, Lodash, Moment.js). Usar las APIs nativas de Next.js, Web Fetch y JavaScript moderno.
3. **Respetar la Ergonomía del Mostrador:** En cualquier vista del POS (`/pos`), priorizar la navegación con teclado (`F1` a `F12`, `Esc`), atajos visibles en `<kbd>`, retroalimentación sonora sutil y cero dependencias obligatorias del ratón.
4. **Cero Clases Arbitrarias de Tailwind:** Prohibido terminantemente escribir valores en corchetes como `bg-[#...]` o `text-[#...]`. Todo color, borde y fondo debe consumirse a través de los tokens semánticos definidos en `@theme` (`bg-brand-primary`, `bg-brand-secondary`, `bg-checkout`, etc.).
5. **Cero Desplazamiento de Layout en Feedback (CLS = 0):** Prohibido insertar banners inline que empujen formularios o tablas. Todo mensaje de fallo, confirmación o alerta de servidor debe utilizar el componente compartido transversal `@/shared/ui/toast`.
6. **Semántica HTML5 y Tolerancia Cero a la Divitis:** Prohibido usar `<div>` para elementos estructurales (páginas, tarjetas, barras de navegación o listas). Toda vista debe emplear `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<aside>` y `<ul role="list">`/`<ol>` para colecciones, preservando un único `<h1>` representativo por documento.


