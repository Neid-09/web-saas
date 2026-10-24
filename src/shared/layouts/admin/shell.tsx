"use client";

import { useState } from "react";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";

export interface DashboardShellProps {
	children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleToggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => !prev);
	};

	const handleCloseMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<div className="min-h-screen bg-canvas text-text-primary flex flex-col">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-surface focus:rounded-xl focus:shadow-md focus:outline-hidden"
			>
				Saltar al contenido principal
			</a>

			<Topbar
				onToggleMobileMenu={handleToggleMobileMenu}
				isMobileMenuOpen={isMobileMenuOpen}
			/>

			<div className="flex-1 flex overflow-hidden">
				<Sidebar
					isOpenMobile={isMobileMenuOpen}
					onCloseMobile={handleCloseMobileMenu}
				/>

				<main
					id="main-content"
					tabIndex={-1}
					className="flex-1 overflow-y-auto focus:outline-hidden custom-scrollbar"
				>
					{children}
				</main>
			</div>
		</div>
	);
}

/** Alias semántico preferido para el cascarón administrativo general */
export const AdminShell = DashboardShell;
export type AdminShellProps = DashboardShellProps;
