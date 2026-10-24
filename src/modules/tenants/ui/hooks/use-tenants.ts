"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenantsAction } from "@/app/(dashboard)/dashboard/tenants/actions";
import { Tenant } from "../../domain/tenant.entity";

export const tenantsKeys = {
	all: ["tenants"] as const,
	lists: () => [...tenantsKeys.all, "list"] as const,
	detail: (id: string) => [...tenantsKeys.all, "detail", id] as const,
};

export function useTenants() {
	const query = useQuery({
		queryKey: tenantsKeys.lists(),
		queryFn: async (): Promise<Tenant[]> => {
			const res = await getTenantsAction();
			if (!res.success || !res.data) {
				throw new Error(res.error || "No fue posible cargar las empresas.");
			}
			return res.data.map((item) => new Tenant(item));
		},
		staleTime: 1000 * 60 * 3, // 3 minutos de caché
	});

	return {
		tenants: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ? (query.error as Error).message : null,
		refetch: query.refetch,
		isFetching: query.isFetching,
	};
}
