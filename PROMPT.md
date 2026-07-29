# Contrato de sesión — phase-0-data-and-auth-review

## Objetivo

Definir documentalmente el diseño físico inicial de datos, autenticación,
sesiones, tenancy, autorización, RLS, migraciones, transacciones, idempotencia,
secretos, recuperación y contratos del MVP sin crear SQL ni implementación.

## Termina cuando

- autoridad, acceso frontend/API y contexto organizacional son inequívocos;
- tablas, claves, relaciones, constraints, índices, historial y eliminación
  están descritos conceptualmente;
- doble pago, doble caja y numeración concurrente tienen protección física;
- sesión, revocación, cambio de rol y fallos del proveedor tienen resultado;
- RLS, roles de base de datos y secretos siguen mínimo privilegio;
- migraciones, backup/restore y OpenAPI poseen estrategia y ADR aceptado;
- 25 escenarios adversariales incluyen riesgo, protección, constraint,
  autorización, prueba futura y limitación;
- JSON, enlaces, skills LoopKit, diff, alcance y revisión adversarial pasan con
  evidencia fresca;
- `STATUS: planning`, cero `completed` y Fase 1 bloqueada se conservan.

## No tocar

- código, SQL ejecutable, migraciones, manifests, dependencias, componentes,
  pantallas, servicios, CI o infraestructura;
- reglas de dominio aceptadas y lógica original de LoopKit;
- runtime final del agente Tauri o funcionalidades de fases futuras;
- staging, commits o remotos.

## Detenerse si

- `phase-0-stack-review` no está versionado o el árbol no parte limpio;
- una decisión contradice ADR-0001 a ADR-0008;
- una protección depende sólo del frontend o de una RLS no verificable;
- aparece un cambio ajeno al alcance o habría que debilitar un control.

## Ruta de verificación

Parseo de ledger, resolución de enlaces, validación estructural de modelo/ADR y
25 escenarios, búsqueda de secretos y artefactos prohibidos, validadores
LoopKit, `git diff --check` y revisión adversarial fría contra este contrato.
