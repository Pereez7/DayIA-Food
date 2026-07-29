# ADR 012 — Autoridad del contrato OpenAPI

## Contexto

Web, API y agente necesitan evolucionar sin duplicar tipos ni aceptar mocks que
deriven del consumidor. Fastify además requiere validación runtime de entrada y
salida.

## Decisión

Zod versionado en `packages/contracts` es fuente única. De él se generan schema
Fastify, OpenAPI y cliente/tipos. El servidor publica el artefacto OpenAPI
identificado por commit; web y agente consumen versiones compatibles.

API inicia en `/v1`. Cambios aditivos preservan compatibilidad; breaking changes
requieren `/v2`, ADR y convivencia. Requests rechazan unknown fields y aplican
bounds; responses también se validan/serializan por schema.

## Alternativas

| Alternativa | Ventaja | Riesgo/costo | Estado |
|---|---|---|---|
| OpenAPI manual primero | neutral | duplica Zod/TS y drift | rejected |
| tipos TS solamente | simple | sin runtime ni agente neutral | rejected |
| schemas por consumidor | autonomía | mocks mentirosos e incompatibilidad | rejected |
| Zod→OpenAPI/client | una fuente runtime | adapter por seleccionar/probar | accepted |

## Consecuencias

La dependencia generadora se elegirá al inicializar toolchain y debe demostrar
round-trip. Ningún tipo compilado sustituye validación. El agente necesita ventana
N/N-1 antes del piloto.

## Riesgos y mitigaciones

- pérdida semántica al convertir schema: golden contract tests;
- cambio breaking disfrazado: diff automático de OpenAPI;
- código generado obsoleto: generación reproducible en verify;
- campos internos/secretos: allowlist de response.

## Prueba futura

Validar OpenAPI, generar cliente, producer/consumer tests reales, diff
additive/breaking y despliegue API N con consumidor N-1.

## Estado

accepted

## Fecha

2026-07-29
