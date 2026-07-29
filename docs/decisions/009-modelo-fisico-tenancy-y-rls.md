# ADR 009 — Modelo físico, tenancy y RLS

## Contexto

El MVP necesita invariantes financieras y aislamiento organizacional aun ante
errores de API o concurrencia. El frontend no debe convertirse en una segunda
vía de negocio.

## Decisión

Usar UUID, dinero bigint en centavos, tiempo servidor, versiones, constraints,
índices parciales y foreign keys compuestas por `organization_id`. Toda tabla de
negocio duplica organización para RLS/índices/integridad; `profiles` permanece
global.

Fastify es la única vía de CRUD comercial. `anon` no accede al schema y
`authenticated` sólo autoriza Realtime privado. `dayia_api` es un rol no-owner
sujeto a RLS; service role queda aislada a Auth Admin/operación excepcional.

RLS es defensa adicional con default deny y `FORCE RLS`, nunca sustituto de
policies Fastify. Una tabla común de idempotencia se combina con uniques de
dominio.

## Alternativas

| Alternativa | Ventaja | Riesgo/costo | Estado |
|---|---|---|---|
| frontend directo + RLS | menos API | duplica casos de uso y eleva exposición | rejected |
| org sólo en padres | menos duplicación | policies con joins y FK cruzadas difíciles | rejected |
| schema/database por tenant | aislamiento fuerte | operación desproporcionada y migraciones N veces | rejected |
| org en filas + composite FK + RLS | defensa simple y portable | columnas/índices adicionales | accepted |

## Consecuencias

Cada repositorio debe filtrar por organización y las migraciones deben crear
grants/RLS/constraints juntos. Las FK pueden revelar colisión mediante errores,
por lo que API sanitiza respuestas. Multi-sucursal requiere `branch_id` futuro,
no otro tenant.

## Riesgos y mitigaciones

- bypass por owner/service: runtime no usa esos roles y pgTAP los prueba;
- discrepancia API/RLS: matriz dual obligatoria;
- overhead de índices compuestos: medir planes y volumen real;
- contexto transaccional incorrecto: pool limpia/fija contexto por transacción.

## Prueba futura

Base efímera con dos organizaciones, carrera de pago/caja/numeración, pgTAP por
rol y acceso cruzado API+DB.

## Estado

accepted

## Fecha

2026-07-29
