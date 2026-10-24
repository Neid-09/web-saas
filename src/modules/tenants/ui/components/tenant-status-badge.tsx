interface TenantStatusBadgeProps {
	isActive: boolean;
}

export function TenantStatusBadge({ isActive }: TenantStatusBadgeProps) {
	if (isActive) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-heading bg-checkout/10 text-checkout border border-checkout/20">
				<span className="w-1.5 h-1.5 rounded-full bg-checkout" aria-hidden="true" />
				Activa
			</span>
		);
	}

	return (
		<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-heading bg-subtle text-text-muted border border-border-default">
			<span className="w-1.5 h-1.5 rounded-full bg-text-muted" aria-hidden="true" />
			Inactiva
		</span>
	);
}
