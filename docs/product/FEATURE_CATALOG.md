# Catálogo inicial de funcionalidades

## Uso

Este catálogo asigna códigos estables y describe capacidades sin especificar su
implementación. `FEATURE_STATUS.json` conserva el estado operativo; este archivo
es la fuente descriptiva. Una entrada no autoriza su desarrollo: debe pertenecer
a la fase habilitada y ser la única funcionalidad del ciclo.

Estados iniciales usan el vocabulario controlado de `FEATURE_STATUS.json`. Ninguna
funcionalidad comienza en `completed`.

## Catálogo

| Código | Nombre | Descripción | Fase | Prioridad | Dependencias | Riesgo | Pruebas requeridas | Estado inicial |
|---|---|---|---|---|---|---|---|---|
| CORE-001 | Gobierno del proyecto | Establecer fases, gates, ledger, deuda y documentación coherente. | Fase 0 | critical | Ninguna | high | Validación documental, JSON, referencias, revisión adversarial | verifying |
| CORE-002 | Fundaciones técnicas | Definir y comprobar el entorno técnico mínimo sin adelantar producto. | Fase 0 | critical | CORE-001 | high | Smoke técnico, typecheck, lint, unit, build | not-started |
| CORE-003 | Configuración del restaurante | Mantener una organización y el contexto operativo mínimo, sin múltiples sucursales. | Fase 1 | must | CORE-002 | high | Unit, integration, aislamiento, permisos, E2E | specified |
| CATALOG-001 | Catálogo esencial | Mantener categorías, productos, precios y disponibilidad. | Fase 1 | must | CORE-003 | high | Unit, integration, contract, E2E | specified |
| PIZZA-001 | Configuración mínima de pizza | Mantener tamaños, variantes y modificadores básicos usando el catálogo común. | Fase 1 | must | CATALOG-001 | high | Unit, integration, contract, E2E | specified |
| POS-001 | Punto de venta mínimo | Gestionar cantidades, observaciones, carrito, subtotal, total y confirmación. | Fase 1 | must | AUTH-001, CATALOG-001, PIZZA-001, CASH-001 | high | Integration, accesibilidad, rendimiento, E2E | specified |
| ORDER-001 | Creación de pedido | Registrar número, líneas, cantidades, observaciones y selecciones válidas. | Fase 1 | must | POS-001 | critical | Unit, integration, contract, E2E, regresión | specified |
| ORDER-002 | Cálculo de importes | Calcular subtotales, total y cambio de forma consistente. | Fase 1 | must | ORDER-001 | critical | Unit exhaustiva, integration, property/edge cases, E2E | specified |
| KITCHEN-001 | Flujo básico de cocina | Enviar pedidos, mostrarlos en cocina y registrar en preparación, listo e historial mínimo. | Fase 1 | must | ORDER-001 | critical | Unit, integration, concurrencia, E2E, regresión | specified |
| ORDER-003 | Consulta operativa | Consultar pedidos y reconocer estado, total e historial mínimo. | Fase 1 | must | ORDER-002, KITCHEN-001 | high | Integration, permisos, E2E | specified |
| AUTH-001 | Autenticación mínima | Gestionar usuarios internos, login/logout, roles propietario/cajero/cocina, rutas y aislamiento por organización. | Fase 1 | must | CORE-002 | critical | Unit, integration, aislamiento, permisos, seguridad, E2E | specified |
| CASH-001 | Caja básica | Abrir con monto inicial, registrar ventas e ingresos/retiros con motivo, arquear y cerrar con diferencia. | Fase 1 | must | AUTH-001 | critical | Unit, integration, permisos, concurrencia, E2E, regresión | specified |
| PAYMENT-001 | Cobro básico | Registrar efectivo, QR manual o transferencia, cambio, estado y usuario que cobró. | Fase 1 | must | ORDER-002, CASH-001 | critical | Unit, integration, idempotencia, permisos, E2E, regresión | specified |
| PRINT-001 | Impresión básica en cocina | Gestionar una impresora, comanda, reimpresión controlada, estado, fallos y registro básico. | Fase 1 | must | KITCHEN-001 | high | Contract, integration, cola, hardware real, reconexión | specified |
| PRINT-002 | Impresión básica en caja | Gestionar una impresora, comprobante, reimpresión controlada, estado, fallos y registro básico. | Fase 1 | must | PAYMENT-001 | high | Contract, integration, cola, hardware real, reconexión | specified |
| INGREDIENT-001 | Ingredientes | Mantener ingredientes y unidades necesarios para recetas e inventario. | Fase 2 | future | Fase 1.5 | high | Unit, integration, contratos, permisos | not-started |
| INVENTORY-001 | Inventario | Mantener existencias y movimientos trazables. | Fase 2 | future | Fase 1.5 | critical | Unit, integration, concurrencia, permisos, E2E | not-started |
| RECIPE-001 | Recetas | Relacionar productos con ingredientes de forma neutral al vertical. | Fase 2 | future | INGREDIENT-001, INVENTORY-001 | high | Unit, integration, contratos, regresión | not-started |
| SUPPLIER-001 | Proveedores | Mantener proveedores necesarios para abastecimiento. | Fase 2 | future | CORE-003 | medium | Unit, integration, permisos | not-started |
| PURCHASE-001 | Compras | Registrar compras y su impacto autorizado en inventario. | Fase 2 | future | INVENTORY-001, SUPPLIER-001 | critical | Unit, integration, permisos, E2E, regresión | not-started |
| WASTE-001 | Mermas | Registrar pérdidas justificadas y su impacto trazable en inventario. | Fase 2 | future | INVENTORY-001 | high | Unit, integration, permisos, regresión | not-started |
| TABLE-001 | Mesas | Gestionar pedidos asociados a mesas. | Fase 3 | future | KITCHEN-001 | high | Integration, concurrencia, E2E | not-started |
| DELIVERY-001 | Delivery | Gestionar pedidos del canal delivery y sus estados. | Fase 3 | future | KITCHEN-001 | high | Integration, contract, E2E, resiliencia | not-started |
| PROMO-001 | Promociones | Aplicar reglas promocionales aprobadas sin alterar totales indebidamente. | Fase 3 | future | ORDER-002 | critical | Unit exhaustiva, integration, E2E, regresión | not-started |
| ORG-001 | Multi-sucursal | Administrar múltiples sucursales dentro de una organización manteniendo aislamiento. | Fase 4 | future | Fase 3 | critical | Aislamiento, permisos, integration, E2E, seguridad | not-started |
| INTEGRATION-001 | Integraciones externas | Conectar terceros mediante contratos y fallos controlados. | Fase 4 | future | ORG-001 | high | Contract, integration, resiliencia, seguridad | not-started |

## Decisión de alcance aplicada

`ADR-0001` incorporó `POS-001`, `AUTH-001`, `CASH-001`, `PAYMENT-001`,
`PRINT-001` y `PRINT-002` a Fase 1. Están `specified`, no `completed`. La
arquitectura y el stack pendientes impiden implementar Fase 1 hasta cerrar Fase 0.

Pago mixto no está incluido en `PAYMENT-001`. Los resúmenes esenciales pertenecen
a pedido, impresión y caja; no se añade un módulo de analítica al MVP.

## Control de cambios

- Los códigos no se reutilizan.
- Una descripción no se reescribe para ocultar alcance pendiente.
- Una funcionalidad retirada permanece trazable como `deferred`.
- Sólo una funcionalidad puede pasar a `in-progress` por ciclo.
- Sólo evidencia ejecutable suficiente permite pasar por `verifying` hasta
  `completed`.
