# Checklist de cierre de fase y release

## Identificación

- Fase:
- Release candidate:
- Estado o commit probado:
- Responsable:
- Fecha:
- Siguiente fase solicitada:

Una casilla sólo se marca con enlace o referencia a evidencia. `N/A` requiere una
justificación revisable.

## Alcance

- [ ] Todas las funcionalidades obligatorias de la fase están `completed`.
- [ ] Ninguna funcionalidad de fase futura fue incorporada.
- [ ] El alcance coincide con `ADR-0001` y no incorpora variantes avanzadas.
- [ ] Criterios de entrada y salida de `PHASES.md` comprobados.
- [ ] `FEATURE_CATALOG.md` y `FEATURE_STATUS.json` coinciden.

## Quality gates

- [ ] Typecheck aprobado.
- [ ] Lint/format aprobado.
- [ ] Unit tests aprobados.
- [ ] Integration y contract tests aprobados.
- [ ] E2E críticos aprobados sobre el candidato.
- [ ] E2E login → caja → POS/pedido → cocina → cobro → impresión → cierre
      aprobado.
- [ ] Build de producción reproducible.
- [ ] Revisión adversarial aprobada.
- [ ] Revisión de seguridad aprobada.
- [ ] Revisión de accesibilidad aprobada.
- [ ] Rendimiento aprobado contra baseline y presupuesto.
- [ ] Suite de regresión completa aprobada.
- [ ] Cero controles omitidos sin justificación.

## Defectos y deuda

- [ ] No existen defectos críticos abiertos.
- [ ] No existen defectos altos sin aceptación explícita.
- [ ] No existe deuda crítica.
- [ ] Toda deuda alta tiene aprobación, responsable y fecha límite.
- [ ] No hay TODO críticos fuera de `TECH_DEBT.md`.
- [ ] Ninguna prueba fue eliminada o debilitada para aceptar deuda.

## Datos y recuperación

- [ ] Migraciones comprobadas en avance y rollback cuando existen.
- [ ] Compatibilidad durante despliegue verificada.
- [ ] Respaldo creado y restauración ensayada cuando aplica.
- [ ] Recuperación ante operación parcial revisada.
- [ ] Integridad y reconciliación comprobadas.
- [ ] Aislamiento entre organizaciones comprobado.
- [ ] Caja, cobro y trabajos de impresión reconciliados.

## Operación

- [ ] Observabilidad y alertas verificadas.
- [ ] Logs no exponen secretos.
- [ ] Runbooks y responsables de soporte identificados.
- [ ] Plan de despliegue definido.
- [ ] Plan de rollback definido y ensayado.
- [ ] Comportamiento con conexión lenta revisado.
- [ ] Impresoras reales de cocina y caja validadas para el MVP.
- [ ] Conexión inestable, reconexión y ausencia de duplicados verificadas.

## Piloto

- [ ] Entorno y participantes de piloto identificados, cuando corresponde.
- [ ] Recorrido operativo del piloto ejecutado.
- [ ] Hallazgos clasificados y resueltos o aceptados.
- [ ] Aprobación del piloto registrada.

Fase 1.5 exige piloto. Otras fases deben justificar si no aplica.

## Documentación y versionado

- [ ] Producto, alcance y fases actualizados.
- [ ] Arquitectura y ADR actualizados.
- [ ] Estrategia de pruebas y presupuestos actualizados.
- [ ] `TECH_DEBT.md` revisado.
- [ ] `CHANGELOG.md` actualizado.
- [ ] Documentación de operación actualizada.
- [ ] Versión propuesta respeta la política acordada.
- [ ] Tag o versión creado **sólo después** de aprobación.

## Evidencia consolidada

- [ ] Se registraron comandos exactos.
- [ ] Se registraron códigos de salida, conteos y artefactos.
- [ ] El estado probado es identificable.
- [ ] Un revisor comprobó la evidencia contra cada gate.
- [ ] El diff completo fue mostrado antes de solicitar commit.

## Aprobación de cierre

- [ ] Responsable de producto aprueba alcance.
- [ ] Responsable técnico aprueba quality gates y riesgos.
- [ ] Responsable operativo aprueba piloto/hardware cuando aplica.
- [ ] Se registra aprobación explícita para iniciar la siguiente fase.

**Resultado:** `approved | rejected | blocked`

**Evidencia de aprobación:**

**Bloqueos o excepciones:**

Sin resultado `approved` y evidencia completa, la fase permanece abierta y la
siguiente no puede empezar.
