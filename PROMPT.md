# Contrato de sesión — phase-0-printing-spike-plan

## Objetivo

Diseñar un spike técnico pequeño, descartable y medible que permita decidir con
hardware real si Tauri 2 es adecuado como runtime del agente local de impresión
del MVP, sin crear el agente ni aceptar ADR-0008.

## Termina cuando

- existen plan, matriz de experimentos, ficha de hardware y criterios
  `GO | NO-GO | NEEDS-FOLLOW-UP`;
- las 20 capacidades del spike tienen experimento y evidencia requerida;
- los 25 escenarios adversariales contienen riesgo, experimento, resultado
  esperado, evidencia, criterio de fallo, mitigación y decisión afectada;
- polling saliente, WebSocket saliente, HTTP local y cola/archivo local se
  comparan sin convertir una hipótesis en protocolo aprobado;
- los tickets mínimos de cocina y caja y el contrato provisional de cola están
  definidos sin código ni datos productivos;
- las métricas poseen procedimiento y baseline, sin umbrales definitivos
  inventados;
- SPK-PRINT-001 a SPK-PRINT-010 quedan `specified`, ninguno `completed`;
- `PRINT-001` y `PRINT-002` siguen bloqueados, Fase 1 permanece bloqueada 13/13
  y ADR-0008 conserva estado `proposed`;
- JSON, enlaces, LoopKit, diff, alcance, secretos y revisión adversarial pasan
  con evidencia fresca.

## Ruta de evaluación

Esta sesión sólo valida documentos. El spike posterior se evaluará en un equipo
Windows objetivo mediante instalación/desinstalación, dos impresoras térmicas
reales cuando estén disponibles, usuario estándar y administrador, red
conectada/desconectada, spooler normal/bloqueado y antivirus activo. Cada ciclo
SPK define su procedimiento exacto antes de ejecutarse.

## No tocar

- código, Rust, Node, proyecto Tauri, manifests, dependencias, CI, servicios,
  impresoras o infraestructura;
- pedidos productivos, facturación, multi-sucursal, diseñador de tickets,
  telemetría productiva u offline-first;
- decisiones aceptadas anteriores o lógica original de LoopKit;
- staging, commits o remotos.

## Detenerse si

- el gate de datos/autenticación deja de estar versionado o aparece un cambio
  ajeno;
- el plan promete certeza física después de `submitted-to-os`;
- se elige plugin, driver, protocolo, instalador o canal de actualización sin
  evidencia del spike;
- se intenta aceptar ADR-0008, desbloquear Fase 1 o reducir un control;
- el diff incorpora cualquier artefacto ejecutable o secreto real.

## Sprint contract — 2026-07-29

Entregable: plan documental reproducible para ejecutar y decidir el spike de
impresión Tauri 2 en sesiones posteriores.

Predicados de aceptación:

- [ ] cuatro entregables `docs/spikes/` existen y sus enlaces resuelven;
- [ ] 20 capacidades, 25 escenarios, 10 ciclos y 4 transportes están cubiertos;
- [ ] cada ciclo declara objetivo, entradas, salida, criterios, pruebas,
      evidencia, rollback y prohibiciones;
- [ ] métricas y hardware pendiente se registran sin resultados inventados;
- [ ] ADR-0008 permanece `proposed` y enlaza el plan y sus criterios;
- [ ] ledger parsea con cero `completed`, spikes `specified` y Fase 1 bloqueada;
- [ ] validación documental, LoopKit, alcance, secretos y revisión fría pasan.

Fuera de alcance: ejecutar el spike, instalar toolchain o dependencias, elegir
definitivamente Tauri/QZ, diseñar interfaz o integrar pedidos reales.
