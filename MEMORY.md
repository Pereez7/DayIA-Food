# Memoria del proyecto

Hechos duraderos entre sesiones. Mantener este archivo breve, verificable y libre
de hipótesis transitorias.

## Producto

- Plataforma web de gestión para restaurantes pequeños y medianos.
- Primer vertical comercial: pizzería.
- El núcleo debe ser reutilizable por hamburgueserías y otros restaurantes sin
  duplicar la aplicación.
- El MVP y sus límites están definidos en `MVP_SCOPE.md` y siempre tienen
  prioridad sobre funciones avanzadas.
- El MVP comercial aprobado incluye autenticación mínima, POS, pedidos, cocina,
  caja, cobro e impresión.
- La separación por organización forma parte del MVP; multi-sucursal no.
- Las fases vigentes son: Fase 0 fundaciones; Fase 1 MVP comercial; Fase 1.5
  estabilización/QA/piloto sin nuevas funciones; Fase 2 inventario y compras;
  Fase 3 operación avanzada; Fase 4 multi-sucursal e integraciones.

## Contrato de trabajo

- Ciclo obligatorio: Plan → Act → Verify.
- Una sola funcionalidad por sesión.
- Ninguna tarea se marca terminada sin evidencia ejecutable obtenida y leída en
  esa sesión.
- Nunca debilitar u omitir controles para conseguir éxito.
- Revisar archivos existentes antes de modificarlos.
- Mostrar el diff completo antes de cualquier commit y esperar autorización
  explícita; los agentes no empujan directamente a `main`.
- Mantener compatibilidad con Codex y Claude Code según `AGENTS.md`.

## Decisiones registradas

- 2026-07-28: LoopKit fue incorporado desde
  `Archive228/loopkit@5ae033e63e698bc7cedacdea1483d8af677f52e1`.
- 2026-07-28: LoopKit se incorporó inicialmente sin modificar hooks o comandos de
  Claude; las diferencias de Codex se resolvieron mediante el contrato común.
- 2026-07-29: se aprobó una adaptación mínima en `.claude/settings.json`: el hook
  de Prettier dejó de usar `2>/dev/null || true` e invoca sólo el ejecutable
  local del proyecto para hacer visibles los fallos y evitar instalaciones
  implícitas.
- 2026-07-28: no se eligieron stack, dependencias de producto, base de datos,
  migraciones, componentes, pantallas ni diseño de interfaz.
- 2026-07-28: `IMPLEMENTATION_PLAN.md` permanece en `STATUS: planning`.
- 2026-07-28: una fase sólo habilita la siguiente con criterios de salida,
  evidencia ejecutable y aprobación explícita.
- 2026-07-28: la fase actual es `phase-0`, en estado documental;
  `phase-0-entry-review` resolvió el alcance y el siguiente gate es
  `phase-0-architecture-review`.
- 2026-07-28: `ADR-0001` aceptó incorporar al MVP el flujo comercial mínimo de
  autenticación → caja → POS/pedido → cocina → cobro → impresión → cierre.
- 2026-07-28: POS, autenticación, caja, cobro e impresión dejaron de estar
  bloqueados por alcance; Fase 1 continúa bloqueada por el cierre pendiente de
  Fase 0.
- 2026-07-28: arquitectura, datos y presupuestos son propuestas; no se aprobaron
  stack, dependencias ni decisiones técnicas definitivas.

## Próximo paso

Ejecutar `phase-0-architecture-review` sin elegir stack ni implementar código.
