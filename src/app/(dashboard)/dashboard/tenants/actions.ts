"use server";

import { tenantsUseCases } from "@/modules/tenants/infrastructure/composition";
import {
	CreateTenant,
	TenantPlain,
} from "@/modules/tenants/domain/tenant.entity";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { handleActionError, ActionResult } from "@/shared/utils/action-error";

export type GetTenantsActionResult = ActionResult<TenantPlain[]>;
export type CreateTenantActionResult = ActionResult<TenantPlain>;

/**
 * Server Action para consultar el listado de empresas desde componentes clientes.
 * Ejecuta la verificación en el servidor a través de cookies HttpOnly seguras.
 */
export async function getTenantsAction(): Promise<GetTenantsActionResult> {
	try {
		// Verificación de autorización RBAC en el servidor (Defensa en profundidad)
		await requireRole(rolesFor("/dashboard/tenants"), "/dashboard/tenants");

		const tenants = await tenantsUseCases.getTenants();
		return {
			success: true,
			data: tenants.map((t) => t.toPlain()),
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
		return {
			success: true,
			data: tenant.toPlain(),
		};
	} catch (error) {
		return handleActionError(
			error,
			"createTenantAction",
			"Ocurrió un error inesperado al registrar la empresa.",
		);
	}
}
