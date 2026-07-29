# Quality gates

## Regla general

Un gate es una condición de avance, no una recomendación. Debe producir evidencia
reproducible con comando o procedimiento, fecha, código de salida, resultado y
artefacto relacionado. Un control no configurado se considera `blocked`, nunca
aprobado por omisión.

No se permite reducir assertions, excluir casos, silenciar errores, cambiar
criterios ni eliminar controles para obtener una salida verde.

## Registro mínimo de evidencia

Cada ejecución debe registrar:

| Campo | Contenido |
|---|---|
| Scope | Funcionalidad, fase o release verificado |
| Control | Gate concreto |
| Command/procedure | Instrucción exacta y reproducible |
| Environment | Entorno y configuración relevantes |
| Started at | Fecha y hora |
| Exit/result | Código de salida y conteo de fallos |
| Artifact | Reporte, log, captura o referencia |
| Reviewer | Responsable que revisó la salida |

## A. Gate por funcionalidad

Aplica a una sola funcionalidad por ciclo.

| Control | Obligación | Evidencia |
|---|---|---|
| Alcance | Código estable, fase habilitada y criterios de aceptación aprobados | Enlace al catálogo y spec |
| Typecheck | Ejecutar el comando completo cuando el stack lo habilite | Código 0, sin errores |
| Lint/format | Ejecutar sobre todo el alcance aplicable | Código 0, sin exclusiones nuevas |
| Unit tests | Cubrir reglas y bordes según riesgo | Resultados y casos relevantes |
| Integration tests | Cubrir fronteras afectadas | Resultados con dependencias reales apropiadas |
| Contract tests | Proteger contratos modificados | Productor/consumidor compatibles |
| E2E | Ejecutar el comportamiento observable crítico | Recorrido y resultado |
| Build de producción | Construir el artefacto entregable | Código 0 y artefacto identificado |
| Seguridad | Revisar entrada, permisos, secretos y amenazas aplicables | Hallazgos y resolución |
| Accesibilidad | Revisar semántica, teclado, foco y contraste cuando exista UI | Resultado automatizado y manual |
| Rendimiento | Comparar métricas afectadas con baseline/presupuesto | Medición y diferencia |
| Revisión adversarial | Buscar atajos de “fake done” contra el diff | Veredicto y fallos resueltos |
| Documentación | Actualizar fuentes de verdad afectadas | Diff coherente |
| Deuda técnica | Registrar toda deuda aceptada | ID, severidad y aprobación |
| Defectos | Cero defectos críticos; altos sólo con excepción formal | Reporte de defectos |

Una funcionalidad no pasa a `completed` si un control aplicable está omitido,
fallando, no ejecutable o sin evidencia.

### Controles obligatorios del MVP comercial

- `AUTH-001`: permisos negativos, sesión, roles y aislamiento entre
  organizaciones;
- `POS-001` y pedidos: catálogo, importes, observaciones, concurrencia y
  confirmación idempotente;
- `CASH-001` y `PAYMENT-001`: esperado/contado, movimientos, cambio, permisos y
  ausencia de cobros duplicados;
- `PRINT-001` y `PRINT-002`: cola, reintentos, fallos visibles, reimpresión
  auditada y hardware real;
- recorrido completo: conexión inestable, reconexión y convergencia sin
  duplicados.

## B. Gate por fase

Además de los gates de cada funcionalidad:

- todas las funcionalidades obligatorias de la fase están `completed`;
- no hay funcionalidad de una fase futura implementada;
- suite completa de regresión aprobada;
- E2E críticos de la fase aprobados;
- build de producción reproducible;
- revisión de seguridad y accesibilidad de la superficie acumulada;
- presupuesto de rendimiento revisado con baseline vigente;
- aislamiento entre organizaciones aprobado;
- caja, cobro e impresión reconciliables;
- migraciones, respaldo y recuperación comprobados cuando existan;
- `TECH_DEBT.md` revisado: cero deuda crítica y toda deuda alta aprobada;
- cero defectos críticos y cero defectos altos no aceptados;
- `PRODUCT.md`, alcance, fases, catálogo, ledger, arquitectura y changelog
  coherentes;
- [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) completado;
- aprobación explícita para habilitar la fase siguiente.

Un promedio verde no compensa un gate rojo. Cada control bloqueante debe pasar.

## C. Gate por release

Además de los gates de fase:

- versión y contenido de release definidos;
- artefacto candidato construido desde estado identificable;
- smoke test del artefacto desplegado;
- E2E críticos y regresión ejecutados sobre el candidato;
- vulnerabilidades y secretos revisados;
- performance y comportamiento con red lenta revisados;
- observabilidad, alertas y soporte preparados;
- migración, respaldo, recuperación y rollback ensayados cuando apliquen;
- impresoras reales de cocina y caja validadas para el MVP;
- conexión inestable y reconexión verificadas;
- piloto aprobado cuando corresponda;
- changelog y documentación operativa actualizados;
- aprobación humana registrada antes de tag o publicación.

No se crea `v1.0.0` durante planificación. La preparación ocurre en Fase 1.5.

## Comandos seleccionados, aún no implementados

| Gate | Comando contractual | Estado actual |
|---|---|---|
| Typecheck | `pnpm typecheck` | blocked: no existe toolchain |
| Lint | `pnpm lint` | blocked: no existe toolchain |
| Format | `pnpm format:check` | blocked: no existe toolchain |
| Unit tests | `pnpm test:unit` | blocked: no existe código |
| Integration tests | `pnpm test:integration` | blocked: no existe entorno |
| Contract tests | `pnpm test:contract` | blocked: no existen contratos |
| E2E | `pnpm test:e2e` | blocked: no existe aplicación |
| Production build | `pnpm build` | blocked: no existe aplicación |
| Dependency review | `pnpm security:dependencies` | blocked: no hay dependencias |
| Secret scan | `pnpm security:secrets` | blocked: no existe script |
| Full verify | `pnpm verify` | blocked: no existe composición |
| Accessibility | automatizado + teclado/lector manual | blocked: no existe UI |
| Performance | protocolo de `PERFORMANCE_BUDGET.md` | blocked: no hay baseline |

Los nombres son el contrato que deberá materializar una sesión futura. No se
declara ningún comando ejecutado ni verde.

## Gate adicional de stack

Antes de instalar una dependencia:

- verificar versión estable, runtime soportado, licencia y advisories;
- justificar necesidad y frontera;
- comparar alternativa nativa o ya presente;
- registrar impacto de bundle/operación;
- actualizar lockfile y ejecutar auditoría completa;
- no aceptar una vulnerabilidad crítica; una alta requiere excepción formal en
  `TECH_DEBT.md`.

Antes de aceptar el agente Tauri debe pasar el spike de
[`PRINTING_ARCHITECTURE.md`](../architecture/PRINTING_ARCHITECTURE.md). Antes de
producción deben probarse RLS, restore, rollback y hardware real.
