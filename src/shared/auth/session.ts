import "server-only";
import { cache } from "react";
import { authUseCases } from "@/modules/auth/infrastructure/composition";
import { UserSession } from "@/modules/auth/domain/auth.types";
import { getAuthToken } from "../utils/cookies";

export const getSession = cache(async (): Promise<UserSession | null> => {
	const token = await getAuthToken();
	if (!token) {
		return null;
	}

	try {
		return await authUseCases.getCurrentUser();
	} catch {
		return null;
	}
});
