import "server-only";
import { ENV } from "../config/env";
import {
	handleHttpErrorResponse,
	handleNetworkOrTimeoutFailure,
} from "./error-handler";
import { ApiResponse, HttpMethod, HttpRequestOptions } from "./http-types";
import { createRequestHeaders } from "./request-headers";
import { serializeRequestBody } from "./request-body";
import { parseResponseBody } from "./response-parser";
import { createTimeoutController } from "./timeout-controller";
import { buildRequestUrl } from "./url-builder";

/**
 * Función orquestadora central para la ejecución de peticiones HTTP en el servidor (BFF).
 * - Exclusivo de Server Components, Server Actions y Route Handlers.
 * - Idempotencia segura mediante crypto.randomUUID() generado una única vez por operación.
 */
export async function request<T = unknown>(
	endpoint: string,
	method: HttpMethod = "GET",
	options: HttpRequestOptions = {},
): Promise<ApiResponse<T>> {
	const url = buildRequestUrl(endpoint, options.params);
	const isMutable = method === "POST" || method === "PUT" || method === "PATCH";
	const operationIdempotencyKey =
		options.idempotencyKey || (isMutable ? crypto.randomUUID() : undefined);

	const headers = await createRequestHeaders(
		method,
		options,
		operationIdempotencyKey,
	);
	const body = serializeRequestBody(options.body);
	const timeoutMs = options.timeoutMs ?? ENV.API_TIMEOUT_MS;
	const {
		signal,
		cleanup: cleanupTimeout,
		didTimeout,
	} = createTimeoutController(timeoutMs, options.signal);

	try {
		const response = await fetch(url, {
			method,
			headers,
			body,
			signal,
			cache: options.cache,
			next: options.next,
		});

		const parsedData = await parseResponseBody<T>(response);

		if (!response.ok) {
			console.error("❌ [HTTP Client Error]", {
				method,
				endpoint,
				status: response.status,
			});
			handleHttpErrorResponse(response.status, parsedData, endpoint);
		}

		return {
			data: parsedData as T,
			status: response.status,
			headers: response.headers,
		};
	} catch (error) {
		handleNetworkOrTimeoutFailure(error, {
			endpoint,
			timeoutMs,
			timedOut: didTimeout(),
		});
	} finally {
		cleanupTimeout();
	}
}

/**
 * Cliente HTTP público con métodos de conveniencia tipados para uso de servidor.
 */
export const httpClient = {
	get: <T = unknown>(
		endpoint: string,
		options?: Omit<HttpRequestOptions, "body">,
	) => request<T>(endpoint, "GET", options),

	post: <T = unknown>(
		endpoint: string,
		body?: unknown,
		options?: Omit<HttpRequestOptions, "body">,
	) => request<T>(endpoint, "POST", { ...options, body }),

	patch: <T = unknown>(
		endpoint: string,
		body?: unknown,
		options?: Omit<HttpRequestOptions, "body">,
	) => request<T>(endpoint, "PATCH", { ...options, body }),

	put: <T = unknown>(
		endpoint: string,
		body?: unknown,
		options?: Omit<HttpRequestOptions, "body">,
	) => request<T>(endpoint, "PUT", { ...options, body }),

	delete: <T = unknown>(endpoint: string, options?: HttpRequestOptions) =>
		request<T>(endpoint, "DELETE", options),
};
