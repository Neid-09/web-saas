"use client";

import { Store, Menu, X } from "lucide-react";
import { useSession } from "@/shared/auth/session-provider";
import { UserMenu } from "./components/user-menu";

export interface TopbarProps {
	onToggleMobileMenu?: () => void;
	isMobileMenuOpen?: boolean;
}

export function Topbar({
	onToggleMobileMenu,
	isMobileMenuOpen = false,
}: TopbarProps) {
	const { session } = useSession();

	const tenantName = session?.tenantName ?? "FerreDemo SALA 121";

	return (
		<header className="w-full h-18 bg-surface border-b border-border-default sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
			<div className="flex items-center gap-3 sm:gap-4 min-w-0">
				<button
					type="button"
					onClick={onToggleMobileMenu}
					aria-label={
						isMobileMenuOpen ? "Cerrar menú lateral" : "Abrir menú lateral"
					}
					className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-subtle transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-primary shrink-0"
				>
					{isMobileMenuOpen ? (
						<X className="w-5 h-5" aria-hidden="true" />
					) : (
						<Menu className="w-5 h-5" aria-hidden="true" />
					)}
				</button>

				<div className="w-10 h-10 rounded-xl bg-brand-primary text-surface flex items-center justify-center shrink-0 shadow-xs">
					<Store className="w-5 h-5" aria-hidden="true" />
				</div>

				<div className="flex flex-col min-w-0">
					<span className="text-base font-bold text-text-primary font-heading leading-tight truncate">
						{tenantName}
					</span>
				</div>
			</div>

			<div className="flex items-center shrink-0">
				<UserMenu />
			</div>
		</header>
	);
}
