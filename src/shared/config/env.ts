import "server-only";
import { z } from "zod";

/**
 * Esquema de validación estricto para variables de entorno del servidor.
 * Garantiza que la aplicación falle en tiempo de inicio si falta la URL de la API externa.
 */
const envSchema = z.object({
	API_URL: z.url("API_URL debe ser una URL válida"),
	API_TIMEOUT_MS: z.coerce.number().default(8_000),
	NEXT_PUBLIC_APP_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

function getEnvConfig() {
	const parsed = envSchema.safeParse({
		API_URL: process.env.API_URL,
		API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
		NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
	});

	if (!parsed.success) {
		console.error("❌ Error fatal de configuración de variables de entorno (Servidor):");
		console.error(parsed.error.flatten().fieldErrors);
		throw new Error(
			"Configuración de entorno inválida. Verifique que API_URL esté definida en su archivo .env.local",
		);
	}

	return parsed.data;
}

export const ENV = getEnvConfig();
