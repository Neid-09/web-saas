import { Tenant } from "../domain/tenant.entity";
import { TenantRepositoryPort } from "../domain/tenant.repository";

/**
 * Caso de uso puro: Obtener los datos detallados de una empresa específica por su ID.
 * Inyección de dependencias a través del puerto del repositorio.
 */
export function getTenantByIdUseCase(tenantRepository: TenantRepositoryPort) {
	return async (id: string): Promise<Tenant> => {
		if (!id || typeof id !== "string") {
			throw new Error("El identificador de la empresa es obligatorio.");
		}
		return tenantRepository.findById(id.trim());
	};
}
