import { FieldValidationError, NestErrorPayload } from "./http-types";

/**
 * Deserializa el cuerpo de la respuesta HTTP considerando su Content-Type y códigos sin contenido.
 * - Detecta JSON con `/json/i.test(contentType)` (cubre `application/problem+json`).
 * - Si response.ok es true y el JSON es inválido, lanza una excepción.
 * - En respuestas de error, tolera JSON corrupto retornando null o texto.
 */
export async function parseResponseBody<T = unknown>(
	response: Response,
): Promise<T | null> {
	if (response.status === 204) {
		return null;
	}

	const contentType = response.headers.get("content-type") || "";
	const isJson = /json/i.test(contentType);

	if (isJson) {
		try {
			return (await response.json()) as T;
		} catch {
			if (response.ok) {
				throw new Error(
					"Respuesta JSON inválida o corrupta devuelta por el servidor",
				);
			}
			return null;
		}
	}

	try {
		const text = await response.text();
		return (text ? text : null) as T;
	} catch {
		return null;
	}
}

/**
 * Interpreta las respuestas de error estructuradas emitidas por NestJS (Squad 1 - Core Architecture).
 * - Nota: La extracción del campo (field) es "best-effort" basada en las convenciones de class-validator.
 * - Solo debe consumirse para códigos de validación 400 y 422.
 */
export function extractNestValidationErrors(payload: NestErrorPayload | null): {
	message: string;
	fieldErrors: FieldValidationError[];
} {
	if (!payload) {
		return { message: "Error en la solicitud", fieldErrors: [] };
	}

	const fieldErrors: FieldValidationError[] = [];
	let mainMessage =
		typeof payload.error === "string" ? payload.error : "Error de validación";

	if (Array.isArray(payload.message)) {
		for (const msg of payload.message) {
			if (typeof msg === "string") {
				// class-validator emite convención: "email must be an email"
				const firstWord = msg.split(" ")[0] || "general";
				fieldErrors.push({ field: firstWord, message: msg });
			}
		}
		const firstMsg = payload.message[0];
		if (typeof firstMsg === "string") {
			mainMessage = firstMsg;
		}
	} else if (typeof payload.message === "string") {
		mainMessage = payload.message;
	}

	return { message: mainMessage, fieldErrors };
}
