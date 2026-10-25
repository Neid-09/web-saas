import { Tenant, CreateTenant } from "./tenant.entity";

/**
 * Puerto de salida del repositorio de Empresas (Tenants).
 * Define el contrato de persistencia sin acoplarse a tecnologías de transporte.
 */
export interface TenantRepositoryPort {
	/**
	 * Recupera el listado completo de empresas registradas (Exclusivo para rol OWNER).
	 */
	findAll(): Promise<Tenant[]>;

	/**
	 * Recupera los datos de una empresa específica por su identificador único.
	 */
	findById(id: string): Promise<Tenant>;

	/**
	 * Registra una nueva empresa en el sistema.
	 */
	create(data: CreateTenant): Promise<Tenant>;
}
