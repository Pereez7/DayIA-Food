# Estados conceptuales de impresión

## PrintJob

| Estado | Significado | Siguiente |
|---|---|---|
| `pending` | Intención durable pendiente de agente | `claimed`, `cancelled` |
| `claimed` | Agente posee lease temporal | `processing`, `pending`, `failed` |
| `processing` | Agente inició un intento | `submitted`, `failed`, `delivery-unknown` |
| `submitted` | Sistema operativo/driver aceptó el trabajo | final; no prueba papel físico |
| `failed` | Intentos agotados o fallo conocido sin posible entrega | `pending` mediante reintento autorizado |
| `delivery-unknown` | Puede haberse enviado, falta certeza | sólo revisión/reimpresión manual |
| `cancelled` | Trabajo aún no procesado fue anulado | final |

No se usa `succeeded` porque implicaría certeza física inexistente.

## PrintAttempt

| Estado | Significado |
|---|---|
| `started` | Agente comenzó con identidad de intento única |
| `submitted-to-os` | OS/driver aceptó la entrega |
| `failed` | Se sabe que no fue sometida |
| `unknown` | No puede saberse si fue sometida |

## Original, reintento y reimpresión

- la primera impresión es un `PrintJob` de propósito `original`;
- un reintento conserva el mismo job y añade `PrintAttempt` sólo si se sabe que
  no hubo entrega posible; antes del nuevo intento mueve `failed → pending`;
- un reintento manual conserva actor y hora: owner/cashier/kitchen para cocina,
  owner/cashier para caja; el automático tiene actor de sistema y política
  registrada;
- los reintentos automáticos se limitan a fallos anteriores a posible entrega,
  con cantidad/intervalo técnicos aún por fijar; agotarlos deja `failed`;
- una reimpresión crea otro job de propósito `reprint` que referencia el
  original, aumenta el contador derivado y exige motivo y actor;
- contenido y destino son snapshots históricos; cambios posteriores de catálogo
  o pedido no mutan un trabajo;
- la idempotencia evita crear dos originales para el mismo propósito;
- `delivery-unknown` nunca se reintenta automáticamente;
- al cancelar un pedido, un original todavía `pending` se cancela; si ya fue
  reclamado, procesado o sometido, se conserva y se crea idempotentemente un job
  de aviso de cancelación con el actor original;
- cocina continúa con la fuente de verdad aunque la impresora falle y ve alerta;
- cashier recibe alerta en fallo, desconocido o agente desconectado; una
  reimpresión requiere decisión humana;
- no se afirma impresión física hasta una verificación operacional externa.
