# Límites transaccionales

## Política

Fastify abre una transacción PostgreSQL, fija contexto autorizado y aplica todos
los writes de dominio, auditoría e intención `outbox` antes de commit. Si un
componente obligatorio falla, se revierte todo. Realtime, email, agente y
hardware ocurren después; nunca participan en una transacción distribuida.

El nivel normal es `READ COMMITTED` con locks explícitos y constraints. Flujos con
predicados de unicidad complejos pueden usar `SERIALIZABLE`; errores de
serialización/deadlock se reintentan de forma acotada con la misma clave
idempotente.

## Operaciones

| Operación | Lecturas/bloqueos | Writes atómicos | Si falla una parte |
|---|---|---|---|
| Confirmar pedido | membership, catálogo/versiones, idempotencia, contador diario | pedido, líneas/snapshots, número, history, audit, print job original, outbox | no pedido, número ni job; retry misma clave |
| Asignar número | fila org+fecha bloqueada | incrementar contador + order | rollback conjunto; unique final |
| Registrar snapshot | catálogo vigente leído | items/modifiers y totales exactos | confirmación completa revierte |
| Registrar historial | order bloqueado/versionado | state + history + audit + outbox | transición no cambia |
| Crear print original | order confirmado | job unique por purpose + audit | confirmación revierte si job original es obligatorio |
| Cobrar | order, caja e idempotencia bloqueados | attempt succeeded, payment, movimiento cash, audit, outbox | ningún pago/movimiento parcial |
| Movimiento de caja | caja open/version y autorización | movement + audit + versión | nada persiste |
| Abrir caja | active predicate + idempotencia | cash session + audit | índice parcial decide carrera |
| Cerrar caja | session bloqueada; recomputar esperado; pendientes | open→closing o closing→closed, valores, audit | permanece estado anterior |
| Cancelar pedido | order/payment/version bloqueados | cancelled + history + cancel print notice/outbox + audit | pedido no cambia |
| Crear reimpresión | original/rol/motivo | nuevo job + audit | no reimpresión parcial |
| Estado cocina | order/version/rol | estado + history + outbox + audit | no transición |
| Invitar usuario | idempotencia, org/owner, invitación activa | invitation pending + audit | Auth se llama después; sin membership activa hasta reconciliar |

## Auditoría y outbox

Una operación sensible sin `audit_events` es inválida; el fallo del insert de
auditoría provoca rollback. La telemetría externa no bloquea, pero su fallo se
bufferiza/alerta.

`outbox_events` se compromete con el dominio. Un worker publica después y marca
resultado idempotentemente. La publicación duplicada es tolerable porque el
consumidor compara versión; perder el outbox no lo es.

Auth es otro sistema y no comparte transacción: la invitación persistida es la
intención durable. Éxito/fallo/respuesta perdida del proveedor se reconcilian por
ID; sólo después de email verificado se crean/activan profile y membership en una
transacción. Ningún estado intermedio concede acceso.

## Locks y orden

Orden global para reducir deadlocks:

1. idempotency record;
2. organization/membership cuando aplique;
3. cash session;
4. order;
5. daily sequence;
6. children/payment/print;
7. audit/outbox.

Los consumers de cola pueden usar skip-locked; no se usa para decisiones
financieras generales. Toda espera tiene timeout y categoría observable.

## Inmutabilidad

Constraints y triggers conceptuales impiden:

- modificar líneas/snapshots de pedido confirmado;
- reescribir history, payment, cash movement, audit o print attempt;
- editar cash session cerrada;
- mover filas entre organizaciones;
- cambiar un idempotency payload hash.

Un trigger no sustituye la política Fastify, pero protege contra errores internos
y migraciones accidentales.
