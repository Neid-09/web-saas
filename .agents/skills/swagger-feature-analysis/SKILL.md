---
name: swagger-feature-analysis
description: Protocolo para recibir contratos OpenAPI / Swagger del backend, identificar funcionalidades, definir criterios de aceptación, auditar archivos existentes/colisiones, proyectar impacto en el SaaS, configurar RBAC y desglosar en Issues atómicas.
---

# Skill: Análisis y Desglose de Contratos Swagger / OpenAPI (Squad 4)

Este skill define el protocolo estandarizado para transformar especificaciones OpenAPI/Swagger entregadas por el backend (Squad 1 o microservicios) en funcionalidades de frontend estructuradas bajo Arquitectura Hexagonal y Next.js 16.

---

## Estructura del Informe de Análisis Swagger

Cada vez que el usuario proporcione un Swagger (JSON, YAML, fragmento o enlace), el agente generará un informe con las siguientes 6 secciones:

### 1. Generalización de la Funcionalidad en el SaaS
* **Propósito de Negocio:** Qué problema resuelve en el ecosistema (Multi-tenant, Contabilidad, POS, Inventario).
* **Ubicación Arquitectónica:** A qué módulo pertenece (`src/modules/<feature>/`) y en qué Route Group de Next.js se consumirá (`(dashboard)` o `(pos)`).
* **Ciclo de Vida y Dependencias:** Qué datos previos requiere (ej: `branch_id`, tokens de sesión, estados activos).

### 2. Mapeo de Endpoints a Casos de Uso del Frontend
Tabla de conversión de endpoints técnicos a intenciones de usuario:

| Endpoint | Método | Acción Backend | Caso de Uso Frontend (`application/`) | Tipo UI |
| :--- | :---: | :--- | :--- | :--- |
| `/api/v1/...` | `GET` | Listar / Filtrar | `get<Entities>UseCase` | Tabla / Grid con skeleton |
| `/api/v1/...` | `POST` | Crear registro | `create<Entity>UseCase` | Modal / Formulario |
| `/api/v1/.../:id` | `PATCH` | Desactivación / Edición | `toggle<Entity>StatusUseCase` | Switch / Acción en fila |

### 3. Criterios de Aceptación (Gherkin & Reglas de Negocio)
* **Funcionales (Given-When-Then):** Flujos de éxito, validación y estados vacíos.
* **Resiliencia & UX:** Cero CLS, Toasts no invasivos ante errores 4xx/5xx, skeletons en `loading.tsx`.
* **Financieros & NIIF (si aplica):** Prohibido `DELETE` destructivo (solo soft-disable), números con `font-mono tabular-nums`, cabecera `X-Idempotency-Key` en mutaciones transaccionales.

### 4. Auditoría de Ficheros y Análisis de Colisión (Impact Map)
* **Ficheros Existentes a Modificar:**
  * `src/shared/config/rbac-routes.ts` (si hay nuevas rutas protegidas).
  * `src/shared/ui/dashboard/sidebar.tsx` o `nav/` (enlaces de navegación).
  * `src/shared/http/` (solo si requiere headers o configuraciones especiales).
* **Ficheros Nuevos a Crear (Hexagonales):**
  * `domain/`: Entidades y puertos de repositorio.
  * `application/`: Casos de uso puros.
  * `infrastructure/`: Schemas Zod API, Mappers, Repositorio HTTP, `composition.ts`.
  * `ui/`: Schemas de formulario, hooks (React Query), componentes visuales.
  * `src/app/`: Rutas `page.tsx`, `loading.tsx`, `error.tsx`.

### 5. Matriz RBAC y Control de Acceso
Identificación de permisos según los roles del sistema:
* Roles disponibles: `OWNER`, `ADMIN`, `CASHIER`, `ACCOUNTANT`, `WAREHOUSE_MANAGER`.
* Definición de acceso:
  * **Acceso a Ruta:** Regla a agregar en `ROUTE_PERMISSIONS` de `rbac-routes.ts`.
  * **Gating Visual:** Acciones dentro de la vista que se ocultan o deshabilitan según el rol decodificado del JWT.

### 6. Estrategia de División en Issues
Criterio de partición para evitar issues gigantes:
* **Issue 1 (Core & API):** Dominio + Infraestructura HTTP + Schemas Zod + Composition Root.
* **Issue 2 (Vista Consulta):** Hook de lectura + Componente de Listado/Tabla + Ruta App Router con `loading.tsx`.
* **Issue 3 (Mutaciones/Formularios):** Schemas Zod UI + Casos de uso de creación/edición + Modales/Formularios + Toasts.
* **Issue 4 (Si aplica POS):** Integración rápida por teclado en mostrador POS.
