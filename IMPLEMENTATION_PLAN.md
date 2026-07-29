STATUS: implementation
CURRENT_PHASE: phase-0
PHASE_STATUS: printing-spike
CURRENT_FEATURE: SPK-PRINT-001
NEXT_GATE: SPK-PRINT-002
FEATURE_CATALOG_ID: SPK-PRINT-001

# Plan de implementación

`NEXT_GATE` identifica al sucesor planificado, no un gate habilitado. Mientras
SPK-PRINT-001 esté `verifying`, SPK-PRINT-002 permanece prohibido y su estado no
cambia.

## Objetivo del ciclo

Construir y medir un bootstrap Tauri 2 mínimo y descartable para Windows. La
sesión sólo cubre entorno, compilación, runtime, instalador NSIS per-user,
desinstalación y baseline inicial; no incluye ninguna lógica de impresión.

## Plan → Act → Verify

### Plan

- confirmar plan previo versionado, rama y árbol limpio;
- leer contratos, spike, arquitectura, seguridad y quality gates;
- detectar versiones de Windows, cuenta, Node, Rust, C++ Build Tools y WebView2;
- fijar `PROMPT.md`, estado del ledger y pruebas contractuales antes del código.

### Act

- instalar únicamente Rust si falta, mediante el instalador oficial;
- crear `spikes/printing-agent/` con frontend estático y runtime Tauri 2 mínimos;
- limitar capabilities, CSP, bundle e instalador al contrato de SPK-PRINT-001;
- crear pruebas automatizadas antes del bootstrap y observar su fallo inicial;
- documentar comandos, evidencia, checklist manual y limitaciones.

### Verify

1. tests de contrato y smoke frontend sin exclusiones;
2. build debug y release x64 con artefactos y hashes;
3. runtime real con inicio, proceso, cierre, recursos y cero conexiones externas;
4. NSIS per-user generado e inventariado;
5. dependencias, secretos, CSP, capabilities y configuración auditados;
6. enlaces, JSON, LoopKit, `git diff --check` y alcance verificados;
7. veinte escenarios adversariales registrados con evidencia o pendiente;
8. revisión fría independiente contra `PROMPT.md`;
9. staging vacío, sin commit ni push;
10. validación manual pendiente impide `completed`.

## Estado inicial observado

| Control | Resultado |
|---|---|
| Git | `main`, árbol limpio, plan previo en `76617fc` |
| Cuenta | no elevada |
| Windows | Windows 10 Pro 22H2 build 19045.6466; no es baseline soportado |
| Node/npm | `24.15.0` / `11.12.1` |
| C++ Build Tools | Visual Studio 2022, toolset `14.44.35207` |
| WebView2 | Evergreen `150.0.4078.105` |
| Rust | ausente; instalación oficial necesaria |
| Defender/firewall | consulta automatizada bloqueada por permisos; manual pendiente |

## Estado de ciclos

| Ciclo | Estado |
|---|---|
| SPK-PRINT-001 | verifying; manual-validation-pending |
| SPK-PRINT-002–010 | specified; no ejecutar |

## Resultado actual

`manual-validation-pending`. Tests, clippy, builds debug/release, runtime y NSIS
per-user tienen evidencia automatizada. SPK-PRINT-001 permanece `verifying`
porque faltan instalación/desinstalación humana, UAC/Defender/SmartScreen y
Windows 11 x64 objetivo. Windows 10 Pro fuera de soporte no puede aprobar el
baseline.

## Siguiente paso recomendado — no ejecutar aún

Ejecutar el checklist de instalación y desinstalación de SPK-PRINT-001 en
Windows 11 x64 soportado con una cuenta estándar y AV/firewall activos. Recoger
las doce respuestas en `spikes/printing-agent/MANUAL_TEST_CHECKLIST.md`. No
iniciar SPK-PRINT-002 antes de revisar esa evidencia.
