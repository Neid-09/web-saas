"use server";

import { z } from "zod";
import { authUseCases } from "@/modules/auth/infrastructure/composition";
import { safeRedirect } from "@/shared/auth/safe-redirect";
import { handleActionError, ActionResult } from "@/shared/utils/action-error";

const credentialsSchema = z.object({
	email: z.email("Correo electrónico inválido"),
	password: z.string().min(1, "Contraseña es requerida"),
});

export interface LoginActionResult extends ActionResult {
	destination?: string;
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
		return handleActionError(
			error,
			"loginAction",
			"No se pudo iniciar sesión. Intenta de nuevo.",
		);
	}
}

export async function logoutAction(): Promise<void> {
	await authUseCases.logout();
}
