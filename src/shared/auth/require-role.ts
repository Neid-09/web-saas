import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { UserRole } from "@/modules/auth/domain/user-role";
import type { UserSession } from "@/modules/auth/domain/auth.types";

export async function requireRole(
	allowedRoles: UserRole[],
	fromPath: string,
): Promise<UserSession> {
	const session = await getSession();

	if (!session) {
		const redirectParam = fromPath
			? `?redirect=${encodeURIComponent(fromPath)}`
			: "";
		redirect(`/login${redirectParam}`);
	}

	if (!allowedRoles.includes(session.role)) {
		redirect("/forbidden");
	}

	return session;
}
