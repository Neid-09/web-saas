# Colorimetría — UniPutumayo (ITP)

> **Fuente oficial:** Manual de Identidad Visual UNIPUTUMAYO – Versión 01-2025  
> Resolución No. 0565 del 17 de julio de 2025

---

## 1. Colores Primarios

Son los colores institucionales de la marca. Deben ser el eje cromático dominante en toda pieza de comunicación (mínimo **60% de presencia** en la composición visual).

| Nombre      | HEX       | RGB              | CMYK (impresos)                           |
|-------------|-----------|------------------|-------------------------------------------|
| **Azul**    | `#18668F` | 25, 102, 143     | C: 92.56% M: 34.1% Y: 17.08% K: 5.16%   |
| **Verde**   | `#80BF1F` | 128, 191, 31     | C: 49.85% M: 2.42% Y: 98.1% K: 0.21%    |
| **Naranja** | `#F5A51D` | 245, 165, 29     | C: 3.09% M: 33.9% Y: 86.7% K: 0.29%     |
| **Gris**    | `#595957` | 90, 90, 88       | C: 52.35% M: 39.12% Y: 39.36% K: 26.57% |

> [!NOTE]
> **Corrección documentada — Verde:** El manual original indica el HEX del verde como `#bf1f50` — valor erróneo (corresponde a rojo carmín). El HEX correcto derivado del RGB oficial `(128, 191, 31)` es `#80BF1F`. Se usa este valor en toda implementación.

> [!NOTE]
> **Corrección documentada — Naranja:** El manual indica `R:254` para el naranja — valor impreciso. El HEX `#F5A51D` se descompone como `R:245 G:165 B:29`, que es el valor correcto y coherente.

---

## 2. Colores Secundarios / Neutros

Complementan la paleta principal. **Nunca deben usarse como color principal** de una pieza. Su presencia no debe superar el **30% de la composición**.

| Nombre         | HEX       | RGB            | CMYK                    |
|----------------|-----------|----------------|-------------------------|
| **Negro**      | `#000000` | 0, 0, 0        | C: 0 M: 0 Y: 0 K: 100  |
| **Gris claro** | `#B2B6B9` | 178, 182, 185  | C: 32 M: 24 Y: 23 K: 0 |
| **Blanco**     | `#FFFFFF` | 255, 255, 255  | C: 0 M: 0 Y: 0 K: 0    |

---

## 3. Colores Extendidos para Interfaz Digital (SaaS)

Derivados coherentes de la paleta oficial para uso en interfaces digitales. No forman parte del manual impreso pero respetan la identidad.

| Nombre              | HEX       | Derivado de       | Uso en UI                                       |
|---------------------|-----------|-------------------|-------------------------------------------------|
| Azul oscuro         | `#0F4A6B` | Azul primario     | Hover states, sombras, encabezados              |
| Azul claro          | `#2A8AB8` | Azul primario     | Focus rings, estados activos, links             |
| Fondo claro         | `#F8F9FA` | Blanco secundario | Background general de interfaz (no deslumbrante)|
| Fondo oscuro (dark) | `#0F172A` | Slate profundo    | Dark mode opcional                              |

---

## 4. Semántica de Color en el Prototipo POS

> [!IMPORTANT]
> En la fase actual de prototipado (`AGENTS.md`), la paleta institucional UniPutumayo **no está activa**. Se usa paleta neutra Slate. Esta tabla es referencia para la fase de implementación productiva.

| Elemento UI             | Color institucional futuro | Color POS actual (prototipo) |
|-------------------------|----------------------------|------------------------------|
| Botón cobrar `[F9]`     | —                          | Verde esmeralda `#059669`    |
| Fiado `[F12]`           | —                          | Violeta `#7C3AED`            |
| Cancelación / anulación | —                          | Rojo `#DC2626`               |
| Color dominante         | Azul `#18668F`             | Slate neutro                 |
| Acentos positivos       | Verde `#80BF1F`            | Slate neutro                 |
| Notificaciones / alertas| Naranja `#F5A51D`          | Slate neutro                 |

---

## 5. Reglas de Uso Sobre Fondos

| Situación                    | Aplicación de la marca                                    |
|------------------------------|-----------------------------------------------------------|
| Sobre fondo de color         | Siempre en **blanco**                                     |
| Sobre fondo negro            | En **blanco**                                             |
| Sin posibilidad de color     | **Escala de grises** sin tonalidades intermedias          |
| Sobre imágenes / texturas    | Solo en ocasiones especiales con autorización expresa de Comunicaciones |

---

## 6. Tokens CSS — Implementación Next.js / Tailwind

```css
:root {
  /* ── Colores Primarios UniPutumayo ── */
  --color-primary:       #18668F;
  --color-primary-dark:  #0F4A6B;
  --color-primary-light: #2A8AB8;

  --color-secondary:     #80BF1F;
  --color-accent:        #F5A51D;
  --color-neutral:       #595957;

  /* ── Neutros / Secundarios ── */
  --color-black:         #000000;
  --color-gray-light:    #B2B6B9;
  --color-white:         #FFFFFF;
  --color-bg:            #F8F9FA;
  --color-bg-dark:       #0F172A;
}
```

```ts
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#18668F',
    dark:    '#0F4A6B',
    light:   '#2A8AB8',
  },
  secondary:    '#80BF1F',
  accent:       '#F5A51D',
  neutral:      '#595957',
  'gray-light': '#B2B6B9',
}
```

---

## 7. Restricciones Absolutas

- ❌ No usar múltiples colores saturados compitiendo en la misma pieza.
- ❌ No usar blanco puro cegador como fondo de pantalla bajo luz artificial intensa.
- ❌ No distorsionar, reordenar ni recolorear el imagotipo institucional.
- ✅ Mantener el azul `#18668F` como color dominante (≥ 60% de identidad cromática).
- ✅ Usar los colores secundarios en proporción máxima del 30%.
- ✅ Respetar siempre el área de reserva del logo (mínimo 4×).
