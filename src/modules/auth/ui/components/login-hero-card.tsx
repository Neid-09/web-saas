import React from 'react';
import { Smartphone, Zap, Store, ShieldCheck } from 'lucide-react';

/**
 * Tarjeta de bienvenida (Hero) institucional.
 * Diseñada para adaptarse de forma fluida a cualquier dispositivo:
 * - Móviles / Tablets: Se presenta como bloque de bienvenida superior sin recortes.
 * - Escritorio / POS: Se estira como columna lateral izquierda de alto impacto.
 * 
 * Reglas de diseño aplicadas:
 * - Cero clases arbitrarias de altura fija (cero corchetes).
 * - Eje cromático dominante: Azul primario institucional (≥60% de presencia).
 * - Acentos: Verde institucional (#80BF1F) y blanco puro (WCAG AAA).
 */
export function LoginHeroCard() {
  const features = [
    {
      title: 'Liquidación en mostrador en menos de 10s',
      icon: Zap,
    },
    {
      title: 'Control multi-sucursal y multi-caja en tiempo real',
      icon: Store,
    },
    {
      title: 'Contabilidad NIIF y trazabilidad de crédito',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-full flex flex-col justify-between rounded-card-sm sm:rounded-card bg-brand-primary bg-linear-to-b from-brand-primary to-brand-primary-dark p-6 sm:p-8 lg:p-12 xl:p-14 relative overflow-hidden shadow-2xl self-stretch">
      {/* ── CABECERA DEL HERO: BADGE INSTITUCIONAL UNIPUTUMAYO ── */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
          <Smartphone className="w-4 h-4 text-brand-secondary shrink-0" strokeWidth={2.5} />
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide font-heading">
            UniPutumayo
          </span>
        </div>
      </div>

      {/* ── MENSAJE PRINCIPAL DESTILADO (RESPONSIVO EN MÓVIL Y DESKTOP) ── */}
      <div className="relative z-10 my-auto py-6 sm:py-8 lg:py-10">
        <div className="max-w-md">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white font-heading leading-tight tracking-tight">
            Tu comercio,
            <br />
            un buen comienzo.
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-white/80 font-body mt-3 lg:mt-4 leading-relaxed">
            Gestiona tus comercios y puntos de venta desde un solo lugar.
          </p>
        </div>

        {/* ── 3 PUNTOS CLAVE DE ESCANEO RÁPIDO ── */}
        <div className="mt-6 sm:mt-8 space-y-3 max-w-md">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-white/90"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-brand-secondary">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-secondary" strokeWidth={2.4} />
                </div>
                <span className="text-xs sm:text-sm font-medium font-body tracking-normal">
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PIE DEL HERO: INDICADOR DE IDENTIDAD Y LÍNEA DE ANCLAJE ── */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <div className="w-10 h-1.5 bg-brand-secondary rounded-full" />
        <span className="text-2xs font-mono tracking-widest text-white/60 uppercase">
          Sistema Comercial Universal
        </span>
      </div>
    </aside>
  );
}
