import { Suspense } from "react";
import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { SessionProvider } from "@/shared/auth/session-provider";

async function PosAuthBoundary({ children }: { children: React.ReactNode }) {
	// Valida sesión real contra el backend de Squad 1 (/auth/me) y exige rol CASHIER
	const session = await requireRole(rolesFor("/pos"), "/pos");

	return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default function PosLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={null}>
			<PosAuthBoundary>{children}</PosAuthBoundary>
		</Suspense>
	);
}
