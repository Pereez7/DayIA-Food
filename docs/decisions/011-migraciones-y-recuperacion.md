# ADR 011 — Migraciones y recuperación

## Contexto

PostgreSQL/Supabase necesita una historia reproducible que incluya tablas,
constraints, RLS, grants y Realtime. Un rollback SQL automático puede destruir
datos y un backup no probado no garantiza recuperación.

## Decisión

Usar Supabase CLI y migraciones SQL timestamped como única historia. Forward-only
por defecto, cambios expand/contract y rollback de aplicación. Una migración
aplicada no se edita. Dashboard/SQL remoto fuera de migraciones queda prohibido.

Local/CI reconstruyen desde cero; staging recibe el mismo artefacto antes de
production. Cambios destructivos exigen schema diff, ventana, backup y restore.

Objetivos production: RPO ≤15 minutos y RTO ≤4 horas. PITR es requisito antes del
piloto salvo reapertura explícita; dumps lógicos cifrados aportan portabilidad.

## Alternativas

| Alternativa | Ventaja | Riesgo/costo | Estado |
|---|---|---|---|
| Supabase CLI SQL | integra plataforma y RLS | disciplina SQL/Docker | accepted |
| node-pg-migrate | up/down programable | segunda historia/herramienta | rejected |
| ORM migrations | modelos cómodos | ORM no aprobado, RLS incompleta | rejected |
| down automático | rollback rápido | pérdida/locks/semántica falsa | rejected |

## Consecuencias

No siempre existe down; recuperar puede significar app anterior + migración
forward o PITR. PITR tiene costo y downtime por medir. Roles custom recuperados
pueden requerir reset de credenciales.

## Riesgos y mitigaciones

- drift remoto: migration list/reset y despliegue único;
- lock de tabla: pasos live-safe y medición;
- restore viejo: reconciliar outbox, idempotencia, caja/pagos e impresión;
- dependencia proveedor: dump + migraciones + contrato PostgreSQL portable.

## Prueba futura

Reset efímero, upgrade desde snapshot production, schema diff, failure injection,
restore en proyecto nuevo y medición RPO/RTO.

## Estado

accepted

## Fecha

2026-07-29
