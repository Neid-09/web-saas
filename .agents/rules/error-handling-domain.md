---
description: Reglas obligatorias para modelado de errores de dominio, jerarquía de excepciones, prevención de fugas de datos y política de Allowlist en Server Actions.
globs: "src/**/*.{ts,tsx}"
alwaysApply: true
---

# Reglas de Manejo de Errores de Dominio y Excepciones — Squad 4

Este documento establece las directrices obligatorias para la definición de excepciones de negocio, mapeo en adaptadores y consumo seguro en Server Actions para todo el SaaS Comercial y Mostrador POS.

---

## 1. Principio Fundamental: Seguridad por Defecto (Allowlist)

El cliente (navegador) nunca debe recibir mensajes de errores internos de programación, trazas de pila (*stack traces*), IPs internas de red ni esquemas crudos de base de datos o librerías externas.

> **Regla de Oro:**  
> Por defecto, toda excepción no controlada se oculta bajo un mensaje genérico seguro (`fallbackMessage`). **Únicamente los errores de negocio explícitos y controlados tienen permiso de exponer su mensaje real al usuario.**

---

## 2. Jerarquía Obligatoria de Excepciones de Dominio

Toda excepción de negocio en cualquier módulo (`src/modules/<feature>/domain/*.errors.ts`) **DEBE** extender directa o indirectamente de la clase base transversal:

```typescript
import { DomainError } from "@/shared/domain/domain-error";
```

### Requisitos Estrictos:
1. **Herencia de `DomainError`:** Prohibido extender directamente de `Error` nativo en archivos de dominio.
2. **Código Semántico Único (`code`):** Cada clase de error debe suministrar un código en mayúsculas sostenidas (`SCREAMING_SNAKE_CASE`) para que la UI pueda discriminar la causa programáticamente (ej: `"TENANT_ALREADY_EXISTS"`, `"BRANCH_NOT_FOUND"`).
3. **Mensaje Centrado en el Usuario:** El mensaje predeterminado debe ser comprensible, amigable y en español.

```typescript
// ✅ CORRECTO: src/modules/tenants/domain/tenant.errors.ts
import { DomainError } from "@/shared/domain/domain-error";

export class TenantDomainError extends DomainError {
	constructor(message: string, code = "TENANT_ERROR") {
		super(message, code);
		this.name = "TenantDomainError";
	}
}

export class TenantAlreadyExistsError extends TenantDomainError {
	constructor(detail?: string) {
		super(
			detail || "Ya existe una empresa registrada con ese NIT/RUT o correo electrónico.",
			"TENANT_ALREADY_EXISTS",
		);
		this.name = "TenantAlreadyExistsError";
	}
}
```

---

## 3. Reglas de Mapeo en Adaptadores de Infraestructura

Cuando un adaptador (`Http*Repository`) consume la API externa de Squad 1 y atrapa una excepción HTTP (`ConflictError`, `NotFoundError`, etc.):

1. **PROHIBIDO pisar el mensaje de dominio con el texto genérico de la API:**
   ```typescript
   // ❌ PROHIBIDO: error.message es "Conflicto con el estado actual del recurso" y pisa el mensaje claro del dominio
   if (error instanceof ConflictError) {
     throw new TenantAlreadyExistsError(error.message);
   }

   // ✅ CORRECTO: Permite que brille el mensaje claro y específico del dominio
   if (error instanceof ConflictError) {
     throw new TenantAlreadyExistsError();
   }
   ```
2. **Aislamiento:** El adaptador debe atrapar las excepciones de transporte HTTP (`AppApiError`) y re-lanzar las excepciones semánticas de dominio correspondientes (`DomainError`).

---

## 4. Estándar Obligatorio para Server Actions (`actions.ts`)

Todas las Server Actions deben ceñirse a las siguientes normas:

1. **Unión Discriminada Estricta (`ActionResult<T>`):**
   * El tipo de retorno debe ser `ActionResult<T>` importado desde `@/shared/utils/action-error`.
   * Prohibido definir tipos con propiedades opcionales ambiguas `{ success: boolean; data?: T; error?: string }`.

2. **Uso Obligatorio de `handleActionError`:**
   * Todo bloque `catch` en Server Actions debe delegar en `handleActionError(error, actionName, fallbackMessage)`.
   * Prohibido armar respuestas de error manuales `return { success: false, error: error.message }` que puedan filtrar `TypeErrors` o fallos de red.

3. **Respeto a Next.js (`unstable_rethrow`):**
   * `handleActionError` ejecuta internamente `unstable_rethrow(error)` como primera instrucción.
   * Esto garantiza que `redirect()`, `notFound()` y lecturas de cookies durante prerender jamás sean bloqueadas por el manejador de errores.

4. **Cero Fuga de `details`:**
   * Prohibido propagar objetos `details` crudos hacia el cliente.
   * Los errores de validación solo viajan formateados en el mapa seguro `fieldErrors: Record<string, string[]>`.

```typescript
// ✅ ESTRUCTURA ESTÁNDAR DE UN SERVER ACTION:
"use server";

import { handleActionError, ActionResult } from "@/shared/utils/action-error";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";

export type MyActionResult = ActionResult<MyDataPlain>;

export async function myAction(payload: MyInput): Promise<MyActionResult> {
	try {
		await requireRole(rolesFor("/dashboard/path"), "/dashboard/path");
		const result = await myUseCase(payload);
		return { success: true, data: result.toPlain() };
	} catch (error) {
		return handleActionError(error, "myAction", "Mensaje genérico si ocurre un fallo desconocido");
	}
}
```
