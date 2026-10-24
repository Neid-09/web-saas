"use client";

import { useSession } from "@/shared/auth/session-provider";
import { getAuthorizedNavSections } from "./nav";
import { SidebarItem } from "./components/sidebar-item";

export interface SidebarProps {
	isOpenMobile?: boolean;
	onCloseMobile?: () => void;
}

export function Sidebar({
	isOpenMobile = false,
	onCloseMobile,
}: SidebarProps) {
	const { role } = useSession();

	const navSections = getAuthorizedNavSections(role);

	const handleCloseMobile = () => {
		if (onCloseMobile) {
			onCloseMobile();
		}
	};

	const handleLinkClick = () => {
		if (onCloseMobile) {
			onCloseMobile();
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === "Escape" && onCloseMobile) {
			onCloseMobile();
		}
	};

	return (
		<>
			{isOpenMobile && (
				<div
					className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
					onClick={handleCloseMobile}
					aria-hidden="true"
				/>
			)}

			<aside
				onKeyDown={handleKeyDown}
				aria-label="Panel de navegación lateral"
				className={`
					fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border-default flex flex-col shrink-0
					transition-transform duration-300 ease-in-out
					lg:static lg:z-auto lg:h-[calc(100vh-4.5rem)] lg:translate-x-0
					${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
				`}
			>
				<nav
					aria-label="Navegación principal"
					className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar"
				>
					{navSections.map((section) => (
						<section
							key={section.id}
							aria-labelledby={`nav-section-title-${section.id}`}
							className="space-y-2"
						>
							{section.title && (
								<h2
									id={`nav-section-title-${section.id}`}
									className="text-2xs font-bold tracking-wider text-text-muted uppercase px-3 py-1 font-heading"
								>
									{section.title}
								</h2>
							)}

							<ul role="list" className="space-y-1.5 list-none p-0 m-0">
								{section.items.map((item) => (
									<SidebarItem
										key={item.id}
										item={item}
										onNavigate={handleLinkClick}
									/>
								))}
							</ul>
						</section>
					))}
				</nav>
			</aside>
		</>
	);
}
