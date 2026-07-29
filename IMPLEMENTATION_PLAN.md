STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: documentation
CURRENT_FEATURE: phase-0-entry-review
NEXT_GATE: phase-0-architecture-review

# Plan de implementación

## Objetivo del ciclo actual

Aplicar formalmente la decisión humana que amplía el MVP al flujo comercial
mínimo, eliminar bloqueos causados sólo por el conflicto anterior y conservar
fuera de alcance las variantes avanzadas.

Esta sesión es documental. No habilita Fase 1 ni autoriza código.

## Decisión aplicada

[`ADR-0001`](docs/decisions/001-flujo-comercial-completo-mvp.md) incluye en el
MVP autenticación mínima, catálogo/POS, pedidos, cocina, caja, cobro e impresión.
La decisión también incluye separación de datos por organización, pero no
multi-sucursal.

## Alcance autorizado del ciclo

- actualizar coordinadamente producto, MVP, fases, catálogo, flujos,
  arquitectura conceptual, calidad, ledger, memoria y changelog;
- crear y registrar el ADR aceptado;
- mover las capacidades aprobadas a Fase 1;
- eliminar `blocked` causado únicamente por falta de aprobación de alcance;
- registrar bloqueos técnicos o documentales que continúen siendo reales;
- verificar exclusiones y ausencia de implementación.

## Fuera de alcance

- código, dependencias, React, Vite, backend o base de datos;
- componentes, pantallas, migraciones o infraestructura;
- elección de stack;
- pago mixto;
- variantes avanzadas de autenticación, POS, cocina, caja, pagos o impresión;
- inventario, compras, proveedores, mesas, delivery avanzado, promociones
  avanzadas, multi-sucursal, fidelización e integraciones;
- commits.

## Plan → Act → Verify

### Plan

- leer todas las fuentes de gobierno;
- localizar referencias contradictorias;
- registrar la decisión y el impacto coordinado;
- definir controles ejecutables.

### Act

- actualizar sólo documentación y estado;
- mantener todas las funcionalidades sin `completed`;
- no sustituir decisiones técnicas pendientes por supuestos.

### Verify

La evidencia debe demostrar:

1. `PRODUCT.md`, `MVP_SCOPE.md` y `PHASES.md` coherentes;
2. autenticación, POS, pedidos, cocina, caja, cobro e impresión dentro del MVP;
3. variantes avanzadas explícitamente fuera;
4. inventario, compras, proveedores, mesas, delivery avanzado y multi-sucursal
   fuera del MVP;
5. ADR aceptado y enlazado;
6. `FEATURE_STATUS.json` válido, con estados controlados y cero `completed`;
7. bloqueos de alcance retirados sólo a las capacidades aprobadas;
8. enlaces locales válidos;
9. cero código, dependencias o migraciones;
10. archivos operativos de LoopKit intactos, salvo adaptaciones de compatibilidad
    aprobadas, documentadas y verificadas;
11. archivos modificados, `git diff --stat` y resumen mostrados;
12. ningún commit creado.

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | Alcance resuelto; arquitectura, stack, modelo y toolchain pendientes |
| Fase 1 | blocked | Fase 0 todavía no cumple sus criterios de salida |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Bloqueos reales restantes

- arquitectura lógica pendiente de revisión y aprobación;
- stack y dependencias sin decidir;
- mecanismo de autenticación sin ADR técnico;
- arquitectura de impresión y agente local sin ADR técnico;
- motor y diseño físico de datos sin ADR;
- estados exactos de pedido y reglas de caja aún requieren especificación;
- pago mixto pendiente de evaluación y fuera del alcance aprobado por defecto;
- comandos de typecheck, lint, tests, build, seguridad y accesibilidad no existen
  porque todavía no hay stack;
- baseline y umbrales de rendimiento pendientes.

## Evidencia del ciclo

- Validador PowerShell de revisión de alcance: código `0`; `PRODUCT.md`,
  `MVP_SCOPE.md` y `PHASES.md` contienen el flujo aprobado y sus exclusiones.
- `FEATURE_STATUS.json`: parse válido; 26 funcionalidades, 0 `completed`, 9/9
  capacidades comerciales aprobadas en `phase-1` y `specified`.
- Bloqueos causados por el conflicto de alcance: 0 restantes.
- Catálogo y ledger: IDs, fase, prioridad y estado coherentes.
- Funcionalidades de fases futuras trasladadas al MVP: 0.
- Enlaces Markdown locales rotos: 0.
- Código, dependencias, migraciones o directorios de producto creados: 0.
- Validador oficial de LoopKit: código `0`, `53 skill(s) OK`.
- Integridad inicial SHA-256 de archivos operativos LoopKit: 65/65 sin
  diferencias antes de la adaptación aprobada.
- Adaptaciones de compatibilidad posteriores: 1 archivo,
  `.claude/settings.json`; el hook de Prettier ya no silencia fallos ni permite
  instalaciones implícitas porque sólo invoca el ejecutable local del proyecto.

## Siguiente paso recomendado — no ejecutar

Realizar una única sesión `phase-0-architecture-review` para revisar la
arquitectura lógica contra el MVP ampliado y decidir qué ADR técnicos deben
resolverse antes de seleccionar stack. No instalar ni implementar tecnología en
esa revisión.
