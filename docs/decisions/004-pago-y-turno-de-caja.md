# ADR 004 — Pago único y turno de caja organizacional

## Contexto

Respuesta perdida, doble clic y dos cajeros concurrentes pueden duplicar cobros.
Vincular caja a navegador o usuario impediría continuidad operacional y no
representaría un turno compartido.

## Decisión

El 2026-07-29 se acepta:

- máximo un `Payment` exitoso por pedido y varios `PaymentAttempt` idempotentes
  con resultado final `succeeded` o `failed`;
- métodos: efectivo, QR manual y transferencia; pago mixto
  `excluded-from-mvp`;
- todo cobro requiere y referencia la única `CashSession` `open` de la
  organización;
- la sesión pertenece al turno organizacional, conserva quién abrió y puede ser
  usada por otros owner/cashier activos con actor por operación;
- estados `open`, `closing`, `closed`; cierre final inmutable;
- pedidos o intentos pendientes bloquean cierre y toda diferencia no cero exige
  autorización de owner.

## Alternativas

- Caja por navegador/dispositivo: reduce uso simultáneo, pero pierde continuidad
  ante recarga o cambio de terminal.
- Caja exclusiva por cajero: da responsabilidad individual, pero obliga a
  múltiples cajas abiertas y conciliación adicional.
- Múltiples pagos exitosos: habilita pago mixto, pero amplía reversos, caja,
  reportes, UX e idempotencia.

## Consecuencias

La autorización se evalúa por operación, no por posesión del navegador. La
persistencia futura deberá hacer atómicos el pago único, la caja activa y el
cierre concurrente. Reversos y devoluciones quedan fuera del MVP y requieren
decisión futura.

## Estado

accepted

## Fecha

2026-07-29
