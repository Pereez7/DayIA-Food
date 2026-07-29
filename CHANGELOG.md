# Changelog

Todos los cambios notables de DAYIA FOOD se documentarán en este archivo.

El formato sigue los principios de Keep a Changelog y el proyecto adoptará
versionado semántico cuando exista una primera versión publicable.

## [Unreleased]

### Added

- ADR-0001 aceptado para incorporar el flujo comercial completo al MVP.
- Contrato de desarrollo por fases y bloqueo formal entre fases.
- Catálogo inicial y ledger estructurado de funcionalidades.
- Flujos operativos documentados con separación entre MVP vigente y candidatos.
- Propuesta inicial de arquitectura y diseño conceptual de datos.
- Quality gates, estrategia de pruebas, Definition of Done, presupuesto de
  rendimiento y checklist de release.
- Registro de deuda técnica y guía para Architecture Decision Records.
- Contratos lógicos de componentes, pedidos, caja/cobros, impresión,
  conectividad, seguridad y observabilidad.
- Modelo de dominio canónico con estados, pagos, caja, dinero, numeración,
  permisos, impresión, invariantes y 25 escenarios adversariales.
- ADR-0002 a ADR-0004 para ciclo comercial, dinero/numeración y pago/caja.
- Matrices de selección tecnológica, estrategia de repositorio y despliegue.
- ADR-0005 a ADR-0007 para web/contratos, backend/datos/auth y
  monorepo/toolchain.
- ADR-0008 propuesto y gate de spike para el agente local de impresión.
- Veinticinco escenarios adversariales del stack.
- Modelo físico conceptual de datos, tenancy/RLS, transacciones, idempotencia,
  migraciones, backup/restore, Auth/sesiones, autorización, secretos y contratos.
- ADR-0009 a ADR-0012 para datos/tenancy, auth, migraciones/recuperación y
  autoridad OpenAPI.
- Veinticinco escenarios adversariales específicos de datos y autenticación.
- Plan, matriz, ficha de hardware y criterios go/no-go para el spike Tauri 2.
- Diez ciclos `SPK-PRINT-001` a `SPK-PRINT-010`, veinte capacidades y
  veinticinco escenarios adversariales de impresión.

### Changed

- Alcance del MVP ampliado coordinadamente a autenticación mínima, POS, pedidos,
  cocina, caja, cobro e impresión.
- Separación por organización incorporada al MVP, manteniendo multi-sucursal en
  Fase 4.
- POS, autenticación, caja, cobro e impresión cambiaron de candidatos bloqueados
  a funcionalidades `specified` de Fase 1.
- Fase 2 incluye explícitamente ingredientes y mermas.
- Contrato común de agentes alineado con desarrollo por fases.
- Plan de implementación actualizado a gobierno documental de Fase 0.
- Alcance del MVP enlazado a la planificación por fases sin ampliarlo.
- Memoria del proyecto actualizada con decisiones estables.
- Hook de formato de LoopKit ajustado para no silenciar fallos ni instalar
  Prettier implícitamente.
- Arquitectura lógica del MVP revisada como `approved-with-actions`, manteniendo
  pendientes stack, ADR técnicos y revisión de dominio.
- Pedido reducido a cinco estados persistidos, con pago separado y entrega
  explícita en `completed`.
- BOB representado conceptualmente en centavos enteros; precios históricos,
  número diario servidor y caja organizacional quedaron definidos.
- Pago mixto pasó de evaluación pendiente a `excluded-from-mvp`.
- Estados de impresión adaptados para no equiparar envío al OS con impresión
  física.
- Dirección tecnológica actualizada a React/TypeScript/Vite, API
  Node/Fastify, Supabase PostgreSQL/Auth/Realtime y pnpm workspaces.
- Estrategias de seguridad, pruebas, quality gates y rendimiento concretadas
  como contratos futuros sin declarar herramientas instaladas.
- Siguiente gate cambiado a `phase-0-data-and-auth-review`; Fase 1 sigue
  bloqueada.
- Frontend limitado a Supabase Auth/Realtime privado; Fastify es la única vía
  comercial y deriva organización/rol desde DB.
- Migraciones fijadas a Supabase CLI SQL forward-only/expand-contract, con PITR
  previo al piloto y restore obligatorio.
- Siguiente gate cambiado a `phase-0-printing-spike-plan`; Fase 1 continúa
  bloqueada.
- Spike de impresión convertido en contrato ejecutable por ciclos, con Windows
  11 soportado como objetivo primario y Windows 10 condicionado a LTSC/ESU.
- Polling HTTPS saliente, NSIS per-user, spooler/driver y raw ESC/POS quedaron
  como hipótesis comparables, no decisiones aceptadas.
- Siguiente gate cambiado a `phase-0-printing-spike`; ADR-0008 sigue `proposed`
  y Fase 1 permanece bloqueada.

### Security

- Se estableció que controles de seguridad, permisos y revisión adversarial no
  pueden omitirse para cerrar una funcionalidad, fase o release.
- Organización definida como frontera de datos y autorización servidor como
  control obligatorio; el contexto recibido del cliente no es confiable.
- Matriz de roles y auditoría de acciones sensibles definidas con denegación por
  defecto y autorización secundaria de owner cuando aplica.
- API autoritativa, RLS en profundidad, SQL parametrizado, escaneo futuro de
  secretos/dependencias y credenciales por dispositivo establecidos como
  controles del stack.
- JWT asimétrico/JWKS, revocación aplicativa, FK tenant compuestas, RLS
  default-deny/FORCE, service role aislada y secrets por ambiente definidos como
  controles obligatorios.

No se crea `v1.0.0`: el proyecto continúa en planificación.
