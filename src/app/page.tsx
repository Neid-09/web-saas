import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/session";
import { ROLE_HOME_REDIRECT } from "@/shared/config/rbac-routes";

async function HomeRedirect() {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	const homeRoute = ROLE_HOME_REDIRECT[session.role] || "/dashboard";
	redirect(homeRoute);
	return null;
}

export default function HomePage() {
	return (
		<Suspense fallback={null}>
			<HomeRedirect />
		</Suspense>
	);
}
