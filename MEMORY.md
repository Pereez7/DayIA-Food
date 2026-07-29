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
- 2026-07-28: la fase actual es `phase-0`, en estado documental; Fase 1 sigue
  bloqueada hasta cerrar todos sus gates.
- 2026-07-28: `ADR-0001` aceptó incorporar al MVP el flujo comercial mínimo de
  autenticación → caja → POS/pedido → cocina → cobro → impresión → cierre.
- 2026-07-28: POS, autenticación, caja, cobro e impresión dejaron de estar
  bloqueados por alcance; Fase 1 continúa bloqueada por el cierre pendiente de
  Fase 0.
- 2026-07-28: arquitectura, datos y presupuestos son propuestas; no se aprobaron
  stack, dependencias ni decisiones técnicas definitivas.
- 2026-07-29: `phase-0-architecture-review` aprobó con acciones las fronteras
  lógicas, fuentes de verdad, transacciones, idempotencia, reconciliación,
  impresión, seguridad y observabilidad del MVP.
- 2026-07-29: persistencia servidor es autoridad; navegador y tiempo real son
  proyecciones. El agente local es el único componente que accede a impresoras y
  no puede garantizar que el papel haya salido físicamente.
- 2026-07-29: no se aprobó offline-first, stack, motor, autenticación, transporte,
  protocolo de impresión ni topología. Fase 1 permanece bloqueada.
- 2026-07-29: ADR-0002 aceptó estados `confirmed`, `in-preparation`, `ready`,
  `completed` y `cancelled`; `draft` no es pedido. Confirmar envía a cocina sin
  exigir pago, el pedido queda inmutable y `completed` significa pagado y
  entregado.
- 2026-07-29: un pedido pagado no se cancela en el MVP; reversos y devoluciones
  están fuera. Las cancelaciones permitidas conservan historia y exigen motivo.
- 2026-07-29: ADR-0003 fijó BOB en centavos enteros, dos decimales sin redondeo
  silencioso ni float binario, snapshots de precio, sin descuentos y número
  visible diario por organización generado por servidor.
- 2026-07-29: ADR-0004 fijó un pago exitoso máximo por pedido, intentos
  idempotentes y pago mixto `excluded-from-mvp`. Caja es un turno organizacional
  compartido, único, con estados `open`, `closing`, `closed`.
- 2026-07-29: roles definitivos owner/cashier/kitchen se autorizan en servidor;
  la organización se deriva de membresía activa y nunca del
  `organization_id` cliente.
- 2026-07-29: impresión usa `submitted` como aceptación de OS, no certeza física;
  `delivery-unknown` no se reintenta automáticamente.
- 2026-07-29: `phase-0-stack-review` aprobó con acciones React/TypeScript/Vite,
  una API Node 24 LTS/Fastify y PostgreSQL/Auth/Realtime administrados por
  Supabase. La API conserva autoridad y RLS es defensa en profundidad.
- 2026-07-29: ADR-0005 aceptó React Router, TanStack Query para remoto, React
  para estado local/derivado, Zustand sólo para borradores POS, Zod/RHF, CSS
  Modules/tokens, Lucide e `Intl`.
- 2026-07-29: ADR-0006 aceptó SQL parametrizado con `pg`, repositorios,
  transacciones y avisos Realtime que fuerzan refetch; schema, RLS y sesión se
  resuelven en el gate de datos/autenticación.
- 2026-07-29: ADR-0007 aceptó monorepo pnpm y toolchain TypeScript/ESLint/
  Prettier/Vitest/Testing Library/Playwright/pgTAP/Gitleaks/OSV, todavía sin
  instalar.
- 2026-07-29: ADR-0008 permanece `proposed`: web y agente están separados,
  Tauri 2 es candidato sujeto a spike Windows/hardware y QZ Tray es contingencia.
- 2026-07-29: despliegue separa web estática, API contenedorizada, Supabase y
  agente local; el proveedor concreto requiere comparación de región, costo,
  rollback y restore.

## Próximo paso

Ejecutar `phase-0-data-and-auth-review` para definir schema PostgreSQL,
migraciones, RLS, sesión, secretos y pruebas de aislamiento, sin inicializar la
aplicación.
