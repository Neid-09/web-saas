/**
 * Contrato unificado de resultado para Server Actions en toda la plataforma SaaS.
 */
export interface ActionResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
	details?: unknown;
}

/**
 * Helper transversal para capturar, registrar y formatear errores en Server Actions.
 * Soporta polimórficamente cualquier clase que extienda Error (errores de dominio, HTTP o de validación).
 * Reutilizable por cualquier módulo del SaaS.
 */
export function handleActionError(
	error: unknown,
	actionName: string,
	fallbackMessage = "Ocurrió un error inesperado al procesar la solicitud.",
): { success: false; error: string; details?: unknown } {
	console.error(`❌ [${actionName}]`, error);

	if (error instanceof Error && error.message) {
		const details =
			"details" in error
				? (error as { details: unknown }).details
				: undefined;

		return {
			success: false,
			error: error.message,
			...(details ? { details } : {}),
		};
	}

	return {
		success: false,
		error: fallbackMessage,
	};
}
