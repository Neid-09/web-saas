/**
 * Clase base unificada para todos los errores de dominio del SaaS.
 * Cualquier excepción de negocio originada en cualquier módulo (tenants, auth, pos, etc.)
 * debe heredar de esta clase para ser reconocida de forma segura por las Server Actions
 * y exponer su mensaje amigable al usuario final.
 */
export class DomainError extends Error {
	public readonly code: string;

	constructor(message: string, code = "DOMAIN_ERROR") {
		super(message);
		this.name = "DomainError";
		this.code = code;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
