import { DomainError } from "@/shared/domain/domain-error";

/**
 * Error base del dominio de empresas (Tenants).
 */
export class TenantDomainError extends DomainError {
	constructor(message: string, code = "TENANT_ERROR") {
		super(message, code);
		this.name = "TenantDomainError";
	}
}

/**
 * Se lanza cuando una empresa solicitada por su identificador no existe en el sistema.
 */
export class TenantNotFoundError extends TenantDomainError {
	constructor(identifier: string) {
		super(
			`La empresa con identificador "${identifier}" no fue encontrada.`,
			"TENANT_NOT_FOUND",
		);
		this.name = "TenantNotFoundError";
	}
}

/**
 * Se lanza cuando se intenta registrar una empresa cuyo NIT o correo ya existen en el sistema (Conflicto 409).
 */
export class TenantAlreadyExistsError extends TenantDomainError {
	constructor(detail?: string) {
		super(
			detail ||
				"Ya existe una empresa registrada con ese NIT/RUT o correo electrónico.",
			"TENANT_ALREADY_EXISTS",
		);
		this.name = "TenantAlreadyExistsError";
	}
}
