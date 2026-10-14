import { FieldValidationError } from "./http-types";

/**
 * Error base unificado para todas las excepciones HTTP de la aplicación.
 */
export class AppApiError extends Error {
	public readonly status: number;
	public readonly code: string;
	public readonly details?: unknown;

	constructor(
		status: number,
		message: string,
		code: string = "HTTP_ERROR",
		details?: unknown,
	) {
		super(message);
		this.name = "AppApiError";
		this.status = status;
		this.code = code;
		this.details = details;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * Error 401: Sesión expirada, credenciales inválidas o token no autorizado.
 */
export class UnauthorizedError extends AppApiError {
	public readonly reason: "expired" | "invalid" | "missing";

	constructor(
		message: string = "Sesión expirada o no autorizada",
		reason: "expired" | "invalid" | "missing" = "expired",
		details?: unknown,
	) {
		super(401, message, "UNAUTHORIZED", details);
		this.name = "UnauthorizedError";
		this.reason = reason;
	}
}

/**
 * Error 403: Permisos insuficientes (RBAC) o intento de cruzar a otro Tenant.
 */
export class ForbiddenError extends AppApiError {
	constructor(
		message: string = "No tiene permisos para acceder a este recurso",
		details?: unknown,
	) {
		super(403, message, "FORBIDDEN", details);
		this.name = "ForbiddenError";
	}
}

/**
 * Error 404: Recurso no encontrado (usuario, sede o endpoint inexistente).
 */
export class NotFoundError extends AppApiError {
	constructor(
		message: string = "El recurso solicitado no fue encontrado",
		details?: unknown,
	) {
		super(404, message, "NOT_FOUND", details);
		this.name = "NotFoundError";
	}
}

/**
 * Error 409: Conflicto con el estado actual del recurso (ej. concurrencia en POS, folios duplicados).
 */
export class ConflictError extends AppApiError {
	constructor(
		message: string = "Conflicto al procesar la solicitud con el estado actual del recurso",
		details?: unknown,
	) {
		super(409, message, "CONFLICT", details);
		this.name = "ConflictError";
	}
}

/**
 * Error 400 / 422: Error de validación de datos (DTO).
 * Contiene el listado de campos con errores para resaltar en los formularios.
 */
export class ValidationError extends AppApiError {
	public readonly errors: FieldValidationError[];

	constructor(
		message: string = "Los datos enviados son inválidos",
		errors: FieldValidationError[] = [],
		status: 400 | 422 = 400,
	) {
		super(status, message, "VALIDATION_ERROR", errors);
		this.name = "ValidationError";
		this.errors = errors;
	}
}

/**
 * Error 408: Tiempo límite de espera agotado en la petición HTTP.
 */
export class RequestTimeoutError extends AppApiError {
	constructor(
		message: string = "La solicitud excedió el tiempo máximo de respuesta",
		details?: unknown,
	) {
		super(408, message, "TIMEOUT_ERROR", details);
		this.name = "RequestTimeoutError";
	}
}
// Alias para compatibilidad hacia atrás
export { RequestTimeoutError as TimeoutError };

/**
 * Error 500+ / Fallo de Red: El backend está caído, inestable o inaccesible.
 */
export class ServiceUnavailableError extends AppApiError {
	constructor(
		message: string = "Servicio no disponible o error de conexión con el backend",
		details?: unknown,
	) {
		super(503, message, "SERVICE_UNAVAILABLE", details);
		this.name = "ServiceUnavailableError";
	}
}
