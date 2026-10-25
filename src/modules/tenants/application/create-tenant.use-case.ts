import { Tenant, CreateTenant } from "../domain/tenant.entity";
import { TenantRepositoryPort } from "../domain/tenant.repository";

/**
 * Caso de uso puro: Dar de alta una nueva empresa en el SaaS Multi-Tenant.
 * Inyección de dependencias a través del puerto del repositorio.
 * Cero dependencias externas (cero React, Next.js, Zod o librerías de transporte).
 */
export function createTenantUseCase(tenantRepository: TenantRepositoryPort) {
	return async (data: CreateTenant): Promise<Tenant> => {
		if (!data.nitRut || !data.nitRut.trim()) {
			throw new Error("El NIT o RUT de la empresa es obligatorio.");
		}

		if (!data.businessName || !data.businessName.trim()) {
			throw new Error("La razón social de la empresa es obligatoria.");
		}

		if (!data.email || !data.email.trim()) {
			throw new Error("El correo electrónico corporativo es obligatorio.");
		}

		const sanitizedData: CreateTenant = {
			...data,
			nitRut: data.nitRut.trim(),
			businessName: data.businessName.trim(),
			tradeName: (data.tradeName || data.businessName).trim(),
			address: (data.address || "").trim(),
			phone: (data.phone || "").trim(),
			email: data.email.trim().toLowerCase(),
			countryCode: (data.countryCode || "COL").trim().toUpperCase(),
			currencyCode: (data.currencyCode || "COP").trim().toUpperCase(),
			taxRegime: data.taxRegime ?? null,
		};

		return tenantRepository.create(sanitizedData);
	};
}
