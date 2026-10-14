import {
	AppApiError,
	ConflictError,
	ForbiddenError,
	NotFoundError,
	RequestTimeoutError,
	ServiceUnavailableError,
	UnauthorizedError,
	ValidationError,
} from "./http-errors";
import { NestErrorPayload } from "./http-types";
import { extractNestValidationErrors } from "./response-parser";

/**
 * Procesa la respuesta de error HTTP cuando status >= 400 de forma 100% pura:
 * Solo traduce el status en la excepción tipada correspondiente, sin efectos secundarios en cookies ni navegador.
 */
export function handleHttpErrorResponse(
	status: number,
	payload: unknown,
	endpoint: string,
): never {
	const nestPayload = (
		typeof payload === "object" && payload !== null ? payload : null
	) as NestErrorPayload | null;

	switch (status) {
		case 401:
			throw new UnauthorizedError("Sesión expirada o no autorizada", "expired", {
				endpoint,
			});

		case 403:
			throw new ForbiddenError("No tiene permisos para realizar esta acción", {
				endpoint,
			});

		case 404:
			throw new NotFoundError("El recurso solicitado no fue encontrado", {
				endpoint,
			});

		case 409:
			throw new ConflictError("Conflicto con el estado actual del recurso", {
				endpoint,
				payload,
			});

		case 400:
		case 422: {
			const { message, fieldErrors } = extractNestValidationErrors(nestPayload);
			throw new ValidationError(
				message || "Los datos enviados son inválidos",
				fieldErrors,
				status as 400 | 422,
			);
		}

		default:
			if (status >= 500) {
				throw new ServiceUnavailableError("Servicio no disponible", {
					endpoint,
					status,
				});
			}

			throw new AppApiError(
				status,
				"Error en la comunicación con el servidor",
				"HTTP_ERROR",
				{ endpoint, payload },
			);
	}
}

export interface NetworkFailureContext {
	endpoint: string;
	timeoutMs: number;
	timedOut: boolean;
}

/**
 * Procesa excepciones a nivel de socket de red o cancelaciones.
 */
export function handleNetworkOrTimeoutFailure(
	error: unknown,
	context: NetworkFailureContext,
): never {
	if (error instanceof AppApiError) {
		throw error;
	}

	const isAbort = error instanceof Error && error.name === "AbortError";

	if (isAbort && context.timedOut) {
		throw new RequestTimeoutError(
			"La solicitud excedió el tiempo límite de espera",
			{ endpoint: context.endpoint, timeoutMs: context.timeoutMs },
		);
	}

	if (isAbort && !context.timedOut) {
		// La cancelación provino de una señal externa legítima
		throw error;
	}

	console.error(
		`❌ [HTTP Client] Fallo de conexión en endpoint: ${context.endpoint}`,
		error,
	);

	throw new ServiceUnavailableError("Servicio no disponible", {
		endpoint: context.endpoint,
		cause: error instanceof Error ? error.message : String(error),
	});
}
