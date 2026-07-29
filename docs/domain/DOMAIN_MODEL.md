# Modelo conceptual de dominio del MVP

## Alcance y autoridad

Este modelo describe conceptos y responsabilidades, no tablas, servicios ni
clases. El servidor y la persistencia son autoritativos. El navegador, cocina en
tiempo real y documentos impresos son proyecciones. Toda entidad pertenece a una
`Organization`; el contexto organizacional se deriva de la sesión y nunca se
acepta un `organization_id` del cliente como autorización.

## Entidades

| Concepto | Responsabilidad | Invariante principal |
|---|---|---|
| Organization | Límite comercial, de datos, numeración y caja | Ningún dato operativo cruza su organización |
| User | Identidad autenticable | No concede acceso por sí solo |
| Membership | Vincula usuario, organización y rol vigente | Sólo una membresía activa autoriza acciones |
| Role | Política `owner`, `cashier` o `kitchen` | Se evalúa en servidor en cada comando |
| Product | Artículo vendible y su disponibilidad actual | Cambios futuros no alteran ventas históricas |
| ProductVariant | Presentación vendible y precio actual | Una línea confirmada conserva su snapshot |
| ModifierGroup | Regla de selección de modificadores | Mínimo, máximo y obligatoriedad se validan al confirmar |
| Modifier | Opción y ajuste no negativo de precio | Su baja no borra snapshots históricos |
| Order | Venta confirmada y su ciclo operacional | No existe hasta una confirmación válida e idempotente |
| OrderItem | Cantidad y snapshot del producto/variante | Cantidad entera positiva; importes en centavos |
| OrderItemModifier | Snapshot de la opción elegida | Pertenece a una línea del mismo pedido |
| OrderStatusHistory | Registro append-only de transiciones | Cada transición conserva actor, instante y motivo |
| KitchenProjection | Vista derivada para producción | Nunca decide estado ni sustituye al pedido |
| Payment | Cobro exitoso confirmado | Máximo uno por pedido; es inmutable en el MVP |
| PaymentAttempt | Ejecución idempotente de un cobro | Varios intentos; sólo uno puede tener éxito |
| CashSession | Turno operativo compartido de una organización | Máximo una abierta o en cierre por organización |
| CashMovement | Efecto físico de pago cash o entrada/retiro manual | Importe positivo; manual exige dirección y motivo |
| PrintJob | Intención durable de imprimir contenido histórico | Original y reimpresión son trabajos distintos |
| PrintAttempt | Ejecución de un trabajo por el agente local | Un resultado desconocido nunca se reintenta solo |
| AuditEvent | Evidencia append-only de una acción relevante | Actor, organización, resultado y hora de servidor |

`KitchenProjection` es una proyección, no una entidad transaccional independiente.
`PaymentAttempt` sí es necesario para resolver respuesta perdida, concurrencia y
resultado incierto sin crear cobros duplicados.

## Agregados conceptuales

- **Catálogo:** `Product`, `ProductVariant`, `ModifierGroup`, `Modifier`.
- **Pedido:** `Order`, líneas, modificadores, historial y snapshots.
- **Cobro:** `PaymentAttempt` y, sólo tras éxito confirmado, `Payment`.
- **Caja:** `CashSession` y `CashMovement`; los pagos se asocian a la sesión.
- **Impresión:** `PrintJob` y sus `PrintAttempt`.
- **Identidad:** `User`, `Membership`, `Role`, siempre bajo `Organization`.
- **Auditoría:** recibe hechos de todos los agregados, sin ser su fuente de verdad.

Las fronteras físicas y el esquema de persistencia se decidirán después.
