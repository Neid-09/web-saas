import React from 'react';

/**
 * Tarjeta lateral de bienvenida (Hero) que muestra la identidad visual
 * y la composición gráfica 3D institucional con anillos entrelazados y esfera perlada.
 */
export function LoginHeroCard() {
  return (
    <div className="w-full lg:w-1/2 xl:w-7/12 p-4 sm:p-6 lg:p-8 flex">
      <div className="w-full rounded-card-sm sm:rounded-card bg-linear-to-br from-hero-from via-hero-via to-hero-to p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden border border-surface/70 shadow-xs">
        {/* Cabecera del Hero */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="text-2xs sm:text-xs font-bold tracking-widest text-brand-primary-dark uppercase font-mono">
              Sistema Comercial Universal
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text-primary font-heading leading-tight tracking-tight">
            Todo tu comercio.
            <br />
            Un solo lugar.
          </h2>

          <p className="text-xs sm:text-sm text-text-secondary font-body max-w-sm mt-3 leading-relaxed">
            Una nueva perspectiva para gestionar lo que construyes cada día.
          </p>
        </div>

        {/* Centro: Composición Gráfica 3D (Anillos Entrelazados + Esfera Perlada) */}
        <div className="relative z-10 my-6 sm:my-10 flex items-center justify-center">
          <div className="relative w-72 sm:w-80 md:w-96 lg:w-full max-w-md aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 540 540"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Gradiente del Anillo Azul/Teal Oscuro */}
                <linearGradient
                  id="petrolRingGrad"
                  x1="30%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2A8BB0" />
                  <stop offset="25%" stopColor="#1B6D8C" />
                  <stop offset="65%" stopColor="#0E4861" />
                  <stop offset="100%" stopColor="#082A3A" />
                </linearGradient>

                {/* Sombra del Anillo Azul */}
                <filter id="petrolShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow
                    dx="0"
                    dy="22"
                    stdDeviation="18"
                    floodColor="#062D3E"
                    floodOpacity="0.45"
                  />
                </filter>

                {/* Gradiente 3D de la Esfera Perlada */}
                <radialGradient
                  id="pearlSphereGrad"
                  cx="35%"
                  cy="30%"
                  r="65%"
                  fx="30%"
                  fy="26%"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#E5EFF2" />
                  <stop offset="60%" stopColor="#A5C7D2" />
                  <stop offset="85%" stopColor="#638C9C" />
                  <stop offset="100%" stopColor="#456775" />
                </radialGradient>

                {/* Sombra de la Esfera Perlada */}
                <filter id="pearlBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <filter
                  id="pearlDropShadow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feDropShadow
                    dx="4"
                    dy="8"
                    stdDeviation="8"
                    floodColor="#072938"
                    floodOpacity="0.3"
                  />
                </filter>

                {/* Gradiente del Anillo Verde Institucional */}
                <linearGradient id="greenRingGrad" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#9BD92E" />
                  <stop offset="35%" stopColor="#80BF1F" />
                  <stop offset="75%" stopColor="#5E8F15" />
                  <stop offset="100%" stopColor="#446A0D" />
                </linearGradient>

                {/* Sombra del Anillo Verde */}
                <filter id="greenShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow
                    dx="0"
                    dy="16"
                    stdDeviation="14"
                    floodColor="#274606"
                    floodOpacity="0.38"
                  />
                </filter>
              </defs>

              {/* 1. Líneas Guía de Arquitectura / Blueprint */}
              <line
                x1="0"
                y1="270"
                x2="540"
                y2="270"
                stroke="#18668F"
                strokeOpacity="0.10"
                strokeWidth="1"
              />
              <line
                x1="240"
                y1="0"
                x2="240"
                y2="540"
                stroke="#18668F"
                strokeOpacity="0.10"
                strokeWidth="1"
              />
              <circle
                cx="240"
                cy="270"
                r="235"
                stroke="#18668F"
                strokeOpacity="0.06"
                strokeWidth="1"
                fill="none"
              />

              {/* 2. Órbita Elíptica y Satélite Blanco */}
              <ellipse
                cx="270"
                cy="270"
                rx="225"
                ry="110"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.2"
                fill="none"
                transform="rotate(-22 270 270)"
              />
              <circle cx="470" cy="242" r="3.5" fill="#FFFFFF" />

              {/* 3. Anillo Azul/Teal Principal */}
              <circle
                cx="240"
                cy="270"
                r="116"
                stroke="url(#petrolRingGrad)"
                strokeWidth="70"
                fill="none"
                filter="url(#petrolShadow)"
              />

              {/* 4. Esfera Perlada 3D */}
              <ellipse
                cx="218"
                cy="284"
                rx="24"
                ry="14"
                fill="#06222F"
                opacity="0.25"
                filter="url(#pearlBlur)"
              />
              <circle
                cx="205"
                cy="270"
                r="27"
                fill="url(#pearlSphereGrad)"
                filter="url(#pearlDropShadow)"
              />

              {/* 5. Anillo Verde Institucional Superpuesto en Primer Plano */}
              <circle
                cx="325"
                cy="325"
                r="88"
                stroke="url(#greenRingGrad)"
                strokeWidth="50"
                fill="none"
                filter="url(#greenShadow)"
              />
            </svg>
          </div>
        </div>

        {/* Pie de la Tarjeta Hero */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-brand-primary-dark/10">
          <span className="text-2xs sm:text-xs font-bold tracking-widest text-brand-primary-dark uppercase font-mono">
            Comercial / Punto de Venta
          </span>

          {/* Widget indicador inferior derecho */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-dark" />
            <span className="w-6 h-0.5 bg-brand-primary-dark/40 rounded-full" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
