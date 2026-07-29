# Evidencia — SPK-PRINT-001

## Resultado

`manual-validation-pending` — la evidencia automatizada pasó, pero instalación,
UAC/Defender/SmartScreen, cuenta estándar y desinstalación requieren confirmación
humana. El ledger permanece `verifying`, nunca `completed`.

## Identidad

| Campo | Valor |
|---|---|
| Fecha | 2026-07-29 |
| Commit base | `76617fc` |
| Rama | `main` |
| Estado inicial | limpio |
| Artefacto | `com.dayiafood.spk-print-001`, versión `0.1.0` |
| Cuenta de proceso | no elevada |

## Entorno detectado

| Componente | Versión/resultado | Tipo |
|---|---|---|
| Windows | 10 Pro 22H2, build 19045.6466, x64 | automatizada |
| Node | 24.15.0 | automatizada |
| npm | 11.12.1 | automatizada |
| Tauri CLI | 2.11.4 | automatizada |
| Rust/Cargo | 1.97.1, host x86_64-pc-windows-msvc | automatizada |
| MSVC | VS 2022 Community, toolset 14.44.35207 | automatizada |
| WebView2 | 150.0.4078.105 | automatizada |
| Defender/firewall | consulta bloqueada por permisos | no medido; manual pendiente |

Rustup tenía configuración previa, aunque sus binarios no estaban visibles en
PATH. El instalador oficial dejó el toolchain estable ya existente en 1.97.1 y
añadió el acceso de usuario; no se actualizó npm ni Visual Studio.

## Comandos y controles

