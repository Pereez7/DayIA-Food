# Reglas de pago

## Modelo y estados

Un pedido puede tener varios `PaymentAttempt`, pero como máximo un `Payment`
exitoso. El pedido expone sólo `unpaid` o `paid`; no mezcla su estado operativo
con el financiero.

Estados de `PaymentAttempt`:

| Estado | Significado | Siguiente |
|---|---|---|
| `pending` | Intento aceptado e idempotente, aún sin resultado definitivo | `succeeded`, `failed` |
| `succeeded` | El método quedó confirmado y se creó el único `Payment` | final |
| `failed` | No se confirmó cobro ni se creó `Payment` | final; puede iniciarse otro intento |

`processing`, `voided` y `refunded` no se aceptan: el primero no aporta una
garantía durable adicional; los otros requieren reversos no incluidos. Tampoco
se acepta `unknown`: en los métodos manuales del MVP la operación autoritativa
termina en éxito o fallo; perder la respuesta no vuelve incierto el estado
persistido.

## Métodos

- `cash`: éxito al validar recibido, calcular cambio y registrar atómicamente
  pago y efecto de caja;
- `manual-qr`: éxito cuando owner/cashier declara confirmación visual; referencia
  externa opcional, no prueba bancaria;
- `transfer`: misma regla manual y referencia opcional.

No hay integración bancaria ni verificación automática. Todos los métodos
requieren una `CashSession` `open` para asociar la operación al turno; sólo
efectivo incrementa el esperado de efectivo.

## Invariantes de cobro

- sólo owner o cashier activo de la organización puede cobrar;
- el pedido debe estar `confirmed`, `in-preparation` o `ready`;
- `cancelled` y `completed` rechazan cobro;
- importe del pago equivale exactamente al total histórico del pedido;
- método único por pago y una sola moneda BOB;
- una clave de idempotencia identifica el intento, no el pedido ni su número;
- igual clave e igual intención devuelve el mismo resultado;
- igual clave con datos distintos se rechaza;
- una restricción autoritativa impide dos pagos exitosos concurrentes;
- recargar el navegador consulta el intento y el pedido; nunca infiere fallo por
  falta de respuesta;
- todo éxito, fallo relevante y doble pago rechazado se audita.

## Pago mixto

`mixed_payment_status: excluded-from-mvp`.

Se excluye porque introduciría múltiples pagos exitosos por pedido, asignación por
método, reversos parciales, conciliación, reportes, UX e idempotencia adicionales.
Su utilidad no compensa ampliar el primer vertical; una fase futura deberá
replantear invariantes y pruebas antes de aprobarlo.
