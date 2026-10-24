/**
 * Error base del dominio de empresas.
 */
export class TenantDomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TenantDomainError";
	}
}

/**
 * Se lanza cuando una empresa solicitada por su identificador no existe en el sistema.
 */
export class TenantNotFoundError extends TenantDomainError {
	constructor(identifier: string) {
		super(`La empresa con identificador "${identifier}" no fue encontrada.`);
		this.name = "TenantNotFoundError";
	}
}
