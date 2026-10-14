/**
 * Errores de dominio del módulo de autenticación.
 */
export class AuthDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthDomainError';
  }
}

export class InvalidCredentialsError extends AuthDomainError {
  constructor(message = 'Las credenciales proporcionadas no son válidas.') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}
