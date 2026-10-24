---
description: Reglas obligatorias para feedback, alertas, mensajes de error y notificaciones asíncronas en el SaaS y POS.
globs:
  - src/app/**/*.tsx
  - src/app/**/*.jsx
  - src/modules/**/*.tsx
  - src/modules/**/*.jsx
  - src/shared/**/*.tsx
  - src/shared/**/*.jsx
alwaysApply: true
---

# Reglas de Feedback y Notificaciones UI — Squad 4

Este documento establece las directrices obligatorias para la emisión de alertas, confirmaciones, mensajes de error y feedback transaccional en el SaaS Contable y Mostrador POS.

---

## 1. Principios de Aplicación y Ergonomía

1. **Uso Exclusivo del Componente Base Compartido:**
   * **PROHIBIDO** instalar o importar librerías externas de notificación (ej. `react-toastify`, `sonner`, `sweetalert2`, `notistack`).
   * **PROHIBIDO** crear componentes de toast duplicados o locales por funcionalidad.
   * Utilizar siempre el componente base transversal:
     ```tsx
     import { Toast } from '@/shared/ui/toast';
     ```

2. **Cero Desplazamiento de Layout (CLS = 0.00 Obligatorio):**
   * **PROHIBIDO** insertar alertas o banners dinámicos que se inserten entre títulos y campos de formularios, o dentro de la tabla de venta del POS, empujando los elementos hacia abajo (*Cumulative Layout Shift*).
   * Todo feedback de acción o error de servidor debe flotar desacoplado del flujo del DOM mediante el componente `Toast` (`fixed top-5 right-6 z-50`).

3. **Diferenciación Semántica Estricta:**
   * **Errores de validación de campo (UX local):** Se muestran inmediatamente debajo del input correspondiente en texto sutil (`text-danger mt-1 text-2xs font-medium`), consumidos desde React Hook Form (`errors.field?.message`).
   * **Errores de acción, autenticación o servidor (Eventos):** Se emiten a través de `<Toast type="error" message="..." onClose={...} />`.
   * **Confirmaciones de transacciones y guardado exitoso:** Se emiten a través de `<Toast type="success" message="..." onClose={...} />`.

---

## 2. Tipos Semánticos Disponibles en `@/shared/ui/toast`

| Tipo (`type`) | Color Semántico | Icono Lucide | Caso de Uso |
| :--- | :--- | :--- | :--- |
| **`error`** | `danger` (`#DC2626`) | `AlertCircle` | Fallos de autenticación, errores de red 500, transacciones declinadas, bloqueo de caja. |
| **`success`** | `checkout` (`#059669`) | `CheckCircle2` | Venta POS liquidada con éxito, arqueo de turno cerrado, registro o actualización guardada. |
| **`warning`** | `warning` (`#D97706`) | `AlertTriangle` | Advertencia de stock bajo, cupo fiado próximo al límite, sesión pronta a expirar. |
| **`info`** | `brand-primary` (`#18668F`) | `Info` | Apertura de caja, inicio de descarga de reporte contable, sincronización NIIF en proceso. |

---

## 3. Ejemplo de Implementación Estándar

```tsx
import React, { useState } from 'react';
import { Toast } from '@/shared/ui/toast';

export function ComponenteOperativo() {
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleOperacion = async () => {
    try {
      await ejecutarAccion();
      setToast({ type: 'success', message: 'Operación realizada correctamente.' });
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudo completar la operación. Intente de nuevo.' });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          autoCloseMs={5000}
        />
      )}
      {/* Contenido del formulario o mostrador intacto sin layout shift */}
    </>
  );
}
```
