import { AuthRepository } from '../domain/auth.repository';
import { UserSession } from '../domain/auth.types';

/**
 * Caso de uso: Consulta del perfil del usuario actualmente autenticado.
 */
export const getCurrentUserUseCase =
  (repo: AuthRepository) =>
  async (): Promise<UserSession> => {
    return repo.getCurrentUser();
  };
