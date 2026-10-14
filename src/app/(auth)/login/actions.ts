"use server";

import { z } from "zod";
import { authUseCases } from "@/modules/auth/infrastructure/composition";
import {
	InvalidCredentialsError,
	AuthDomainError,
} from "@/modules/auth/domain/auth.errors";
import { safeRedirect } from "@/shared/auth/safe-redirect";

const credentialsSchema = z.object({
	email: z.email("Correo electrónico inválido"),
	password: z.string().min(1, "Contraseña es requerida"),
});

export interface LoginActionResult {
	success: boolean;
	destination?: string;
	error?: string;
}

export async function loginAction(
	credentials: unknown,
	targetRedirect?: string | null,
): Promise<LoginActionResult> {
	const parsed = credentialsSchema.safeParse(credentials);
	if (!parsed.success) return { success: false, error: "Datos inválidos" };

	try {
		const { session } = await authUseCases.login(parsed.data);
		const target = typeof targetRedirect === "string" ? targetRedirect : null;
		return { success: true, destination: safeRedirect(target, session.role) };
	} catch (error) {
		if (
			error instanceof InvalidCredentialsError ||
			error instanceof AuthDomainError
		) {
			return { success: false, error: error.message };
		}
		console.error("[loginAction]", error);
		return {
			success: false,
			error: "No se pudo iniciar sesión. Intenta de nuevo.",
		};
	}
}

export async function logoutAction(): Promise<void> {
	await authUseCases.logout();
}
