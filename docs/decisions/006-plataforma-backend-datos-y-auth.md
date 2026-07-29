# ADR 006 — Plataforma backend, datos y autenticación

## Contexto

Pedidos, caja, cobros, numeración y aislamiento exigen transacciones,
restricciones relacionales, autorización servidor e idempotencia. El MVP también
necesita identidad y avisos en tiempo real con operación proporcional.

## Decisión

Adoptar una API autoritativa Node.js 24 LTS + TypeScript + Fastify. Usar
PostgreSQL, Auth y Realtime administrados por Supabase.

Todas las mutaciones de negocio pasan por la API. La persistencia usa SQL
parametrizado con `pg` detrás de repositorios, migraciones SQL futuras,
transacciones y constraints. RLS es defensa en profundidad.

Supabase Auth provee identidad email/password con alta administrativa. La API
valida sesión y resuelve membresía/rol. Realtime sólo notifica versiones para que
el cliente vuelva a consultar la API.

## Alternativas

- Supabase directo/RPC/Edge Functions: menor operación, pero dispersa reglas
  centrales entre cliente, SQL y runtime Deno.
- NestJS + PostgreSQL: más estructura, con mayor superficie/abstracción inicial.
- PostgreSQL/Auth/WebSocket autogestionados: control máximo y operación
  desproporcionada al MVP.
- Firebase: experiencia administrada, pero peor ajuste a invariantes relacionales
  y transacciones del dominio.
- ORM Prisma/Drizzle: productividad y tipos, a cambio de otra abstracción sobre
  SQL crítico; se puede reconsiderar con evidencia.

## Consecuencias

Hay dos despliegues cloud (API y Supabase) y lock-in parcial en Auth/Realtime.
El dominio, repositorios y contratos deben permanecer portables. El siguiente
gate debe definir schema, RLS, sesión, revocación, secretos, backup y restore;
este ADR no los presume resueltos.

## Estado

accepted

## Fecha

2026-07-29
