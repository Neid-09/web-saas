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
