STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: printing-spike-plan
CURRENT_FEATURE: phase-0-printing-spike-plan
NEXT_GATE: phase-0-printing-spike
FEATURE_CATALOG_ID: CORE-001

# Plan de implementación

## Objetivo del ciclo

Especificar un spike descartable y medible para decidir si Tauri 2 es adecuado
como runtime del agente local de impresión del MVP. Esta sesión sólo entrega el
contrato de ejecución; no prueba Tauri, impresoras, instaladores ni protocolo.

## Resultado documental

Veredicto documental final: `approved-with-actions`.

Quedan especificados 20 capacidades, 25 escenarios adversariales, cuatro
transportes, dos tickets, métricas, hardware y diez ciclos. ADR-0008 continúa
`proposed`; `PRINT-001`, `PRINT-002` y toda Fase 1 siguen bloqueados.

## Contrato del spike

- Windows 11 x64 soportado es objetivo primario.
- Windows 10 sólo se prueba como compatibilidad condicionada LTSC/ESU.
- Tauri 2 es candidato; QZ Tray es contingencia bajo el mismo gate.
- NSIS per-user y polling HTTPS saliente son hipótesis, no decisiones.
- Driver/spooler Windows y raw ESC/POS se comparan según hardware.
- `submitted-to-os` no prueba papel; `delivery-unknown` nunca reintenta solo.
- Sólo trabajos ya recibidos pueden concluir durante una caída de Internet.
- Hardware, AV/firewall, estándar/admin y ciclo de instalación son obligatorios.

## Plan → Act → Verify

### Plan

- confirmar commit del gate anterior y árbol limpio;
- leer fuentes, ADR, quality gates y skills;
- fijar `PROMPT.md` antes de redactar entregables;
- contrastar hechos variables con fuentes oficiales.

### Act

- crear plan, matriz, ficha y criterios go/no-go;
- convertir preguntas y riesgos en experimentos;
- definir tickets/cola/comunicación/seguridad/logs/métricas;
- dividir ejecución en SPK-PRINT-001–010;
- sincronizar arquitectura, calidad, secretos, ADR, ledger y memoria.

### Verify

1. JSON parseable, cero `completed`, diez spikes `specified`;
2. Fase 1 bloqueada 13/13 y `PRINT-001`/`PRINT-002` bloqueados;
3. ADR-0008 contiene `proposed` y enlaza plan/criterios;
4. 20 capacidades, 25 escenarios, 10 ciclos y 4 transportes;
5. cada ciclo cubre ocho campos contractuales;
6. enlaces Markdown resuelven;
7. LoopKit y `run.sh` validan;
8. revisión adversarial fría y red flags sin hallazgos;
9. cero código, manifests, dependencias, secretos, staging, commit o push;
10. `git diff --check` verde.

## Estado de ciclos

| Ciclo | Estado | Bloqueo principal |
|---|---|---|
| SPK-PRINT-001 | specified | toolchain y Windows objetivo no inicializados |
| SPK-PRINT-002 | specified | hardware/adapter no inventariados |
| SPK-PRINT-003 | specified | impresora cocina no registrada |
| SPK-PRINT-004 | specified | impresora caja no registrada |
| SPK-PRINT-005 | specified | dos roles físicos no validados |
| SPK-PRINT-006 | specified | estado local descartable no elegido |
| SPK-PRINT-007 | specified | servidor simulado no creado |
| SPK-PRINT-008 | specified | cola/transporte no ejecutados |
| SPK-PRINT-009 | specified | artefacto instalable no existe |
| SPK-PRINT-010 | specified | evidencia 001–009 ausente |

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | plan de spike listo; ejecución y otros gates pendientes |
| Fase 1 | blocked | Fase 0 no está cerrada |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Decisiones y riesgos pendientes

- modelo exacto de ambas impresoras, ancho, driver, conexión, ESC/POS y corte;
- API/plugin/adaptador de impresión después de revisión de mantenimiento;
- identidad estable de impresora después de pruebas físicas;
- MSI frente a NSIS y estrategia WebView2 offline;
- polling frente a WebSocket y contrato/lease final;
- persistencia local descartable y luego productiva;
- firma, updater, almacenamiento seguro y operación de soporte;
- baselines y presupuestos definitivos;
- decisión `GO | NO-GO | NEEDS-FOLLOW-UP` y aceptación/rechazo de ADR-0008.

## Evidencia documental

Evidencia ejecutada el 2026-07-29:

| Control | Resultado |
|---|---|
| Precondiciones | `main`; árbol inicial limpio; gate previo en `ed4125a` |
| Ledger | JSON válido; 0 `completed`; 10/10 SPK `specified`; Fase 1 bloqueada 13/13 |
| ADR/gates | ADR-0008 `proposed`; `PRINT-001`/`PRINT-002` bloqueados; siguiente gate correcto |
| Cobertura | 20 capacidades; 25 escenarios; 10 ciclos × 8 campos; 4 transportes |
| Contratos | 11 eventos; 11 campos de cola; 15 riesgos; dos perfiles de equipo |
| Enlaces | 124 Markdown; 72 enlaces locales; 0 rotos |
| LoopKit | 53/53 skills válidos; `bash -n run.sh` verde |
| Alcance/secretos | 15 archivos; 0 código, manifests, dependencias o secretos de alta confianza |
| Git | `git diff --check` verde; staging vacío |
| Revisión fría | primera pasada `FAIL` con 4 hallazgos; segunda `PASS`, 0 hallazgos |

No se declaran verdes instalación, impresión, hardware, AV, offline,
actualización o rendimiento: permanecen `not-tested`/`INSUFFICIENT`. Typecheck,
tests de producto y build siguen `blocked` porque no existe implementación.

## Siguiente paso recomendado — no ejecutar

Ejecutar una única sesión `SPK-PRINT-001` para bootstrap, instalación,
ejecución/desinstalación y baseline inicial en Windows objetivo. Antes deberá
autorizarse explícitamente la instalación de Rust/Node/Tauri y dependencias del
spike.
