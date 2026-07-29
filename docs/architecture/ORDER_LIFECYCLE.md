# Arquitectura del ciclo de pedido

> **Reglas de dominio aceptadas — 2026-07-29.**

La fuente canónica de estados, matriz, cancelación y criterios de prueba es
[`ORDER_STATES.md`](../domain/ORDER_STATES.md). Este documento fija cómo esas
reglas se integran con la arquitectura lógica sin elegir tecnología.

## Autoridad y creación

El navegador mantiene una propuesta `draft`, nunca un pedido autoritativo. La
confirmación:

1. deriva organización y rol de la sesión;
2. valida catálogo, variantes, modificadores, cantidades e importes actuales;
3. recalcula en centavos y rechaza total cero;
4. aplica idempotencia;
5. asigna ID técnico y número visible en servidor;
6. persiste pedido, snapshots, estado `confirmed`, historial, auditoría e
   intención durable de comanda en una operación atómica.

Una respuesta perdida se recupera con la misma clave. La proyección de cocina
recibe el pedido confirmado; no existe `sent-to-kitchen` como estado.

## Ciclo autoritativo

```text
confirmed ──> in-preparation ──> ready ──> completed
    │                 │             │
    └─────────────────┴─────────────┴──> cancelled
```

Las flechas a `cancelled` están sujetas a estado, ausencia de pago, motivo y
autorización. `completed` exige pago confirmado y entrega. No se salta, repite,
retrocede ni reabre un estado. Todas las transiciones sensibles se validan en
servidor contra estado y versión vigentes.

## Historial y snapshots

El pedido confirmado conserva producto, variante, modificadores, observaciones,
cantidad, precios y totales. No admite edición; cambios de catálogo no lo
reescriben. `OrderStatusHistory` es append-only y conserva actor, organización,
origen, destino, razón, correlation ID, versión y hora servidor.

## Pago, impresión y fallos

- preparación y pago son ejes separados; cocina puede trabajar un pedido
  `unpaid`;
- `Payment` es autoridad de `paid`, nunca la interfaz;
- impresión es un efecto durable posterior; fallo o estado desconocido no
  revierte el pedido;
- una comanda histórica no se borra al cancelar; cocina recibe la cancelación y
  rechaza transiciones posteriores;
- eventos en tiempo real sólo invalidan/actualizan proyecciones versionadas;
  fuera de orden se ignoran y se reconcilian por consulta;
- el MVP no acepta transiciones offline.

## Identidad visible

ID técnico, idempotencia y número visible siguen
[`NUMBERING.md`](../domain/NUMBERING.md). Hora y secuencia son de servidor; un
pedido cancelado conserva su número y los huecos son válidos.

## Decisiones técnicas pendientes

Persisten para `phase-0-stack-review`: mecanismo de transacción, versionado,
retención de idempotencia, publicación durable y actualización en tiempo real.
No alteran las reglas aceptadas en ADR-0002 y ADR-0003.
