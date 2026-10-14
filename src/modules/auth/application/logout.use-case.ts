import { AuthRepository } from '../domain/auth.repository';

/**
 * Caso de uso: Cierre de sesión y revocación local.
 */
export const logoutUseCase =
  (repo: AuthRepository) =>
  async (): Promise<void> => {
    return repo.logout();
  };
