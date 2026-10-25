import { DomainError } from "@/shared/domain/domain-error";

/**
 * Errores de dominio del módulo de autenticación.
 */
export class AuthDomainError extends DomainError {
	constructor(message: string, code = "AUTH_ERROR") {
		super(message, code);
		this.name = "AuthDomainError";
	}
}

export class InvalidCredentialsError extends AuthDomainError {
	constructor(message = "Las credenciales proporcionadas no son válidas.") {
		super(message, "INVALID_CREDENTIALS");
		this.name = "InvalidCredentialsError";
	}
}
