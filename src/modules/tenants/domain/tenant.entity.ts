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
 * Propiedades inmutables de la entidad Tenant.
 */
export interface TenantProps {
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

	constructor(props: TenantProps) {
		this.id = props.id;
		this.nitRut = props.nitRut;
		this.businessName = props.businessName;
		this.tradeName = props.tradeName;
		this.address = props.address;
		this.phone = props.phone;
		this.email = props.email;
		this.countryCode = props.countryCode;
		this.currencyCode = props.currencyCode;
		this.taxRegime = props.taxRegime ?? null;
		this.isActive = props.isActive;
		this.createdAt = props.createdAt;
	}

	get displayName(): string {
		return this.tradeName.trim() || this.businessName.trim();
	}
}
