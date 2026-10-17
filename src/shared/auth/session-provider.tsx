"use client";

import { createContext, useContext } from "react";
import type { UserSession } from "@/modules/auth/domain/auth.types";
import type { UserRole } from "@/modules/auth/domain/user-role";

interface SessionContextValue {
	session: UserSession | null;
	role: UserRole | undefined;
	isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(
	undefined,
);

export function SessionProvider({
	session,
	children,
}: {
	session: UserSession | null;
	children: React.ReactNode;
}) {
	const value: SessionContextValue = {
		session,
		role: session?.role,
		isAuthenticated: Boolean(session),
	};

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
}

export function useSession(): SessionContextValue {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession debe utilizarse dentro de un SessionProvider");
	}
	return context;
}
