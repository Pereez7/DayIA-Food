STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: architecture-review
CURRENT_FEATURE: phase-0-architecture-review
NEXT_GATE: phase-0-domain-review
FEATURE_CATALOG_ID: CORE-001

# Plan de implementación

## Objetivo del ciclo actual

Definir y revisar adversarialmente la arquitectura lógica del MVP antes de
seleccionar tecnologías: componentes, autoridad, transacciones, idempotencia,
aislamiento, recuperación, impresión, seguridad y observabilidad.

Esta sesión es documental. El baseline cuenta con el commit inicial
`1632f27fc60e711aa136c477b71a1c93a5370353`. No se habilita Fase 1 ni se
autoriza código.

`CURRENT_FEATURE` identifica el ciclo de revisión exigido por esta tarea.
`FEATURE_CATALOG_ID` identifica la única funcionalidad activa en el catálogo y
coincide con `FEATURE_STATUS.json.current_feature`. La revisión arquitectónica es
trabajo de verificación de `CORE-001`, no una segunda funcionalidad.

## Resultado de revisión

Veredicto lógico: `approved-with-actions`.

Se aprueban las fronteras y garantías documentadas en
[`SYSTEM_ARCHITECTURE.md`](docs/architecture/SYSTEM_ARCHITECTURE.md). Las
acciones pendientes continúan bloqueando implementación y requieren revisiones o
ADR posteriores.

## Alcance autorizado del ciclo

- definir componentes y fronteras sin fijar topología física;
- asignar fuentes de verdad para pedidos, cocina, caja, pagos, impresión,
  usuarios, roles y organización;
- definir transacciones, idempotencia, auditoría y fallos parciales;
- revisar pedidos, cocina, caja, cobros, impresión, conectividad, seguridad y
  observabilidad;
- ejecutar los 18 escenarios adversariales obligatorios;
- actualizar arquitectura, estado, memoria y changelog de forma coordinada;
- verificar que el alcance y Fase 1 sigan bloqueados.

## Fuera de alcance

- código, dependencias, React, Vite, backend o base de datos;
- componentes, pantallas, migraciones o infraestructura;
- elección de stack;
- selección de motor, proveedor, protocolo o topología;
- aprobación de offline-first;
- pago mixto;
- variantes avanzadas de autenticación, POS, cocina, caja, pagos o impresión;
- inventario, compras, proveedores, mesas, delivery avanzado, promociones
  avanzadas, multi-sucursal, fidelización e integraciones;
- commits o push.

## Plan → Act → Verify

### Plan

- leer todas las fuentes y skills aplicables;
- identificar decisiones lógicas frente a elecciones técnicas pendientes;
- definir un contrato documental verificable y escenarios de refutación.

### Act

- actualizar únicamente arquitectura y fuentes de estado afectadas;
- mantener componentes como límites lógicos, no servicios físicos;
- no crear ADR técnico sin alternativas y aprobación humana;
- mantener todas las funcionalidades sin `completed`.

### Verify

La evidencia debe demostrar:

1. quince componentes mínimos y sus límites definidos;
2. fuentes de verdad inequívocas y navegador/tiempo real no autoritativos;
3. operaciones transaccionales e idempotentes identificadas;
4. aislamiento por organización y autorización servidor;
5. reconciliación tras desconexión sin aprobar offline-first;
6. cola durable, agente local, certeza limitada y reimpresión segura;
7. auditoría y observabilidad sin datos sensibles innecesarios;
8. los 18 escenarios con riesgo, protección, limitación y acción/bloqueo;
9. enlaces locales y JSON válidos;
10. `FEATURE_STATUS.json` con cero `completed` y Fase 1 bloqueada;
11. cero código, dependencias, migraciones o selección de stack;
12. revisión adversarial independiente, estado, diff y resumen mostrados;
13. ningún commit o push creado.

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | Arquitectura lógica revisada; dominio, ADR técnicos, stack y toolchain pendientes |
| Fase 1 | blocked | Fase 0 todavía no cumple sus criterios de salida |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Bloqueos reales restantes

- vocabulario, estados, cancelación, numeración e importes pendientes de revisión
  de dominio;
- stack y dependencias sin decidir;
- mecanismo de autenticación sin ADR técnico;
- arquitectura de impresión y agente local sin ADR técnico;
- motor y diseño físico de datos sin ADR;
- tenancy, tiempo real, sincronización y secretos sin ADR técnico;
- permisos exactos y reglas de caja aún requieren especificación;
- cancelación de pedido cobrado bloqueada hasta definir reverso/anulación;
- pago mixto pendiente de evaluación y fuera del alcance aprobado por defecto;
- comandos de typecheck, lint, tests, build, seguridad y accesibilidad no existen
  porque todavía no hay stack;
- baseline y umbrales de rendimiento pendientes.

## Evidencia del ciclo

- Validador estructural documental: 13 documentos requeridos presentes; 15
  componentes, 11 fuentes de verdad, 18 escenarios adversariales y 10
  operaciones de conectividad cubiertos.
- Primera ejecución del wrapper de `git diff --check`: código `1` porque
  PowerShell convirtió advertencias CRLF de Git en errores; no hubo hallazgo de
  contenido. Repetición con captura explícita: código `0`.
- Matriz semántica: 21/21 requisitos arquitectónicos localizados.
- Enlaces Markdown locales rotos: 0.
- `FEATURE_STATUS.json`: parse válido; 26 funcionalidades, 0 `completed`; las 13
  funcionalidades de Fase 1 conservan el bloqueo `phase-0 not completed`.
- Catálogo/ledger: 26 IDs, 0 duplicados, 0 estados inválidos, 0 IDs ausentes.
- Skills de LoopKit: 53/53 con frontmatter y campos requeridos válidos.
- Secretos detectados en el diff: 0.
- Código, dependencias, migraciones o directorios de producto creados: 0.
- Selecciones de React, Vite, Supabase, PostgreSQL, Electron o Tauri en
  arquitectura: 0.
- Primera revisión adversarial independiente: `passes: false` por correspondencia
  ambigua entre ciclo y `CORE-001`; se añadió `FEATURE_CATALOG_ID`.
- Segunda revisión adversarial independiente: `{"passes":true,"failures":[]}`.
- Archivos del alcance: 13; cambios ajenos: 0.
- Commit o push creado durante esta tarea: 0.

## Siguiente paso recomendado — no ejecutar

Realizar una única sesión `phase-0-domain-review` para aprobar vocabulario,
estados/transiciones, cancelación, numeración visible, precisión/redondeo,
permisos sensibles y política de operaciones pendientes. No seleccionar stack ni
implementar código.
