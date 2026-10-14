# Tipografía — UniPutumayo (ITP)

> **Fuente oficial:** Manual de Identidad Visual UNIPUTUMAYO – Versión 01-2025  
> Resolución No. 0565 del 17 de julio de 2025

---

## 1. Tipografías Primarias

Son las fuentes de la marca. Se usan para construir la identidad tipográfica institucional, títulos, submarcas y composiciones tipográficas en piezas gráficas.

### Heavitas Regular
- **Tipo:** Fuente personalizada / propietaria
- **Caracteres:** `ABCDEFGHIJKLMNÑOPQRSTUVWXYZ  1234567890 !@#$%&/()¿?`
- **Solo mayúsculas** — no dispone de caja baja
- **Adquisición:** Requiere archivos `.woff2` / `.ttf` propios de la institución
- **Uso típico:** Logotipo, encabezados de alto impacto, marca institucional

### Raleway
- **Tipo:** Fuente de Google Fonts — libre y abierta
- **Variantes institucionales:** Regular · Bold
- **Caracteres:** Mayúsculas + minúsculas + números + símbolos
- **Disponible en:** [fonts.google.com/specimen/Raleway](https://fonts.google.com/specimen/Raleway)
- **Uso típico:** Títulos, subtítulos, composiciones tipográficas, submarcas

---

## 2. Tipografías de Apoyo

Se usan para diagramación de material de promoción, publicaciones institucionales e interfaces digitales. Ofrecen mayor legibilidad en cuerpos de texto, formularios y tablas.

### Fira Sans
- **Variantes institucionales:** Regular · Bold · Italic
- **Disponible en:** [fonts.google.com/specimen/Fira+Sans](https://fonts.google.com/specimen/Fira+Sans)
- **Uso típico:** Cuerpo de texto, párrafos, interfaces densas (dashboards, tablas, formularios)

### Roboto
- **Variantes institucionales:** Regular · Bold · Italic
- **Disponible en:** [fonts.google.com/specimen/Roboto](https://fonts.google.com/specimen/Roboto)
- **Uso típico:** Interfaces digitales, apps, texto secundario, etiquetas, placeholders

---

## 3. Jerarquía de Uso

```
┌──────────────────────────────────────────────────────┐
│  NIVEL 1 — Marca e identidad                         │
│  Heavitas Regular (solo mayúsculas)                  │
├──────────────────────────────────────────────────────┤
│  NIVEL 2 — Títulos y subtítulos institucionales      │
│  Raleway Bold / Raleway Regular                      │
├──────────────────────────────────────────────────────┤
│  NIVEL 3 — Cuerpo de texto y UI                      │
│  Fira Sans Regular / Bold / Italic                   │
│  Roboto Regular / Bold / Italic                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Escala Oficial Estandarizada de Tamaños (Tailwind CSS v4)

Queda **terminantemente prohibido** utilizar clases arbitrarias con corchetes (ej. `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[32px]`). La interfaz debe utilizar exclusivamente los tokens semánticos:

| Token / Clase | Rem / Píxeles | Leading (Interlineado) | Kerning / Tracking | Rol en la Interfaz (UI Element) | Familia Obligatoria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`text-2xs`** | `0.625rem` (10px) | `leading-tight` (14px) | `tracking-widest uppercase font-bold` | Micro-badges, overlines, pills de estado | `font-body` / `font-mono` |
| **`text-xs`** | `0.75rem` (12px) | `leading-normal` (16px) | `tracking-normal` o `tracking-wider` | Badges, subtítulos breves, metadatos, captions | `font-body` / `font-mono` |
| **`text-sm`** | `0.875rem` (14px) | `leading-relaxed` (20px) | `tracking-normal` | Tablas densas, descripciones, formularios compactos | `font-body` |
| **`text-base`** | `1.00rem` (16px) | `leading-normal` (24px) | `tracking-normal` | Cuerpo general de texto, inputs principales, botones | `font-body` |
| **`text-lg`** | `1.125rem` (18px) | `leading-snug` (28px) | `tracking-tight` | Subtítulos H4, tarjetas destacadas, totales secundarios | `font-heading` / `font-mono` |
| **`text-xl`** | `1.25rem` (20px) | `leading-snug` (28px) | `tracking-tight` | Encabezados de sección H3, métricas de dashboard | `font-heading` / `font-mono` |
| **`text-2xl`** | `1.50rem` (24px) | `leading-tight` (32px) | `tracking-tight` | Títulos H2 de panel y módulos | `font-heading` |
| **`text-3xl`** | `1.875rem` (30px) | `leading-tight` (36px) | `tracking-tight font-extrabold` | Títulos principales H1 de vistas | `font-heading` |
| **`text-4xl`** | `2.25rem` (36px) | `leading-tight` (40px) | `tracking-tight font-extrabold` | Hero headers destacados, login hero | `font-heading` |
| **`text-5xl`** | `3.00rem` (48px) | `leading-none` (48px) | `tracking-tight font-extrabold` | Hero institucional, Gran Total POS mediano | `font-heading` / `font-mono` |
| **`text-6xl`** | `3.75rem` (60px) | `leading-none` (60px) | `tabular-nums font-bold` | **Gran Total POS Monumental (< 10s)** | `font-mono` |

> [!IMPORTANT]
> **Condición de Legibilidad para `text-2xs` (10px):**  
> El tamaño `text-2xs` únicamente está permitido cuando se aplique con `uppercase font-bold tracking-widest` para preservar el contraste y legibilidad según WCAG AAA. Si el texto está en caja baja o es un párrafo, el piso mínimo es **`text-xs` (12px)**.

---

## 5. Implementación en Next.js (App Router)

```tsx
// src/app/layout.tsx
import { Raleway, Fira_Sans, JetBrains_Mono } from 'next/font/google';

const raleway = Raleway({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const firaSans = Fira_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${raleway.variable} ${firaSans.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="font-body bg-canvas text-text-primary">{children}</body>
    </html>
  );
}
```

---

## 6. Configuración de Tokens `@theme` en Tailwind CSS v4

```css
/* src/app/globals.css */
@theme {
  /* Familias Google Oficiales */
  --font-heading: var(--font-heading, 'Raleway', sans-serif);
  --font-body: var(--font-body, 'Fira Sans', sans-serif);
  --font-mono: var(--font-mono, 'JetBrains Mono', monospace);

  /* Escala Extendida */
  --text-2xs: 0.625rem;
  --text-2xs--line-height: 0.875rem;

  /* Resoluciones Comerciales POS */
  --breakpoint-pos-compact: 1024px;
  --breakpoint-pos-hd: 1366px;
  --breakpoint-pos-fhd: 1920px;
}
```

---

## 7. Restricciones Absolutas

- ❌ **Cero clases arbitrarias en corchetes:** Prohibido `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[32px]`.
- ❌ No usar fuentes distintas a las oficiales (`Raleway`, `Fira Sans`, `JetBrains Mono`).
- ❌ No distorsionar, condensar ni expandir artificialmente ninguna tipografía.
- ❌ No combinar más de 2 familias tipográficas en un mismo bloque de contenido.
- ✅ En tablas y formularios densos, utilizar siempre **Fira Sans** (`font-body`).
- ✅ En cifras contables, totales, precios y cantidades, usar estrictamente **`font-mono tabular-nums`**.

