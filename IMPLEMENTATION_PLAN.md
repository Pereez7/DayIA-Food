STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: data-and-auth-review
CURRENT_FEATURE: phase-0-data-and-auth-review
NEXT_GATE: phase-0-printing-spike-plan
FEATURE_CATALOG_ID: CORE-001

# Plan de implementación

## Objetivo del ciclo

Definir la dirección física de PostgreSQL, Auth, sesiones, tenancy, RLS,
transacciones, idempotencia, migraciones, secretos, recuperación y contratos del
MVP. Es una única revisión documental de `CORE-001`: no completa la
funcionalidad, no implementa `AUTH-001` y no habilita Fase 1.

## Resultado de revisión

Veredicto final documental: `approved-with-actions`.

Las decisiones son implementables y coherentes con ADR-0001 a ADR-0008. Siguen
sin evidencia ejecutable de producto: schema, RLS, migraciones, Auth, OpenAPI,
restore y carreras deben materializarse en sesiones futuras.

## Autoridad aprobada

1. Supabase Auth autentica identidad.
2. Fastify aplica autorización, casos de uso y dominio.
3. PostgreSQL conserva datos e invariantes.
4. RLS es defensa adicional.
5. Frontend no decide organización ni tiene CRUD comercial directo.
6. Session context + membership activa derivan organización/rol.
7. Operaciones sensibles pasan por Fastify.
8. Realtime Broadcast privado avisa; API/DB siguen siendo autoridad.

## Decisiones del ciclo

- ADR-0009: modelo físico, tenant en filas, FK compuestas, RLS y constraints.
- ADR-0010: Auth PKCE, JWT/JWKS, session contexts y authz DB viva.
- ADR-0011: Supabase CLI SQL, forward-only/expand-contract, PITR y restore.
- ADR-0012: Zod como fuente; Fastify/OpenAPI/cliente generados.

## Plan → Act → Verify

### Plan

- comprobar stack versionado y árbol limpio;
- leer fuentes, ADR, quality gates y skills aplicables;
- fijar contrato verificable antes de modificar diseño.

### Act

- describir tablas, keys, relaciones, constraints, índices y retención;
- fijar límites transaccionales e idempotencia;
- definir Auth, sesión, autorización, RLS y secretos;
- decidir migraciones, backup/restore y contratos;
- coordinar arquitectura, dominio, calidad, ledger, memoria y changelog;
- documentar 25 escenarios adversariales.

### Verify

1. 25 escenarios con seis campos de refutación;
2. inventario físico y 12 transacciones cubiertos;
3. ADR-0009 a ADR-0012 válidos/coherentes;
4. JSON parseable, cero completed y 13/13 Fase 1 bloqueadas;
5. enlaces locales y referencias ADR resuelven;
6. cero SQL/migraciones/manifests/dependencias/código/secretos;
7. validadores LoopKit y `run.sh`;
8. `git diff --check`, cero staging y revisión adversarial fría.

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | Data/auth decidido; spikes y materialización técnica siguen pendientes |
| Fase 1 | blocked | Fase 0 y sus gates ejecutables no están cerrados |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Acciones y bloqueos restantes

- planificar/ejecutar spike Tauri y protocolo/agente de impresión;
- inicializar toolchain sólo con sesión autorizada;
- crear y probar migrations/schema/RLS/Auth/contratos;
- seleccionar proveedor/plan/región/secret manager y habilitar PITR;
- ejecutar restore, concurrencia, seguridad, rendimiento y hardware;
- validar retención legal/fiscal y privacidad en Bolivia.

## Evidencia del ciclo

Evidencia ejecutada el 2026-07-29:

| Control | Resultado |
|---|---|
| Precondiciones Git | `main`, base versionada `86c4b14`, árbol inicialmente limpio |
| Ledger | JSON parseable; `completed=0`; Fase 1 bloqueada `13/13`; siguiente gate correcto |
| Enlaces Markdown | 120 documentos, 58 enlaces locales, 0 rotos |
| Cobertura contractual | 25 escenarios adversariales; 12 operaciones obligatorias en 13 filas transaccionales; ADR-0009–0012 presentes |
| LoopKit | frontmatter válido `53/53`; `bash -n run.sh` verde |
| Alcance y secretos | 0 código, SQL, migraciones, manifests, dependencias o secretos de alta confianza añadidos |
| Integridad del diff | `git diff --check` verde; staging vacío |
| Revisión fría | dos iteraciones rechazaron 7 incoherencias; tercera iteración `PASS`, 0 hallazgos |

Typecheck, tests de producto, build, migraciones, pgTAP y restore continúan
`blocked` porque no existe implementación; no se declaran verdes por
documentación. Schema, RLS, Auth, concurrencia, PITR/restore y contratos requieren
evidencia ejecutable en sesiones futuras.

## Siguiente paso recomendado — no ejecutar

Ejecutar una única sesión `phase-0-printing-spike-plan` para convertir ADR-0008
en un plan de spike medible sobre Windows e impresoras reales, sin desarrollar el
agente ni inicializar la aplicación.
