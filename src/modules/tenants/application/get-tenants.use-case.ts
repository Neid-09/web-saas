import { Tenant } from "../domain/tenant.entity";
import { TenantRepositoryPort } from "../domain/tenant.repository";

/**
 * Caso de uso puro: Obtener el listado general de empresas registradas en la plataforma.
 * Inyección de dependencias a través del puerto del repositorio.
 */
export function getTenantsUseCase(tenantRepository: TenantRepositoryPort) {
	return async (): Promise<Tenant[]> => {
		return tenantRepository.findAll();
	};
}
