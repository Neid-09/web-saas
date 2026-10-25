import { HttpTenantRepository } from "./http-tenant.repository";
import { getTenantsUseCase } from "../application/get-tenants.use-case";
import { getTenantByIdUseCase } from "../application/get-tenant-by-id.use-case";
import { createTenantUseCase } from "../application/create-tenant.use-case";

/**
 * COMPOSITION ROOT del módulo Tenants.
 * Ensambla los adaptadores de infraestructura con los casos de uso puros.
 */
const tenantRepository = new HttpTenantRepository();

export const tenantsUseCases = {
	getTenants: getTenantsUseCase(tenantRepository),
	getTenantById: getTenantByIdUseCase(tenantRepository),
	createTenant: createTenantUseCase(tenantRepository),
};