| Control | Comando/procedimiento | Resultado |
|---|---|---|
| Precondición | `git status --short; git log -3 --oneline; git branch --show-current` | exit 0; limpio; `main`; plan `76617fc` |
| Test rojo | `npm.cmd test` antes del bootstrap | exit 1; 5 fallos por archivos requeridos ausentes |
| Test verde final | `npm.cmd test` | exit 0; 7/7 |
| Formato Rust | `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | exit 0 |
| Config/entorno | `npm.cmd exec tauri info` con Cargo en PATH | exit 0; entorno reconocido |
| npm install | `npm.cmd install --ignore-scripts` | exit 0; 2 paquetes |
| npm clean install | `npm.cmd ci --ignore-scripts` | exit 0; 2 paquetes desde lockfile |
| npm audit | `npm.cmd audit --audit-level=high` | exit 0; 0 vulnerabilidades |
| Primer build debug | `npm.cmd run tauri:build:debug` | exit 1; faltaba `icons/icon.ico`; fallo conservado |
| Recurso Windows | test rojo → `tauri icon` → conservar sólo `.ico` | test rojo 1/6; después 6/6 |
| Build debug final | `npm.cmd run tauri:build:debug` | exit 0; 3.29 s incremental |
| Build release/NSIS final | `npm.cmd run tauri:build` | exit 0; compilación Rust 19.90 s; un NSIS con WebView2 offline |
| Runtime final | `powershell -ExecutionPolicy Bypass -File scripts/verify-runtime.ps1` | exit 0; `RUNTIME_SMOKE=PASS` |
| Clippy | `cargo clippy --all-targets -- -D warnings` | exit 0 |
| Cargo audit | `cargo audit --file src-tauri/Cargo.lock` | exit 0; 0 vulnerabilidades; 15 warnings |
| JSON/enlaces | Node JSON parse + resolvedor Markdown | 5 JSON y 69 Markdown; 0 fallos |
| LoopKit | 53 frontmatters + Git Bash syntax/hooks | 53/53; hooks y JSON exit 0 |
| Secret/scope | regex alta confianza + files + source scan | 0 secretos; 0 archivos sensibles; 0 capacidades prohibidas |
| Git | `git diff --check`, staging, ignore gates | exit 0; staging 0; artefactos ignorados |
| Instalación/desinstalación | checklist humano | pendiente |

La verificación final automatizada fue ejecutada por Codex el
`2026-07-29T20:18:53.3225291Z`. El verificador observó durante 50 muestras el
árbol completo del proceso, conservó los endpoints TCP únicos, cerró la ventana
y comprobó procesos residuales. Una primera ejecución falló porque contabilizaba
también sockets IPC loopback como red externa; el control se corrigió para
reportar ambos conjuntos sin ocultarlos ni omitirlos.

Salida estructurada final del runtime:

```text
OperationalMarker=true; WindowReady=true; StartupMilliseconds=394.3
WorkingSetMiB=20.64; PrivateMiB=4.96; CpuSeconds=0.078; Threads=31
NetworkSampleCount=50; TcpConnectionsObserved=56
UniqueTcpEndpointsObserved=8; ExternalTcpConnectionsObserved=0
CloseSent=true; Exited=true; ResidualProcesses=0
```

Los ocho endpoints únicos eran IPC loopback de WebView2 (`::1` o
`127.0.0.1`, puerto remoto 80) y sockets enlazados sin destino externo
(`::`/`0.0.0.0`). No se observó una conexión TCP externa.

## Métricas

| Métrica | Valor | Tipo |
|---|---:|---|
| Instalación Rust | 15.5 s observados por comando | automatizada |
| Instalación npm | 4.4 s para install/list/audit | automatizada |
| Build debug final | 10.66 s | automatizada |
| Compilación release inicial | 75 s del compilador; bundle generado | automatizada |
| Rebuild release + NSIS offline | compilación Rust 19.90 s; bundle completado | automatizada |
| Ejecutable debug | 11.41 MiB | automatizada |
| Ejecutable release | 7.19 MiB | automatizada |
| Instalador NSIS offline | 198.45 MiB | automatizada |
| Inicio final | 394.3 ms | automatizada |
| RAM final | working set 20.64 MiB; private 4.96 MiB | automatizada |
| CPU/threads tras 5 s | 0.078 s acumulados; 31 threads | automatizada |
| Procesos/conexiones | app + conhost + WebView2; 8 endpoints loopback/bound; 0 conexiones externas; 0 residuales | automatizada |
| Huella `target/` | 4,667,908,112 bytes (4.35 GiB) de cache/build | automatizada |

## Veinte escenarios adversariales

| # | Escenario | Resultado | Evidencia | Mitigación | Bloqueo | Prueba futura |
|---:|---|---|---|---|---|---|
| 1 | Rust ausente | observado y resuelto | detección + rustup oficial 1.97.1 | perfil MSVC mínimo | no | clon limpio |
| 2 | Node ausente | no ocurrió | Node 24.15.0 | prerrequisito documentado | no | PC limpio |
| 3 | C++ Build Tools ausente | no ocurrió | VS 2022/toolset detectado | detener si falta | no | PC limpio |
| 4 | WebView2 ausente | no ocurrió | runtime 150.0.4078.105 | instalador offline incluido en NSIS | no | SPK-009 |
| 5 | build requiere admin | no | debug/release exit 0 con proceso no elevado | mantener toolchain usuario | no | Windows 11 objetivo |
| 6 | instalador requiere admin | pendiente manual | NSIS `currentUser` configurado | no relanzar elevado | sí hasta validar | checklist |
| 7 | SmartScreen bloquea | pendiente manual | binario sin firma | registrar; firma futura | no concluyente | checklist |
| 8 | Defender detecta | pendiente manual | API devolvió Access denied | controles activos | sí si exige exclusión | checklist |
| 9 | aplicación en blanco | no concluyente visual | ventana + IPC operativos; sin inspección humana | contenido empaquetado | sí hasta validar | checklist |
| 10 | WebView2 no carga | no ocurrió | marcador frontend→IPC y ventana lista | runtime requerido | no | Windows 11 |
| 11 | proceso queda activo | no por cierre de ventana | `CloseMainWindow`, exit y 0 residuales | botón manual pendiente | no automatizado | checklist botón |
| 12 | desinstalador deja archivos | pendiente manual | aún no instalado | inventario before/after | sí | checklist |
| 13 | dos instancias | esperado/no probado | sin plugin single-instance | runtime sin estado/efectos | no en 001; sí productivo | SPK-006 |
| 14 | ruta con espacios | pasó | ambos builds desde `DayIA Food` | rutas literales | no | conservar regresión |
| 15 | usuario con caracteres especiales | no probado | perfil sólo contiene punto | rutas Unicode seguras | no concluyente | PC objetivo |
| 16 | versiones incompatibles | no ocurrió | CLI/schema y debug/release exit 0 | pins + lockfiles | no | CI futura |
| 17 | instalador excesivo | 198.45 MiB medido | inventario de artefactos | comparar offline vs. bootstrapper en decisión posterior | no concluyente | Windows 11/piloto |
| 18 | runtime accede a red externa | no observado | 50 muestras del árbol; 8 endpoints IPC/bound; 0 externos; CSP sólo IPC | mantener sin plugins | sí si aparece | repetir instalado |
| 19 | dependencia vulnerable | 0 vulnerabilidades; 15 warnings | npm audit + RustSec | revisar transitivas Tauri | acción antes de GO | repetir al decidir ADR |
| 20 | binarios entran a Git | no | ignore gates + staging 0 | outputs acotados | sí si trackeados | gate final |

## Artefactos

| Artefacto | SHA-256 | Firma |
|---|---|---|
| `target/debug/dayia-food-spk-print-001.exe` | `FE5D2E14F821D43382C77B00DF4341142AF6D8141628D8E4076E2F9F9BAA7492` | no firmado |
| `target/release/dayia-food-spk-print-001.exe` | `27517F6027402F53732E052CD2A20F94EFF64F08228728FAEF5B0B0A14D71A4E` | no firmado |
| `target/release/bundle/nsis/DAYIA FOOD — SPK-PRINT-001_0.1.0_x64-setup.exe` | `8D8510ECA8060C1766C4B48B9FC55B6C9396A2DF24693F732DAF58D40C1AFE2F` | no firmado |

Los tres artefactos y todo `target/` están excluidos de Git.

## Hallazgos de dependencias

RustSec detectó 0 vulnerabilidades y 15 warnings. El advisory de soundness
`RUSTSEC-2024-0429` (`glib`) y los avisos GTK/ATK no pertenecen al grafo
`x86_64-pc-windows-msvc`. Seis crates `unic-*` sin mantenimiento sí llegan
transitivamente mediante `urlpattern → tauri-utils`; no hay reemplazo directo
controlado por el spike. Es acción obligatoria volver a auditar la versión
vigente antes de una propuesta `GO`/aceptación de ADR-0008.

En el grafo objetivo `x86_64-pc-windows-msvc`, `reqwest` y `hyper` no están
presentes. `tokio` llega por Tauri con `bytes`, `io-util`, `default`, `fs`,
`rt`, `rt-multi-thread` y `sync`, sin la feature `net`. Esto complementa, pero
no reemplaza, la prueba conductual de 50 muestras.

## Revisión adversarial independiente

Pascal realizó la primera revisión fría sobre el diff completo y devolvió
`FAIL` con ocho hallazgos: instalador WebView2 dependiente de red; test que
consagraba esa opción; evidencia de red insuficiente; errores JavaScript poco
observables; evidencia manual/automática sin comando y tiempo precisos; registro
de validadores/revisor insuficiente; y ambigüedad doble sobre `NEXT_GATE`.

Las correcciones fueron: `offlineInstaller`; contrato actualizado; medición del
árbol completo y endpoints externos; categorías seguras de error visibles;
comando, tiempo y salida reproducibles en este documento; y aclaración de que
`NEXT_GATE: SPK-PRINT-002` sólo nombra al sucesor planificado, no lo habilita.
Pascal repitió la revisión fría sobre el diff fresco y devolvió `PASS`, sin
hallazgos correctivos. Conservó como riesgos residuales: las doce validaciones
manuales bloqueantes; inspección visual y cierre mediante el botón pendientes;
seis crates `unic-*` sin mantenimiento; el límite muestral de la observación de
red; y el tamaño de 198.45 MiB del instalador offline. Ningún riesgo se convirtió
en un falso verde ni habilitó el siguiente spike.

## Decisiones

- npm se usa sólo dentro del spike aislado; no inicializa el monorepo futuro.
- No se añadió `@tauri-apps/api`: el frontend estático usa el bridge global para
  dos comandos propios.
- Las capabilities core/plugin están vacías. Los únicos comandos registrados
  son `runtime_info` y `close_app`.
- La CSP permite exclusivamente el IPC interno documentado por Tauri; no permite
  HTTP/HTTPS/WebSocket externo.
- Resultado final previsto mientras falte evidencia humana:
  `manual-validation-pending`, nunca `completed`.
