# Red flags de verificación

## Propósito

Este checklist local completa la referencia usada por
`.claude/commands/verify.md`. No cambia el procedimiento ni la lógica original
de LoopKit: hace explícitos cuatro controles ambientales equivalentes a los de
`broken-window-check`.

## Cuándo se ejecuta

Se revisa:

- al iniciar trabajo sobre una funcionalidad después de leer el estado previo;
- antes de declarar una funcionalidad terminada;
- durante `/verify`, contra el objetivo, el diff completo y el estado Git;
- antes de aprobar un gate de fase o release.

Si todavía no existe código ejecutable, se aplica a documentación, ledger,
quality gates y evidencia disponible sin declarar controles inexistentes como
aprobados.

## Controles obligatorios

| Control | Evidencia requerida | Hallazgo bloqueante |
|---|---|---|
| No dejar pruebas rotas o ignoradas | Comando completo, fecha, entorno, código de salida, casos fallidos/omitidos y artefacto | Prueba fallida, omitida sin justificación o feature previamente verde que ya no funciona |
| No reducir controles de calidad para obtener verde | Diff de assertions, exclusiones, configuración y comandos; comparación con el criterio previo | Assertion debilitada, caso eliminado, error silenciado, exclusión nueva o gate reducido |
| No dejar errores conocidos sin registrar | Registro del fallo, impacto, severidad, responsable, decisión y vínculo a defecto o deuda | Error reproducible oculto, TODO usado como sustituto o riesgo material sin registro |
| No declarar una tarea completa sin evidencia ejecutada | Evidencia fresca del mismo ciclo y revisión del resultado contra aceptación | Veredicto basado en confianza, inspección parcial, ejecución anterior o reporte no comprobado |

## Evidencia mínima

Cada revisión debe identificar:

- alcance y funcionalidad o fase;
- comando o procedimiento exacto;
- entorno y configuración relevantes;
- fecha y hora;
- código de salida, fallos y omisiones;
- artefacto o salida revisada;
- responsable o revisor;
- resultado `pass`, `fail` o `blocked`.

La lectura de pruebas, mocks o documentación no sustituye ejecutar el recorrido
real cuando ya existe una ruta ejecutable.

## Qué bloquea una funcionalidad

Bloquea la funcionalidad cualquiera de estos hallazgos:

- una prueba aplicable falla o se omite sin justificación;
- se debilitó un control para obtener éxito;
- existe un defecto crítico o alto no aceptado;
- existe deuda sin ID, severidad, aprobación o plazo requeridos;
- falta evidencia fresca para un criterio de aceptación;
- la revisión adversarial encuentra un atajo de “fake done”.

La funcionalidad permanece `verifying` o pasa a `blocked`; nunca cambia a
`completed`.

## Qué bloquea una fase

Además de cualquier funcionalidad bloqueada, bloquean una fase:

- una funcionalidad obligatoria sin `completed`;
- regresión, E2E crítico, seguridad, accesibilidad, rendimiento o build
  aplicable sin evidencia aprobada;
- deuda `critical`, deuda `high` sin aceptación formal o defecto alto no
  aceptado;
- inconsistencias entre alcance, catálogo, ledger, arquitectura y changelog;
- ausencia de aprobación explícita para habilitar la fase siguiente.

Un promedio verde no compensa un control bloqueante.

## Relación con los documentos de calidad

- [`TECH_DEBT.md`](../../TECH_DEBT.md): todo atajo o limitación aceptada debe
  registrarse con ID, severidad, impacto, fase, fecha límite y aprobación. Un
  defecto no se reclasifica como deuda para evitar un gate.
- [`DEFINITION_OF_DONE.md`](../quality/DEFINITION_OF_DONE.md): este checklist
  refuerza que “done” exige todos los criterios aplicables y evidencia ejecutada
  en el mismo ciclo.
- [`QUALITY_GATES.md`](../quality/QUALITY_GATES.md): los hallazgos se evalúan
  como gates individuales; un control omitido, fallido o no ejecutable permanece
  bloqueado y no puede compensarse con otros controles verdes.

## Resultado

La revisión pasa sólo cuando los cuatro controles cuentan con evidencia
suficiente y no existe un hallazgo bloqueante. Si hay duda material o falta
evidencia, el resultado es `blocked`, no `pass`.
