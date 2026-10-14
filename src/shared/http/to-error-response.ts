import { AppApiError, ValidationError } from "./http-errors";

export interface ApiErrorResponsePayload {
	code: string;
	message: string;
	errors?: unknown;
}

/**
 * Traduce cualquier excepción capturada en un Route Handler a una respuesta Response.json segura.
 * - Previene fuga de trazas, detalles internos o stack traces al cliente.
 * - Solo ValidationError incluye el arreglo de errores de validación de campos.
 */
export function toErrorResponse(error: unknown): Response {
	if (error instanceof ValidationError) {
		const payload: ApiErrorResponsePayload = {
			code: error.code,
			message: error.message,
			errors: error.errors,
		};
		return Response.json(payload, { status: error.status });
	}

	if (error instanceof AppApiError) {
		const payload: ApiErrorResponsePayload = {
			code: error.code,
			message: error.message,
		};
		return Response.json(payload, { status: error.status });
	}

	console.error("❌ [Unhandled Server Error]", error);

	const payload: ApiErrorResponsePayload = {
		code: "INTERNAL_SERVER_ERROR",
		message: "Ocurrió un error inesperado en el servidor",
	};

	return Response.json(payload, { status: 500 });
}
