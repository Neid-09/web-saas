import { z } from "zod";

/**
 * Esquema Zod de validación para el formulario del Wizard de creación de empresas.
 * Sanitiza automáticamente cadenas con .trim() y normaliza correos a minúsculas.
 */
export const createTenantFormSchema = z.object({
	// Paso 1: Identificación Legal y Comercial
	nitRut: z
		.string()
		.trim()
		.min(5, "El NIT o RUT debe tener al menos 5 caracteres")
		.max(20, "El NIT o RUT no debe exceder 20 caracteres")
		.regex(
			/^[0-9]+(-[0-9kK])?$/,
			"Ingresa un NIT válido (ej. 900123456 o 900123456-1)",
		),
	businessName: z
		.string()
		.trim()
		.min(3, "La razón social debe tener al menos 3 caracteres")
		.max(120, "La razón social no debe exceder 120 caracteres"),
	tradeName: z
		.string()
		.trim()
		.max(120, "El nombre comercial no debe exceder 120 caracteres")
		.optional(),

	// Paso 2: Ubicación y Contacto Directo
	address: z
		.string()
		.trim()
		.min(5, "La dirección física debe tener al menos 5 caracteres")
		.max(150, "La dirección no debe exceder 150 caracteres"),
	phone: z
		.string()
		.trim()
		.regex(
			/^[0-9]{10}$/,
			"El teléfono debe contener exactamente 10 dígitos numéricos (ej. 3101234567)",
		),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email(
			"Ingresa un correo corporativo válido (ej. contacto@empresa.com)",
		)
		.max(100, "El correo no debe exceder 100 caracteres"),

	// Paso 3: Parámetros Fiscales y Moneda
	countryCode: z
		.string()
		.trim()
		.toUpperCase()
		.min(2, "Código de país requerido"),
	currencyCode: z
		.string()
		.trim()
		.toUpperCase()
		.min(2, "Código de divisa requerido"),
	taxRegime: z
		.enum([
			"REGIMEN_SIMPLE",
			"RESPONSABLE_IVA",
			"NO_RESPONSABLE_IVA",
			"GRAN_CONTRIBUYENTE",
			"REGIMEN_ESPECIAL",
		])
		.optional(),
});

export type CreateTenantFormData = z.infer<typeof createTenantFormSchema>;

export const STEP_1_FIELDS: readonly (keyof CreateTenantFormData)[] = [
	"nitRut",
	"businessName",
	"tradeName",
];

export const STEP_2_FIELDS: readonly (keyof CreateTenantFormData)[] = [
	"address",
	"phone",
	"email",
];

export const STEP_3_FIELDS: readonly (keyof CreateTenantFormData)[] = [
	"taxRegime",
	"countryCode",
	"currencyCode",
];
