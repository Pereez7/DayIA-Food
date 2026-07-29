# Arquitectura lógica de caja y pagos

> **Reglas de dominio aceptadas — 2026-07-29.**

Las fuentes canónicas son
[`PAYMENT_RULES.md`](../domain/PAYMENT_RULES.md) y
[`CASH_SESSION_RULES.md`](../domain/CASH_SESSION_RULES.md).

## Autoridad

- `CashSession` persistida gobierna apertura, cierre y turno.
- `CashMovement` persistido gobierna ingresos y retiros.
- `PaymentAttempt` resuelve idempotencia y resultado.
- El único `Payment` exitoso gobierna `paid`.
- El navegador sólo presenta intenciones y proyecciones.

Todo recurso pertenece a la organización derivada de la sesión. Existe máximo
una caja `open` o `closing` por organización y máximo un pago exitoso por pedido.

## Apertura

Owner o cashier abre con monto inicial no negativo. La aceptación atómica
comprueba que no exista sesión activa, asigna hora servidor y registra auditoría.
Repetir la misma intención devuelve la sesión existente; una intención distinta
con caja activa choca. La sesión representa un turno compartido, no navegador,
dispositivo ni login.

## Cobro

El cobro autoritativo valida en una sola frontera:

- membresía/rol y organización;
- caja `open`;
- pedido cobrable y no pagado;
- método permitido, importe exacto y precisión;
- clave idempotente e intento previo resuelto;
- efectivo recibido suficiente y cambio exacto.

El éxito registra atómicamente intento `succeeded`, `Payment`, asociación a
caja, actor, método y movimiento de efectivo cuando corresponda. QR manual y
transferencia no alteran efectivo esperado y sólo representan confirmación
declarada, no prueba bancaria.

Dos cobros concurrentes producen un éxito como máximo. Respuesta perdida se
resuelve consultando el intento persistido. `failed` permite otro intento; el
dominio no usa `unknown` para pagos manuales. Pago mixto es
`excluded-from-mvp`.

## Movimientos y esperado

Ingresos y retiros usan importe positivo, dirección y motivo. Cashier requiere
autorización concreta de owner. El esperado es:

```text
apertura + pagos en efectivo + ingresos - retiros
```

No se permite retirar por encima del esperado. La diferencia de cierre es
`contado - esperado` y puede ser negativa.

## Cierre

`open → closing` congela cobros y movimientos. Pedidos operativos pendientes,
intentos `pending` o inconsistencia impiden finalizar. Diferencia no
cero exige owner. La finalización concurrente acepta un solo comando y hace
`closed` inmutable. Cerrar browser o sesión de usuario no cierra caja.

## Reversos

El MVP no contiene refund, void, reverso ni devolución. Por ello, un pedido con
pago exitoso no puede cancelarse. Una política futura debe definir efectos
atómicos de pago, caja, auditoría y comprobantes antes de habilitarse.

## Dirección técnica

ADR-0009/0010 fijan índices parciales, locks/versiones, session context y
autorización secundaria de un solo uso. Falta materializarlos y ejecutar carreras
reales; no modifican ADR-0004.
