---
name: error-handling-architecture
description: Guía y procedimientos paso a paso para modelar errores de dominio, mapear excepciones HTTP en adaptadores de infraestructura, estructurar Server Actions con allowlist seguro y consumir resultados con unión discriminada en la UI.
---

# Skill: Manejo Integral de Errores y Excepciones Hexagonales (Squad 4)

Este skill define el procedimiento paso a paso para modelar, mapear y gestionar excepciones en el SaaS Empresarial y Mostrador POS bajo Arquitectura Hexagonal y Next.js 16 App Router.

---

## 1. La Cadena de Manejo de Errores Hexagonal

Los errores fluyen desde el mundo exterior hacia el usuario a través de 4 capas:

```mermaid
flowchart LR
    API["API Externa / DB<br/>(HTTP 409, 404, 500)"] -->|1. Atrapa AppApiError| Adaptador["Adaptador HTTP<br/>(Http*Repository)"]
    Adaptador -->|2. Lanza DomainError limpio| CasoUso["Caso de Uso<br/>(Application)"]
    CasoUso -->|3. Propaga| ServerAction["Server Action<br/>(actions.ts)"]
    ServerAction -->|4. handleActionError<br/>(Allowlist)| ClientUI["Cliente UI<br/>(Hooks / Toast / Forms)"]
```

---

## 2. Paso a Paso: Implementación Capa por Capa

### Paso 1: Definir la Excepción de Dominio (`domain/`)
1. Importar la clase base `DomainError` desde `@/shared/domain/domain-error`.
2. Crear la clase base del módulo (`*DomainError`) y las excepciones específicas.
3. Asignar siempre un `code` semántico en mayúsculas sostenidas:

```typescript
// src/modules/<feature>/domain/<feature>.errors.ts
import { DomainError } from "@/shared/domain/domain-error";

export class UserDomainError extends DomainError {
	constructor(message: string, code = "USER_ERROR") {
		super(message, code);
		this.name = "UserDomainError";
	}
}

export class UserAlreadyExistsError extends UserDomainError {
	constructor(detail?: string) {
		super(
			detail || "Ya existe un usuario registrado con ese número de documento o correo electrónico.",
			"USER_ALREADY_EXISTS",
		);
		this.name = "UserAlreadyExistsError";
	}
}
```

---

### Paso 2: Mapear Excepciones en el Adaptador HTTP (`infrastructure/`)
1. Capturar las excepciones HTTP (`ConflictError`, `NotFoundError`, `ForbiddenError`) emitidas por `httpClient`.
2. Re-lanzar la excepción de dominio correspondiente **sin pisar el mensaje**:

```typescript
// src/modules/<feature>/infrastructure/http-<feature>.repository.ts
try {
	const { data } = await httpClient.post<unknown>("/users", payload);
	return UserMapper.toDomain(data);
} catch (error) {
	if (error instanceof ConflictError) {
		// ✅ Lanzar sin argumentos para preservar el mensaje semántico del dominio
		throw new UserAlreadyExistsError();
	}
	if (error instanceof NotFoundError) {
		throw new UserNotFoundError(id);
	}
	throw error; // Deja fluir errores inesperados
}
```

---

### Paso 3: Estructurar la Server Action (`actions.ts`)
1. Importar `handleActionError` y `ActionResult` desde `@/shared/utils/action-error`.
2. Ejecutar validación RBAC en el servidor con `requireRole()`.
3. Retornar el resultado en caso de éxito con `toPlain()`.
4. En el `catch`, invocar `handleActionError`:

```typescript
// src/app/(dashboard)/dashboard/<feature>/actions.ts
"use server";

import { handleActionError, ActionResult } from "@/shared/utils/action-error";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";

export type CreateUserActionResult = ActionResult<UserPlain>;

export async function createUserAction(payload: CreateUser): Promise<CreateUserActionResult> {
	try {
		await requireRole(rolesFor("/dashboard/users"), "/dashboard/users");
		const user = await usersUseCases.createUser(payload);
		return { success: true, data: user.toPlain() };
	} catch (error) {
		return handleActionError(error, "createUserAction", "No se pudo registrar el usuario.");
	}
}
```

---

### Paso 4: Consumir el `ActionResult` en la UI (`ui/hooks/`)
Al ser una **unión discriminada**, TypeScript garantiza que al evaluar `!res.success`, el bloque de error contiene `error`, `code` y opcionalmente `fieldErrors`:

```typescript
// En un hook o componente cliente:
const res = await createUserAction(data);

if (!res.success) {
	// Reaccionar según el código semántico de error:
	if (res.code === "USER_ALREADY_EXISTS") {
		form.setError("documentNumber", { message: "Documento ya registrado" });
		return;
	}

	// O mostrar Toast accesible:
	setErrorMessage(res.error);
	return;
}

// Aquí TypeScript sabe al 100% que res.data existe:
console.log("Usuario creado:", res.data.id);
```

---

## 3. Checklist de Verificación y Seguridad

Antes de dar por completado un flujo de errores, verificar:
- [ ] La excepción de dominio extiende de `DomainError` y tiene un `code` único.
- [ ] El repositorio no sobreescribe el mensaje del dominio con textos genéricos del HTTP (`new Error(httpError.message)`).
- [ ] El Server Action utiliza `handleActionError` con su mensaje de respaldo (*fallback*).
- [ ] Next.js `redirect()` y `notFound()` funcionan sin ser bloqueados (`unstable_rethrow` activo).
- [ ] Cero filtraciones de `details`, IPs internas o esquemas de Zod hacia el cliente.
