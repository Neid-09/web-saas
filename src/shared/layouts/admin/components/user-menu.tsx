"use client";

import { useState, useTransition } from "react";
import { LogOut, ChevronDown, Store, ShieldCheck } from "lucide-react";
import { useSession } from "@/shared/auth/session-provider";
import { logoutAction } from "@/app/(auth)/login/actions";
import type { UserRole } from "@/modules/auth/domain/user-role";

const ROLE_LABELS: Record<UserRole, string> = {
	OWNER: "Propietario (Owner)",
	ADMIN: "Administrador",
	ACCOUNTANT: "Contador",
	WAREHOUSE_MANAGER: "Encargado de Bodega",
	CASHIER: "Cajero",
};

function getInitials(fullName?: string): string {
	if (!fullName || fullName.trim().length === 0) return "CP";
	const tokens = fullName.trim().split(/\s+/);
	if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
	return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}

export function UserMenu() {
	const { session, role } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const fullName = session?.fullName ?? "Carlos Propietario";
	const initials = getInitials(fullName);
	const roleText = role ? (ROLE_LABELS[role] ?? role) : "Propietario (Owner)";
	const branchName = session?.branchName ?? "Sucursal Principal";

	const handleToggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	const handleCloseDropdown = () => {
		setIsOpen(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			setIsOpen(false);
		}
	};

	const handleLogout = () => {
		// 1. Cierra el menú de inmediato para que su estado no persista en memoria
		setIsOpen(false);

		startTransition(async () => {
			try {
				await logoutAction();
				// 2. Redirección dura que purga el Router Cache de Next.js y reinicia toda la memoria del cliente
				window.location.replace("/login");
			} catch (error) {
				console.error("[UserMenu] Error al cerrar sesión:", error);
			}
		});
	};

	return (
		<div className="relative inline-block text-left" onKeyDown={handleKeyDown}>
			<button
				type="button"
				onClick={handleToggleDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-subtle transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-primary cursor-pointer"
			>
				{/* Avatar circular con iniciales */}
				<span className="w-9 h-9 rounded-full bg-subtle border border-border-default text-text-secondary font-semibold text-xs flex items-center justify-center shrink-0">
					{initials}
				</span>

				{/* Datos textuales: Nombre y Rol */}
				<span className="hidden sm:flex flex-col text-left">
					<span className="text-sm font-bold text-text-primary font-heading leading-tight">
						{fullName}
					</span>
					<span className="text-xs text-brand-primary font-medium flex items-center gap-1.5 leading-tight mt-0.5">
						<span
							className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0"
							aria-hidden="true"
						/>
						{roleText}
					</span>
				</span>

				<ChevronDown
					className={`w-4 h-4 text-text-muted transition-transform duration-200 hidden sm:block ${
						isOpen ? "rotate-180" : ""
					}`}
					aria-hidden="true"
				/>
			</button>

			{/* Renderizado condicional del Backdrop y Dropdown */}
			{isOpen && (
				<>
					{/* Backdrop transparente para capturar clics fuera sin listeners globales */}
					<div
						className="fixed inset-0 z-40 bg-transparent"
						onClick={handleCloseDropdown}
						aria-hidden="true"
					/>

					{/* Menú desplegable flotante */}
					<div
						role="menu"
						aria-orientation="vertical"
						className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl shadow-lg border border-border-default py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
					>
						{/* Cabecera del Dropdown */}
						<div className="px-4 py-2.5 border-b border-border-default">
							<p className="text-2xs font-bold text-text-muted uppercase tracking-wider">
								Cuenta Activa
							</p>
							<p className="text-sm font-bold text-text-primary font-heading truncate mt-0.5">
								{fullName}
							</p>
							<div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
								<ShieldCheck
									className="w-3.5 h-3.5 text-brand-primary shrink-0"
									aria-hidden="true"
								/>
								<span className="truncate">{roleText}</span>
							</div>
							<div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
								<Store className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
								<span className="truncate">{branchName}</span>
							</div>
						</div>

						{/* Opciones del Dropdown */}
						<ul role="menu" className="list-none p-1.5 m-0 space-y-0.5">
							<li role="none">
								<button
									type="button"
									role="menuitem"
									disabled={isPending}
									onClick={handleLogout}
									className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-subtle rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer"
								>
									<LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
									<span>
										{isPending ? "Cerrando sesión..." : "Cerrar Sesión"}
									</span>
								</button>
							</li>
						</ul>
					</div>
				</>
			)}
		</div>
	);
}
