import { Tenant, CreateTenant } from "../domain/tenant.entity";
import {
	TenantDto,
	tenantDtoSchema,
	CreateTenantRequestDto,
	createTenantRequestSchema,
} from "./tenant.dto";

/**
 * Mapper bidireccional entre la capa de infraestructura (DTOs externos)
 * y la capa de dominio pura (Entidad Tenant y CreateTenant).
 */
export class TenantMapper {
	/**
	 * Transforma y valida un DTO crudo del backend en una Entidad pura de Dominio.
	 */
	static toDomain(raw: unknown): Tenant {
		const unwrapped =
			raw && typeof raw === "object" && "data" in raw && !("id" in raw)
				? (raw as { data: unknown }).data
				: raw;

		const parsed: TenantDto = tenantDtoSchema.parse(unwrapped);

		return new Tenant({
			id: parsed.id,
			nitRut: parsed.nitRut,
			businessName: parsed.businessName,
			tradeName: parsed.tradeName,
			address: parsed.address,
			phone: parsed.phone,
			email: parsed.email,
			countryCode: parsed.countryCode,
			currencyCode: parsed.currencyCode,
			taxRegime: parsed.taxRegime,
			isActive: parsed.isActive,
			createdAt: parsed.createdAt,
		});
	}

	/**
	 * Transforma una lista de registros crudos en un arreglo de entidades de dominio.
	 */
	static toDomainList(rawList: unknown): Tenant[] {
		if (!Array.isArray(rawList)) {
			// Soporta tanto respuestas tipo arreglo directo como estructuras envueltas { data: [...] }
			if (
				rawList &&
				typeof rawList === "object" &&
				"data" in rawList &&
				Array.isArray((rawList as { data: unknown }).data)
			) {
				return (rawList as { data: unknown[] }).data.map((item) =>
					TenantMapper.toDomain(item),
				);
			}
			return [];
		}

		return rawList.map((item) => TenantMapper.toDomain(item));
	}

	/**
	 * Transforma los datos de dominio al DTO de transporte que espera la API para POST /tenants.
	 */
	static toCreateDto(data: CreateTenant): CreateTenantRequestDto {
		return createTenantRequestSchema.parse({
			nitRut: data.nitRut,
			businessName: data.businessName,
			tradeName: data.tradeName || data.businessName,
			address: data.address || "",
			phone: data.phone || "",
			email: data.email,
			countryCode: data.countryCode || "COL",
			currencyCode: data.currencyCode || "COP",
			taxRegime: data.taxRegime ?? null,
		});
	}
}
