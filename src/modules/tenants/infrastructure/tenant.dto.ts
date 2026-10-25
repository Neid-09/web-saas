import { z } from "zod";

/**
 * Esquema Zod del contrato de datos de una Empresa retornado por el backend (Squad 1).
 */
export const tenantDtoSchema = z.object({
	id: z.string(),
	nitRut: z.string(),
	businessName: z.string(),
	tradeName: z.string().default(""),
	address: z.string().default(""),
	phone: z.string().default(""),
	email: z.string(),
	countryCode: z.string().default("COL"),
	currencyCode: z.string().default("COP"),
	taxRegime: z
		.enum([
			"REGIMEN_SIMPLE",
			"RESPONSABLE_IVA",
			"NO_RESPONSABLE_IVA",
			"GRAN_CONTRIBUYENTE",
			"REGIMEN_ESPECIAL",
		])
		.nullable()
		.optional(),
	isActive: z.boolean().default(true),
	createdAt: z.string(),
});

export type TenantDto = z.infer<typeof tenantDtoSchema>;

/**
 * Esquema Zod para validar el cuerpo de la petición POST /api/v1/tenants hacia el backend de Squad 1.
 */
export const createTenantRequestSchema = z.object({
	nitRut: z.string().min(1, "El NIT o RUT es requerido"),
	businessName: z.string().min(1, "La razón social es requerida"),
	tradeName: z.string().default(""),
	address: z.string().default(""),
	phone: z.string().default(""),
	email: z.email("El correo electrónico no es válido"),
	countryCode: z.string().default("COL"),
	currencyCode: z.string().default("COP"),
	taxRegime: z
		.enum([
			"REGIMEN_SIMPLE",
			"RESPONSABLE_IVA",
			"NO_RESPONSABLE_IVA",
			"GRAN_CONTRIBUYENTE",
			"REGIMEN_ESPECIAL",
		])
		.nullable()
		.optional(),
});

export type CreateTenantRequestDto = z.infer<typeof createTenantRequestSchema>;
