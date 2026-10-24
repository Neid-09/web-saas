/**
 * Skeleton de carga del App Router para el Dashboard administrativo.
 * Mantiene exactamente las dimensiones del lienzo operativo para asegurar CLS = 0.
 */
export default function DashboardLoading() {
	return (
		<div
			role="status"
			aria-label="Cargando contenido del panel administrativo"
			className="p-6 sm:p-8 space-y-8 animate-pulse"
		>
			<span className="sr-only">Cargando información del panel...</span>

			{/* Cabecera de página (Título y Subtítulo) */}
			<div className="space-y-2">
				<div className="h-7 w-72 bg-subtle rounded-xl" />
				<div className="h-4 w-96 max-w-full bg-subtle rounded-lg" />
			</div>

			{/* Cuadrícula de Tarjetas de Métricas (Simulando wireframe) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
				{[1, 2, 3].map((cardIndex) => (
					<div
						key={cardIndex}
						className="bg-surface border border-border-default rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs"
					>
						<div className="flex items-center justify-between">
							<div className="h-3.5 w-28 bg-subtle rounded-md" />
							<div className="w-8 h-8 rounded-lg bg-subtle" />
						</div>
						<div className="h-8 w-16 bg-subtle rounded-lg" />
						<div className="h-3 w-36 bg-subtle rounded-md" />
					</div>
				))}
			</div>

			{/* Sección de Directorio / Tarjetas de Contenido */}
			<div className="space-y-4 pt-2">
				<div className="h-4 w-44 bg-subtle rounded-md" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
					{[1, 2].map((dirIndex) => (
						<div
							key={dirIndex}
							className="bg-surface border border-border-default rounded-2xl p-6 space-y-4 shadow-2xs"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-subtle shrink-0" />
								<div className="space-y-1.5 flex-1">
									<div className="h-4 w-32 bg-subtle rounded-md" />
									<div className="h-3 w-24 bg-subtle rounded-md" />
								</div>
							</div>
							<div className="space-y-2 pt-2 border-t border-border-default">
								<div className="h-3 w-48 bg-subtle rounded-md" />
								<div className="h-3 w-32 bg-subtle rounded-md" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
