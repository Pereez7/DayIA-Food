# Estados y transiciones de pedido

## Estado no persistido

`draft` es el carrito editable del cliente. No es un `Order`, no recibe número
visible ni aparece en cocina. Si la validación falla, se rechaza la confirmación y
se conserva como propuesta corregible; no se crea un pedido `rejected`.

## Estados persistidos

| Estado | Significado | Actor de entrada | Datos/efectos | ¿Imprimir? | ¿Cobrar? | ¿Cancelar? | Anteriores | Siguientes |
|---|---|---|---|---|---|---|---|---|
| `confirmed` | Pedido válido aceptado y visible para cocina | owner, cashier | snapshots, total, número, historial y comanda original | sí | sí | sí, según política | ninguno | `in-preparation`, `cancelled` |
| `in-preparation` | Cocina inició producción | kitchen, owner | historial y actualización de proyección | reimpresión | sí | owner o cashier con autorización de owner | `confirmed` | `ready`, `cancelled` |
| `ready` | Producción finalizada; pendiente de entrega | kitchen, owner | historial y aviso operativo | reimpresión | sí | owner o cashier autorizado, si no está pagado | `in-preparation` | `completed`, `cancelled` |
| `completed` | Pedido pagado y entregado al cliente | cashier, owner | requiere `Payment` exitoso; historial final | comprobante/reimpresión | ya pagado | no | `ready` | ninguno |
| `cancelled` | Pedido retenido como histórico, sin continuar | actor permitido por política | motivo, historial, auditoría y aviso a cocina | aviso/reimpresión histórica | no | ya cancelado | `confirmed`, `in-preparation`, `ready` | ninguno |

## Matriz completa

| Desde \ hacia | confirmed | in-preparation | ready | completed | cancelled |
|---|---:|---:|---:|---:|---:|
| confirmed | — | allow | deny | deny | conditional |
| in-preparation | deny | — | allow | deny | owner-authorized |
| ready | deny | deny | — | conditional | owner-authorized |
| completed | deny | deny | deny | — | deny |
| cancelled | deny | deny | deny | deny | — |

`conditional` significa:

- `confirmed → cancelled`: owner siempre; cashier sólo si no hay pago y cocina
  aún no inició;
- `owner-authorized`: owner ejecuta directamente o cashier ejecuta el comando
  concreto con autorización secundaria de owner, conservando ambos actores;
- `ready → completed`: pago exitoso confirmado y entrega ejecutada;
- toda cancelación exige motivo no vacío y pedido sin pago exitoso.

No existe reapertura ni transición hacia atrás. Todo comando se evalúa contra el
estado autoritativo y registra intento rechazado cuando es sensible.

## Reglas operativas resueltas

- Confirmar envía el pedido a la proyección de cocina; no existe un estado
  redundante `sent-to-kitchen`.
- Puede llegar a cocina sin estar cobrado. El estado de pago se proyecta como
  `unpaid` o `paid`, separado del estado operativo.
- Un pedido confirmado es inmutable en líneas, cantidades, observaciones y
  precios. Una corrección exige cancelar, si la política lo permite, y crear uno
  nuevo.
- `ready` significa preparado; `completed` significa pagado y entregado.
- Un pedido inválido no se persiste. Un pedido confirmado nunca se elimina.
- Un pedido `ready` no se reabre. Un error se trata como incidente auditado.
- La impresión no gobierna el ciclo: un fallo no revierte la confirmación y una
  impresión previa no impide una cancelación permitida.

## Cancelación formal

| Situación | Resultado |
|---|---|
| Propuesta no confirmada | Se descarta; no existe pedido que cancelar |
| Confirmado, no iniciado, no pagado | Owner o cashier; motivo obligatorio |
| En preparación, no pagado | Owner o cashier con autorización secundaria de owner; motivo y aviso visible en cocina |
| Listo, no pagado ni entregado | Owner o cashier con autorización secundaria de owner; motivo obligatorio |
| Con pago exitoso | Cancelación bloqueada: reversos y devoluciones no pertenecen al MVP |
| Pagado y entregado | Pedido final; no se cancela ni reabre |
| Ya impreso o impresión parcial | Se conserva lo impreso y se crea aviso de cancelación; un original aún `pending` se cancela, nunca se borra historia |
| Creado por error | Sigue las reglas del estado actual; no es excepción |

El MVP no incluye `void`, reverso ni devolución. Un pago confirmado obliga a
conservar el pedido y escalar cualquier corrección a un proceso futuro.
