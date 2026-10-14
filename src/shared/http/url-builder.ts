import { ENV } from "../config/env";
import { HttpRequestOptions } from "./http-types";

/**
 * Construye la URL de la petición hacia la API backend de Squad 1.
 * - Concatenación estricta baseUrl + normalizedPath para prevenir SSRF y fugas de tokens.
 * - Formatea parámetros de consulta ignorando valores vacíos, nulos o indefinidos.
 */
export function buildRequestUrl(
	endpoint: string,
	params?: HttpRequestOptions["params"],
): string {
	const baseUrl = ENV.API_URL.replace(/\/+$/, "");
	const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const urlWithoutParams = `${baseUrl}${normalizedPath}`;

	if (!params || Object.keys(params).length === 0) {
		return urlWithoutParams;
	}

	const searchParams = new URLSearchParams();
	for (const [key, val] of Object.entries(params)) {
		if (val !== undefined && val !== null && val !== "") {
			searchParams.append(key, String(val));
		}
	}

	const queryString = searchParams.toString();
	return queryString ? `${urlWithoutParams}?${queryString}` : urlWithoutParams;
}
