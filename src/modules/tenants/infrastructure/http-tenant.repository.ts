import { httpClient, NotFoundError } from "@/shared/http";
import { Tenant, CreateTenant } from "../domain/tenant.entity";
import { TenantRepositoryPort } from "../domain/tenant.repository";
import { TenantNotFoundError } from "../domain/tenant.errors";
import { TenantMapper } from "./tenant.mapper";

/**
 * Adaptador de infraestructura HTTP que implementa `TenantRepositoryPort`
 * consumiendo la API real de Squad 1 (/api/v1/tenants).
 * Exclusivo de ejecución en servidor.
 */
export class HttpTenantRepository implements TenantRepositoryPort {
	/**
	 * Consulta la lista general de empresas registradas (Exclusivo rol OWNER).
	 */
	async findAll(): Promise<Tenant[]> {
		const { data } = await httpClient.get<unknown>("/tenants", {
			cache: "no-store",
		});

		return TenantMapper.toDomainList(data);
	}

	/**
	 * Consulta los datos detallados de una empresa específica por su ID.
	 */
	async findById(id: string): Promise<Tenant> {
		try {
			const { data } = await httpClient.get<unknown>(`/tenants/${id}`, {
				cache: "no-store",
			});

			return TenantMapper.toDomain(data);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw new TenantNotFoundError(id);
			}
			throw error;
		}
	}

	/**
	 * Registra una nueva empresa en el sistema (se conecta a la API en Micro-tarea 3).
	 */
	async create(_data: CreateTenant): Promise<Tenant> {
		throw new Error("Method not implemented yet");
	}
}
