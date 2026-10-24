import { Suspense } from "react";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { SessionProvider } from "@/shared/auth/session-provider";
import { AdminShell } from "@/shared/layouts";

async function DashboardAuthBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	// Valida sesión real contra el backend de Squad 1 (/auth/me) y exige roles administrativos
	const session = await requireRole(rolesFor("/dashboard"), "/dashboard");

	return (
		<SessionProvider session={session}>
			<AdminShell>{children}</AdminShell>
		</SessionProvider>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={null}>
			<DashboardAuthBoundary>{children}</DashboardAuthBoundary>
		</Suspense>
	);
}
