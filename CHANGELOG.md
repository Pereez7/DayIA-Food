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

### Security

- Se estableció que controles de seguridad, permisos y revisión adversarial no
  pueden omitirse para cerrar una funcionalidad, fase o release.

No se crea `v1.0.0`: el proyecto continúa en planificación.
