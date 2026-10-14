import { HttpAuthRepository } from './http-auth.repository';
import { loginUseCase } from '../application/login.use-case';
import { logoutUseCase } from '../application/logout.use-case';
import { getCurrentUserUseCase } from '../application/get-current-user.use-case';

/**
 * COMPOSITION ROOT ("El enchufe") del módulo de autenticación.
 * Aquí se selecciona la implementación concreta (HttpAuthRepository o InMemoryAuthRepository)
 * y se inyecta en los casos de uso puros.
 */
const authRepository = new HttpAuthRepository();

export const authUseCases = {
  login: loginUseCase(authRepository),
  logout: logoutUseCase(authRepository),
  getCurrentUser: getCurrentUserUseCase(authRepository),
};
