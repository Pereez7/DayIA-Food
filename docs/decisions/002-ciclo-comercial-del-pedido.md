# ADR 002 — Ciclo comercial del pedido

## Contexto

El restaurante necesita enviar producción a cocina antes o después del cobro,
corregir errores sin perder historia y distinguir preparación, pago y entrega.
Estados redundantes o edición posterior a confirmación aumentarían concurrencia,
impresión, reversos y ambigüedad.

## Decisión

El 2026-07-29 se acepta:

- `draft` no es un pedido persistido;
- el pedido usa `confirmed`, `in-preparation`, `ready`, `completed` y
  `cancelled`;
- confirmar lo hace visible en cocina, incluso sin pago;
- líneas, precios y observaciones quedan inmutables al confirmar;
- `completed` significa pagado y entregado;
- un pedido pagado no puede cancelarse porque el MVP no incluye reversos ni
  devoluciones.

## Alternativas

- Cobrar antes de cocina: simplifica deuda, pero bloquea el flujo comercial
  aprobado y manejo de consumo preparado.
- Estado adicional `sent-to-kitchen`: refleja transporte, pero confunde un hecho
  de proyección/impresión con el ciclo del pedido.
- Editar confirmado: mejora corrección rápida, pero exige versionar cocina,
  precios, impresiones, pagos y anulaciones parciales.

## Consecuencias

Preparación y pago son ejes separados. Las correcciones usan cancelación
autorizada y nuevo pedido. Impresión nunca gobierna el estado. Hasta diseñar un
modelo de reversos, un pago erróneo es incidente operativo y no cancelación.

## Estado

accepted

## Fecha

2026-07-29

