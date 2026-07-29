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

## Comandos pendientes de selección

Fase 0 debe sustituir cada marcador por un comando real y ejecutarlo:

| Gate | Comando | Estado actual |
|---|---|---|
| Typecheck | Pendiente de stack aprobado | blocked |
| Lint | Pendiente de stack aprobado | blocked |
| Unit tests | Pendiente de stack aprobado | blocked |
| Integration tests | Pendiente de stack aprobado | blocked |
| E2E | Pendiente de stack aprobado | blocked |
| Production build | Pendiente de stack aprobado | blocked |
| Security review | Pendiente de toolchain aprobado | blocked |
| Accessibility review | Pendiente de superficie y toolchain | blocked |
| Performance verification | Pendiente de baseline | blocked |

La falta actual de comandos es esperada en documentación de Fase 0, pero impide
cerrarla.
