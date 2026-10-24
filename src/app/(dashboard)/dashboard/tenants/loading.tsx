/**
 * Skeleton de carga del directorio de empresas.
 * Mantiene la altura y proporciones de la tabla para CLS = 0.
 */
export default function TenantsLoading() {
	return (
		<main
			role="status"
			aria-label="Cargando directorio de empresas"
			className="p-6 sm:p-8 space-y-6 animate-pulse"
		>
			<span className="sr-only">Cargando empresas registradas...</span>

			{/* Cabecera */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-2">
					<div className="h-7 w-64 bg-subtle rounded-xl" />
					<div className="h-4 w-96 max-w-full bg-subtle rounded-lg" />
				</div>
				<div className="h-10 w-36 bg-subtle rounded-lg shrink-0" />
			</div>

			{/* Tarjeta de contenedor de tabla */}
			<div className="bg-surface border border-border-default rounded-2xl p-6 space-y-4">
				<div className="h-4 w-48 bg-subtle rounded-md" />
				<div className="space-y-3 pt-2">
					{[1, 2, 3, 4].map((rowIndex) => (
						<div
							key={rowIndex}
							className="h-14 bg-subtle/60 rounded-xl w-full flex items-center justify-between px-4"
						>
							<div className="h-4 w-40 bg-subtle rounded-md" />
							<div className="h-4 w-28 bg-subtle rounded-md hidden sm:block" />
							<div className="h-6 w-20 bg-subtle rounded-md" />
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
