---
description: Reglas obligatorias para interacción declarativa en React, prohibición estricta de useEffect para interacciones de UI, modales, menús y sincronización de estado.
globs: "src/app/**/*.{tsx,jsx}, src/modules/**/*.{tsx,jsx}, src/shared/**/*.{tsx,jsx}"
alwaysApply: true
---

# Reglas de React Declarativo y Cero `useEffect` en UI — Squad 4

Este documento establece las directrices obligatorias de diseño declarativo en React 19 para el SaaS Comercial, Backoffice Administrativo y Mostrador POS.

---

## 1. Principio Fundamental: "You Might Not Need an Effect"

En este proyecto se prohíbe el uso de `useEffect` para gestionar interacciones de interfaz de usuario, flujos de modales, menús desplegables o sincronizaciones de estado.

> **Regla de Oro:**  
> `useEffect` existe **única y exclusivamente para sincronizar con sistemas externos a React**. Toda interacción de usuario (clics, teclas, aperturas, cierres, reseteos de formularios y cálculos) debe resolverse de forma **puramente declarativa mediante el ciclo de vida y los eventos sintéticos nativos de React**.

---

## 2. Modales, Dropdowns y Popovers (Cierre y Teclado)

### ❌ Anti-Patrón Prohibido: Listeners globales en `window` / `document`
```tsx
// ❌ PROHIBIDO: Provoca memory leaks, efectos innecesarios y código imperativo
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') setIsOpen(false);
  }
  function handleClickOutside(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
  }
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);
```

### ✅ Patrón Correcto y Obligatorio: Backdrop Declarativo y Eventos Sintéticos
1. **Clic afuera:** Renderizar condicionalmente una capa superpuesta (*Backdrop*) con `onClick`:
   ```tsx
   {isOpen && (
     <>
       {/* Backdrop invisible o translúcido que intercepta el clic de forma declarativa */}
       <div
         className="fixed inset-0 z-40 bg-transparent"
         onClick={() => setIsOpen(false)}
         aria-hidden="true"
       />

       {/* Panel desplegable posicionado por encima (z-50) */}
       <div role="menu" className="absolute right-0 mt-2 z-50 ...">
         ...
       </div>
     </>
   )}
   ```
2. **Tecla Escape:** Interceptar la tecla directamente en el contenedor mediante el evento sintético de React (`onKeyDown`):
   ```tsx
   <div
     className="relative inline-block"
     onKeyDown={(e) => {
       if (e.key === "Escape") setIsOpen(false);
     }}
   >
     ...
   </div>
   ```

---

## 3. Reseteo de Formularios en Diálogos y Modales

### ❌ Anti-Patrón Prohibido: Sincronización manual de reseteo con `useEffect`
```tsx
// ❌ PROHIBIDO: Causa renders en cascada (renderiza estado viejo y luego resetea)
useEffect(() => {
  if (abierto) {
    reset();
    setStep(1);
  }
}, [abierto]);
```

### ✅ Patrón Correcto y Obligatorio: "Resetting state by unmounting"
Aprovechar el ciclo de vida natural de desmontaje de React:
```tsx
export function AsignarMateriaModal(props: ModalProps) {
  // Cuando abierto es false, el hijo NO existe en el Virtual DOM
  if (!props.abierto) return null;

  // Al abrirse, se monta desde cero con sus valores iniciales limpios
  return <AsignarMateriaDialog {...props} />;
}
```
* **Beneficio:** Cero re-renders en cascada, cero `useEffect`, inicialización 100% limpia garantizada por el reconciliador de React.

---

## 4. Estado Derivado y Transformación de Datos

### ❌ Anti-Patrón Prohibido: Estado espejo sincronizado con `useEffect`
```tsx
// ❌ PROHIBIDO: Estado redundante y desfasado por 1 render
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter((item) => item.isActive));
}, [items]);
```

### ✅ Patrón Correcto y Obligatorio: Cálculo directo en el Render o `useMemo`
```tsx
// ✅ CORRECTO: Se calcula en tiempo de render, siempre síncrono y libre de efectos
const activeItems = useMemo(
  () => items.filter((item) => item.isActive),
  [items]
);
```

---

## 5. Tabla Resumen: Anti-Patrones vs. Patrón Obligatorio

| Necesidad | ❌ Prohibido (`useEffect`) | ✅ Obligatorio (React Declarativo) |
| :--- | :--- | :--- |
| **Detectar clic afuera** | `document.addEventListener('mousedown')` | Backdrop declarativo `<div className="fixed inset-0 z-40" onClick={close} />` |
| **Detectar tecla Escape** | `window.addEventListener('keydown')` | Evento sintético `onKeyDown={(e) => e.key === 'Escape' && close()}` |
| **Resetear modal al abrir** | `useEffect(() => { if (open) reset() }, [open])` | Desmontaje natural: `if (!open) return null; return <Dialog />` |
| **Filtrar o calcular listas**| `useEffect(() => setFiltered(...), [deps])` | Cálculo directo en render o `useMemo(() => ..., [deps])` |

---

## 6. Únicas Excepciones Válidas para `useEffect`

El uso de `useEffect` queda estrictamente restringido a los siguientes escenarios de **sistemas externos reales**:
1. Conexión y suscripción a canales WebSocket, Server-Sent Events (SSE) o polling de red en tiempo real.
2. Integración con APIs de periféricos físicos del POS no soportadas por React (puerto serie Web Serial API para báscula de peso, WebUSB para lector de huella o impresoras térmicas ESC/POS).
3. Montaje de librerías imperativas de canvas o gráficos (ej. Chart.js) que requieran manipulación de contexto 2D directo.
4. Temporizadores nativos periódicos (`setInterval`) que dependan del reloj del sistema.

---

## 7. Extracción Obligatoria de Manejadores de Eventos (Named Handlers)

Para garantizar un JSX limpio, legible y auto-documentado:
* **PROHIBIDO** incrustar funciones flecha anónimas inline en las propiedades de eventos JSX (`onClick={() => ...}`, `onKeyDown={(e) => ...}`).
* **OBLIGATORIO** extraer la lógica de interacción en funciones nombradas (`handle<Acción>`) antes del bloque `return`:

```tsx
// ❌ PROHIBIDO: Funciones anónimas inline que saturan el JSX
<button onClick={() => setIsOpen((prev) => !prev)}>Toggle</button>
<div onClick={() => setIsOpen(false)} />
<div onKeyDown={(e) => { if (e.key === 'Escape') setIsOpen(false); }} />

// ✅ CORRECTO: Handlers explícitos y declarativos
const handleToggleDropdown = () => {
  setIsOpen((prev) => !prev);
};

const handleCloseDropdown = () => {
  setIsOpen(false);
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key === 'Escape') {
    setIsOpen(false);
  }
};

return (
  <div onKeyDown={handleKeyDown}>
    <button type="button" onClick={handleToggleDropdown}>Toggle</button>
    {isOpen && <div onClick={handleCloseDropdown} />}
  </div>
);
```
