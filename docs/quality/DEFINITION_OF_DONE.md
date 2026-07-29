# Definition of Done

## Principio

Una funcionalidad no está terminada porque compila, porque su camino feliz
funciona o porque el agente que la implementó considera correcto el diff. Sólo
está terminada cuando cumple todos los criterios aplicables y presenta evidencia
ejecutada en el mismo ciclo de verificación.

## Checklist obligatorio por funcionalidad

### Alcance y aceptación

- [ ] Código estable y fase autorizada.
- [ ] Una sola funcionalidad en el ciclo.
- [ ] Criterios de aceptación observables, aprobados y sin cambios oportunistas.
- [ ] Dependencias satisfechas.
- [ ] No se incorporaron funciones de fases futuras.

### Implementación

- [ ] Comportamiento requerido completo, sin stubs ni comentarios usados como
      sustituto.
- [ ] Reglas y errores tratados explícitamente.
- [ ] Concurrencia, idempotencia y reconexión contempladas cuando apliquen.
- [ ] Estados de carga, vacío, error y éxito implementados cuando exista
      interacción asíncrona.
- [ ] No quedan TODO críticos; toda deuda aceptada tiene ID en `TECH_DEBT.md`.

### Pruebas

- [ ] Pruebas unitarias creadas y ejecutadas según riesgo.
- [ ] Pruebas de integración y contratos ejecutadas cuando apliquen.
- [ ] Flujo E2E crítico ejecutado sobre el recorrido real.
- [ ] Casos negativos y bordes relevantes cubiertos.
- [ ] Verificación de regresión ejecutada.
- [ ] Ninguna prueba fue debilitada, eliminada u omitida para obtener verde.

### Calidad transversal

- [ ] Typecheck, lint y build de producción aprobados.
- [ ] Validación de entradas, seguridad y permisos revisados.
- [ ] Accesibilidad revisada para toda superficie de usuario afectada.
- [ ] Rendimiento medido contra baseline o presupuesto aplicable.
- [ ] Logs, errores y observabilidad suficientes sin exponer secretos.
- [ ] Migración, respaldo y rollback probados cuando apliquen.
- [ ] Aislamiento entre organizaciones y permisos negativos probados cuando se
      afecten datos o acceso.
- [ ] Caja y cobro reconciliados sin duplicados cuando correspondan.
- [ ] Impresión verificada con fallos visibles y hardware real antes del cierre
      de Fase 1.5.

### Documentación y trazabilidad

- [ ] Documentación de producto, arquitectura y operación actualizada.
- [ ] `FEATURE_STATUS.json` actualizado sin alterar otras funcionalidades.
- [ ] `TECH_DEBT.md` revisado.
- [ ] `CHANGELOG.md` actualizado cuando corresponda.
- [ ] Diff limitado al alcance y revisado adversarialmente.

### Evidencia y aprobación

- [ ] Comandos exactos, códigos de salida y resultados registrados.
- [ ] Evidencia manual o de hardware adjunta cuando aplique.
- [ ] Cero defectos críticos.
- [ ] Todo defecto alto o deuda alta tiene aceptación explícita; si el gate de fase
      lo prohíbe, permanece bloqueado.
- [ ] Revisor confirma criterios contra artefactos, no sólo un veredicto.

## Resultado

- Si todos los puntos aplicables pasan: la funcionalidad puede cambiar de
  `verifying` a `completed`.
- Si un punto no aplica: registrar razón concreta.
- Si falta evidencia, el control falla o hay duda material: permanecer en
  `verifying` o pasar a `blocked`.

Una excepción no se concede reescribiendo esta definición. Debe registrarse con
alcance, riesgo, responsable y fecha límite, y nunca puede aceptar deuda crítica.
