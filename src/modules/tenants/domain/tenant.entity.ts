/**
 * Regímenes tributarios admitidos en la plataforma Multi-Tenant.
 */
export type TenantTaxRegime =
	| "REGIMEN_SIMPLE"
	| "RESPONSABLE_IVA"
	| "NO_RESPONSABLE_IVA"
	| "GRAN_CONTRIBUYENTE"
	| "REGIMEN_ESPECIAL";

/**
 * Datos requeridos para dar de alta una nueva empresa en el dominio.
 * Tipos TypeScript puros, libres de frameworks y librerías externas.
 */
export interface CreateTenant {
	readonly nitRut: string;
	readonly businessName: string;
	readonly tradeName: string;
	readonly address: string;
	readonly phone: string;
	readonly email: string;
	readonly countryCode?: string;
	readonly currencyCode?: string;
	readonly taxRegime?: TenantTaxRegime | null;
}

/**
 * Representación plana y serializable de una Empresa (libre de métodos y getters).
 */
export interface TenantPlain {
	readonly id: string;
	readonly nitRut: string;
	readonly businessName: string;
	readonly tradeName: string;
	readonly address: string;
	readonly phone: string;
	readonly email: string;
	readonly countryCode: string;
	readonly currencyCode: string;
	readonly taxRegime?: TenantTaxRegime | null;
	readonly isActive: boolean;
	readonly createdAt: string;
}

/**
 * Entidad de dominio pura que representa a una empresa cliente en el SaaS.
 * Cero dependencias externas (cero React, Next.js, Zod o base de datos).
 */
export class Tenant {
	readonly id: string;
	readonly nitRut: string;
	readonly businessName: string;
	readonly tradeName: string;
	readonly address: string;
	readonly phone: string;
	readonly email: string;
	readonly countryCode: string;
	readonly currencyCode: string;
	readonly taxRegime?: TenantTaxRegime | null;
	readonly isActive: boolean;
	readonly createdAt: string;

	constructor(data: TenantPlain) {
		this.id = data.id;
		this.nitRut = data.nitRut;
		this.businessName = data.businessName;
		this.tradeName = data.tradeName;
		this.address = data.address;
		this.phone = data.phone;
		this.email = data.email;
		this.countryCode = data.countryCode;
		this.currencyCode = data.currencyCode;
		this.taxRegime = data.taxRegime ?? null;
		this.isActive = data.isActive;
		this.createdAt = data.createdAt;
	}

	get displayName(): string {
		return this.tradeName.trim() || this.businessName.trim();
	}

	/**
	 * Exporta la entidad como objeto plano serializable para Server Actions / JSON.
	 */
	toPlain(): TenantPlain {
		return {
			id: this.id,
			nitRut: this.nitRut,
			businessName: this.businessName,
			tradeName: this.tradeName,
			address: this.address,
			phone: this.phone,
			email: this.email,
			countryCode: this.countryCode,
			currencyCode: this.currencyCode,
			taxRegime: this.taxRegime,
			isActive: this.isActive,
			createdAt: this.createdAt,
		};
	}
}
