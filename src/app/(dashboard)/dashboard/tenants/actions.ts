"use server";

import { tenantsUseCases } from "@/modules/tenants/infrastructure/composition";
import { Tenant } from "@/modules/tenants/domain/tenant.entity";

export interface GetTenantsActionResult {
	success: boolean;
	data?: Tenant[];
	error?: string;
}

/**
 * Server Action para consultar el listado de empresas desde componentes clientes.
 * Ejecuta la verificación en el servidor a través de cookies HttpOnly seguras.
 */
export async function getTenantsAction(): Promise<GetTenantsActionResult> {
	try {
		const tenants = await tenantsUseCases.getTenants();
		const plainTenants: Tenant[] = tenants.map((t) => ({
			id: t.id,
			nitRut: t.nitRut,
			businessName: t.businessName,
			tradeName: t.tradeName,
			address: t.address,
			phone: t.phone,
			email: t.email,
			countryCode: t.countryCode,
			currencyCode: t.currencyCode,
			taxRegime: t.taxRegime,
			isActive: t.isActive,
			createdAt: t.createdAt,
			displayName: t.displayName,
		}));

		return {
			success: true,
			data: plainTenants,
		};
	} catch (error) {
		console.error("❌ [getTenantsAction]", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al recuperar el directorio de empresas",
		};
	}
}
