import { requireRole } from "@/shared/auth/require-role";
import { rolesFor } from "@/shared/config/rbac-routes";
import { Plus } from "lucide-react";
import { TenantListTable } from "@/modules/tenants/ui/components/tenant-list-table";

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
					title="Disponible en Issue #2: Alta de Empresas"
				>
					<Plus className="w-4 h-4" />
					Nueva Empresa
				</button>
			</header>

			<TenantListTable />
		</main>
	);
}
