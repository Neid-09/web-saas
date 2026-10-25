import { unstable_rethrow } from "next/navigation";
import { DomainError } from "@/shared/domain/domain-error";
import { AppApiError, ValidationError, UnauthorizedError } from "@/shared/http";

/**
 * Contrato unificado de resultado para Server Actions en toda la plataforma SaaS.
 * Unión discriminada estricta: al evaluar `res.success`, TypeScript infiere
 * inmediatamente si existe `data` o el desglose del `error`.
 */
export type ActionResult<T = void> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
			code?: string;
			fieldErrors?: Record<string, string[]>;
	  };

/**
 * Helper transversal para capturar, auditar y filtrar errores en Server Actions.
 * Implementa una política de Lista Blanca (Allowlist):
 * - Deja fluir `redirect()` y `notFound()` de Next.js mediante `unstable_rethrow`.
 * - Expone mensajes legibles ÚNICAMENTE para errores de negocio controlados (DomainError)
 *   o errores controlados de transporte (AppApiError / ValidationError).
 * - Cualquier error inesperado (TypeError, ZodError, fallos de red con IPs internas)
 *   es contenido de forma segura mostrando exclusivamente el `fallbackMessage`.
 */
export function handleActionError(
	error: unknown,
	actionName: string,
	fallbackMessage = "Ocurrió un error inesperado al procesar la solicitud.",
): Extract<ActionResult<never>, { success: false }> {
	// Permite que Next.js ejecute redirects y notFound() sin ser interceptados
	unstable_rethrow(error);

	// El detalle completo del error se conserva en los logs del servidor
	console.error(`❌ [${actionName}]`, error);

	// 1. Errores de Validación de Datos (DTOs de entrada)
	if (error instanceof ValidationError) {
		const fieldErrors: Record<string, string[]> = {};
		for (const err of error.errors) {
			if (!fieldErrors[err.field]) {
				fieldErrors[err.field] = [];
			}
			fieldErrors[err.field].push(err.message);
		}

		return {
			success: false,
			error: error.message,
			code: "VALIDATION_ERROR",
			fieldErrors,
		};
	}

	// 2. Errores de Autorización o Sesión Expirada
	if (error instanceof UnauthorizedError) {
		return {
			success: false,
			error: error.message,
			code: "UNAUTHORIZED",
		};
	}

	// 3. Errores de Dominio propios de cualquier módulo del SaaS
	if (error instanceof DomainError) {
		return {
			success: false,
			error: error.message,
			code: error.code,
		};
	}

	// 4. Errores HTTP controlados de la API de Squad 1 (ConflictError, ForbiddenError, etc.)
	if (error instanceof AppApiError) {
		return {
			success: false,
			error: error.message,
			code: error.code,
		};
	}

	// 5. Todo lo demás (TypeError, ZodError, ECONNREFUSED, bugs) -> Mensaje opaco y seguro
	return {
		success: false,
		error: fallbackMessage,
		code: "INTERNAL_SERVER_ERROR",
	};
}
