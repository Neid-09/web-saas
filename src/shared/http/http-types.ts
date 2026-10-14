export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions {
	/** Parámetros de consulta para la URL (Query Params: ?branch_id=...&role=...) */
	params?: Record<string, string | number | boolean | undefined | null>;
	/** Encabezados HTTP personalizados */
	headers?: HeadersInit;
	/** Cuerpo de la petición (JSON u objeto FormData para uploads) */
	body?: unknown;
	/** Tiempo límite de espera en milisegundos */
	timeoutMs?: number;
	/** Clave de idempotencia única UUIDv4 (si no se proporciona en métodos mutables, se genera automáticamente) */
	idempotencyKey?: string;
	/** Omitir la inyección del Bearer Token (útil para login y endpoints públicos) */
	skipAuth?: boolean;
	/** Señal de cancelación externa (ej. abort de llamada superior) */
	signal?: AbortSignal;
	/** Modo de caché nativo de fetch para Server Components de Next.js */
	cache?: RequestCache;
	/** Opciones de revalidación y tags de caché del motor Next.js */
	next?: {
		revalidate?: number | false;
		tags?: string[];
	};
}

export interface ApiResponse<T> {
	data: T;
	status: number;
	headers: Headers;
}

export interface FieldValidationError {
	field: string;
	message: string;
}

/** Formato típico de error emitido por NestJS (Squad 1 - Core Backend) */
export interface NestErrorPayload {
	statusCode?: number;
	message?: string | string[];
	error?: string;
	details?: unknown;
}
