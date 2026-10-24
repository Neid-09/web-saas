import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { getSession } from "@/shared/auth/session";

export default async function DashboardPage() {
	const session = await getSession();
	const isOwner = session?.role === "OWNER";

	if (!isOwner) {
		return (
			<main className="p-6 sm:p-8 space-y-6">
				<header>
					<h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
						Panel de Gestión Comercial
					</h1>
					<p className="text-sm text-text-muted font-body mt-1">
						Administración operativa de la empresa.
					</p>
				</header>

				<section
					aria-label="Estado del panel de administración"
					className="p-6 sm:p-8 bg-surface border border-border-default rounded-2xl space-y-3"
				>
					<div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
						<Briefcase className="w-5 h-5" />
					</div>
					<h2 className="text-base font-semibold font-heading text-text-primary">
						Bienvenido al Panel de Administración
					</h2>
					<p className="text-sm text-text-muted font-body max-w-xl">
						Tu rol gerencial ha sido validado en la sesión activa. Los módulos operativos de sucursales, personal y ventas se irán habilitando en la navegación conforme sean desplegados en el sistema.
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className="p-6 sm:p-8 space-y-8">
			<header>
				<h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
					Panel de Control de la Plataforma
				</h1>
				<p className="text-sm text-text-muted font-body mt-1">
					Supervisión global multi-tenant y gobierno de empresas en el ecosistema SaaS.
				</p>
			</header>

			<section
				aria-label="Resumen de la plataforma"
				className="grid grid-cols-1 sm:grid-cols-3 gap-4"
			>
				<div className="p-5 bg-surface border border-border-default rounded-xl">
					<span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
						Gobernanza
					</span>
					<p className="text-2xl font-bold font-mono tabular-nums text-text-primary mt-2">
						Multi-Tenant
					</p>
					<p className="text-xs text-text-muted mt-1 font-body">
						Gestión centralizada de organizaciones
					</p>
				</div>

				<div className="p-5 bg-surface border border-border-default rounded-xl">
					<span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
						Rol Activo
					</span>
					<p className="text-2xl font-bold font-heading text-brand-primary mt-2 flex items-center gap-2">
						<ShieldCheck className="w-6 h-6" />
						SUPER OWNER
					</p>
					<p className="text-xs text-text-muted mt-1 font-body">
						Autoridad máxima del sistema
					</p>
				</div>

				<div className="p-5 bg-surface border border-border-default rounded-xl">
					<span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
						Acceso Exclusivo
					</span>
					<p className="text-2xl font-bold font-mono tabular-nums text-text-primary mt-2">
						Tenants & RBAC
					</p>
					<p className="text-xs text-text-muted mt-1 font-body">
						Alta de empresas y designación de administradores
					</p>
				</div>
			</section>

			<section
				aria-label="Módulo principal de empresas"
				className="p-6 bg-surface border border-border-default rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
			>
				<div className="space-y-1">
					<div className="flex items-center gap-2 text-brand-primary">
						<Building2 className="w-5 h-5" />
						<h2 className="text-base sm:text-lg font-bold font-heading text-text-primary">
							Directorio de Empresas (Tenants)
						</h2>
					</div>
					<p className="text-sm text-text-muted font-body max-w-xl">
						Consulte todas las empresas registradas, configure sus datos fiscales y designe al primer Administrador General de cada una.
					</p>
				</div>

				<Link
					href="/dashboard/tenants"
					className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors shrink-0"
				>
					Gestionar Empresas
					<ArrowRight className="w-4 h-4" />
				</Link>
			</section>
		</main>
	);
}
