import { AuthRepository } from '../domain/auth.repository';
import { LoginCredentials, LoginResult } from './auth.types';

/**
 * Caso de uso: Autenticación de usuario comercial.
 * Recibe el puerto por inyección de dependencias (currying).
 * Regla: TypeScript puro, cero React, cero Next.js.
 */
export const loginUseCase =
  (repo: AuthRepository) =>
  async (credentials: LoginCredentials): Promise<LoginResult> => {
    return repo.login(credentials);
  };
