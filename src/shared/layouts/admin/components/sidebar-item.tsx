"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "../nav";

export interface SidebarItemProps {
	item: DashboardNavItem;
	onNavigate?: () => void;
}


export function SidebarItem({ item, onNavigate }: SidebarItemProps) {
	const pathname = usePathname();

	const isActive = item.isExactMatch
		? pathname === item.href
		: pathname === item.href || pathname.startsWith(`${item.href}/`);

	const Icon = item.icon;

	const handleClick = () => {
		if (onNavigate) {
			onNavigate();
		}
	};

	return (
		<li role="listitem">
			<Link
				href={item.href}
				onClick={handleClick}
				aria-current={isActive ? "page" : undefined}
				className={`
					group flex items-center justify-between p-3 rounded-xl transition-colors text-sm font-medium
					focus:outline-hidden focus:ring-2 focus:ring-brand-primary
					${
						isActive
							? "bg-brand-primary text-surface shadow-xs font-semibold"
							: "text-text-secondary hover:text-brand-primary hover:bg-subtle"
					}
				`}
			>
				<span className="flex items-center gap-3 min-w-0">
					<Icon
						className={`w-5 h-5 shrink-0 ${
							isActive
								? "text-surface"
								: "text-text-muted group-hover:text-brand-primary transition-colors"
						}`}
						aria-hidden="true"
					/>
					<span className="truncate">{item.label}</span>
				</span>

				{typeof item.badgeCount === "number" && (
					<span
						className={`
							text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ml-2
							${
								isActive
									? "bg-brand-primary-dark/60 text-surface"
									: "bg-subtle text-text-secondary group-hover:bg-border-default"
							}
						`}
					>
						{item.badgeCount}
					</span>
				)}
			</Link>
		</li>
	);
}
