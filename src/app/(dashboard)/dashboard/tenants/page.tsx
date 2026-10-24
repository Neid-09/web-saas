import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { Building2, Plus, Sparkles } from "lucide-react";

export default async function TenantsPage() {
	// Garantiza autorización estricta en el servidor para rol OWNER
	await requireRole(rolesFor("/dashboard/tenants"), "/dashboard/tenants");

	return (
		<main className="p-6 sm:p-8 space-y-6">
			<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
						Directorio de Empresas (Tenants)
					</h1>
					<p className="text-sm text-text-muted font-body mt-1">
						Supervisión de empresas registradas, parametrización fiscal y asignación de administradores.
					</p>
				</div>

				<button
					type="button"
					disabled
					className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary/60 text-white text-sm font-semibold font-heading cursor-not-allowed shrink-0"
					title="Disponible en la siguiente fase de implementación"
				>
					<Plus className="w-4 h-4" />
					Nueva Empresa
				</button>
			</header>

			<section
				aria-label="Estado del directorio de empresas"
				className="p-8 bg-surface border border-border-default rounded-2xl text-center space-y-4"
			>
				<div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
					<Building2 className="w-6 h-6" />
				</div>
				<div className="max-w-md mx-auto space-y-1.5">
					<h2 className="text-base font-semibold font-heading text-text-primary flex items-center justify-center gap-2">
						Infraestructura Base Conectada
						<Sparkles className="w-4 h-4 text-brand-primary" />
					</h2>
					<p className="text-sm text-text-muted font-body">
						La ruta y las políticas de seguridad RBAC han sido verificadas exitosamente. Lista para recibir la capa de dominio e integración con <code className="font-mono text-xs bg-subtle px-1.5 py-0.5 rounded">GET /api/v1/tenants</code>.
					</p>
				</div>
			</section>
		</main>
	);
}
