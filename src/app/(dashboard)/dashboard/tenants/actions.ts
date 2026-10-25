"use server";

import { tenantsUseCases } from "@/modules/tenants/infrastructure/composition";
import { Tenant, CreateTenant } from "@/modules/tenants/domain/tenant.entity";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { handleActionError, ActionResult } from "@/shared/utils/action-error";

export type GetTenantsActionResult = ActionResult<Tenant[]>;
export type CreateTenantActionResult = ActionResult<Tenant>;

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
		return handleActionError(
			error,
			"getTenantsAction",
			"Error al recuperar el directorio de empresas",
		);
	}
}

/**
 * Server Action para dar de alta una nueva empresa en el SaaS.
 * Verifica estrictamente que el usuario posea rol OWNER en el servidor
 * antes de invocar el caso de uso.
 */
export async function createTenantAction(
	payload: CreateTenant,
): Promise<CreateTenantActionResult> {
	try {
		// Verificación de autorización RBAC en el servidor
		await requireRole(rolesFor("/dashboard/tenants"), "/dashboard/tenants");

		const tenant = await tenantsUseCases.createTenant(payload);
		const plainTenant: Tenant = {
			id: tenant.id,
			nitRut: tenant.nitRut,
			businessName: tenant.businessName,
			tradeName: tenant.tradeName,
			address: tenant.address,
			phone: tenant.phone,
			email: tenant.email,
			countryCode: tenant.countryCode,
			currencyCode: tenant.currencyCode,
			taxRegime: tenant.taxRegime,
			isActive: tenant.isActive,
			createdAt: tenant.createdAt,
			displayName: tenant.displayName,
		};

		return {
			success: true,
			data: plainTenant,
		};
	} catch (error) {
		return handleActionError(
			error,
			"createTenantAction",
			"Ocurrió un error inesperado al registrar la empresa.",
		);
	}
}
