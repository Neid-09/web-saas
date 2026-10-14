import { getAuthToken } from "../utils/cookies";
import { HttpMethod, HttpRequestOptions } from "./http-types";

/**
 * Ensambla los encabezados HTTP nativos (`Headers`) para la petición al backend:
 * - Content-Type automático (evitándolo en FormData) y Accept application/json.
 * - Inyección asíncrona de Authorization Bearer Token desde cookie HttpOnly del servidor.
 * - Inyección de clave de idempotencia X-Idempotency-Key en métodos mutables.
 */
export async function createRequestHeaders(
	method: HttpMethod,
	options: HttpRequestOptions = {},
	idempotencyKey?: string,
): Promise<Headers> {
	const headers = new Headers(options.headers);

	if (!headers.has("Accept")) {
		headers.set("Accept", "application/json");
	}

	// Inyectar Content-Type: application/json solo si hay cuerpo y no es FormData ni ya tiene tipo
	const isFormData =
		typeof FormData !== "undefined" && options.body instanceof FormData;
	if (
		options.body !== undefined &&
		options.body !== null &&
		!isFormData &&
		!headers.has("Content-Type")
	) {
		headers.set("Content-Type", "application/json");
	}

	// 1. Inyección de token de autenticación
	if (!options.skipAuth && !headers.has("Authorization")) {
		const token = await getAuthToken();
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	}

	// 2. Inyección de clave de idempotencia en métodos mutables (POST, PUT, PATCH)
	const isMutable = method === "POST" || method === "PUT" || method === "PATCH";
	if (isMutable && !headers.has("X-Idempotency-Key")) {
		const resolvedKey = idempotencyKey || options.idempotencyKey;
		if (resolvedKey) {
			headers.set("X-Idempotency-Key", resolvedKey);
		}
	}

	return headers;
}
