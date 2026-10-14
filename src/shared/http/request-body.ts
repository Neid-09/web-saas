/**
 * Serializa de forma segura el cuerpo de la petición HTTP.
 * - FormData y strings se preservan sin transformar para no romper uploads ni boundaries.
 * - Objetos y arreglos se serializan a JSON estándar.
 * - null o undefined retornan undefined.
 */
export function serializeRequestBody(body: unknown): BodyInit | undefined {
	if (body === undefined || body === null) {
		return undefined;
	}
	if (typeof FormData !== "undefined" && body instanceof FormData) {
		return body;
	}
	if (typeof body === "string") {
		return body;
	}
	return JSON.stringify(body);
}
