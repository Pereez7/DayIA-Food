# Contrato de sesión — SPK-PRINT-001

## Objetivo

Crear y verificar un bootstrap descartable Tauri 2 para Windows que permita
medir desarrollo, compilación, ejecución, instalador NSIS por usuario y
desinstalación, sin implementar ninguna capacidad de impresión.

## Termina cuando

- el único código nuevo vive en `spikes/printing-agent/`;
- la ventana muestra `SPK-PRINT-001`, versiones de aplicación/Tauri, OS,
  arquitectura, disponibilidad de WebView2 y `runtime-operational`;
- pruebas automatizadas demuestran identificador único, configuración per-user,
  ausencia de elevación, updater, autostart, red y capacidades de impresión;
- las compilaciones debug/release y el instalador NSIS producen artefactos
  identificados con hash;
- una ejecución real prueba que el proceso inicia y cierra, y registra baseline
  básico de tiempo, CPU, RAM, disco y conexiones de red;
- `README.md`, `EVIDENCE.md`, `MANUAL_TEST_CHECKLIST.md` y
  `KNOWN_LIMITATIONS.md` contienen comandos y evidencia reproducibles;
- las verificaciones documental, JSON, enlaces, dependencias, secretos, diff,
  LoopKit y revisión adversarial se ejecutan con evidencia fresca;
- cualquier validación manual no confirmada mantiene el resultado
  `manual-validation-pending` y `SPK-PRINT-001` en `verifying`.

## Ruta de evaluación

Automatizada:

```text
npm ci --ignore-scripts
npm test
npm run tauri:build:debug
npm run tauri:build
```

Runtime: abrir el ejecutable generado, comprobar la ventana técnica y cerrarla
desde el control visible. Instalación manual: ejecutar el NSIS como usuario
estándar, validar UAC/SmartScreen/AV, iniciar/cerrar y desinstalar desde Windows.

## No tocar

- enumeración, selección o acceso a impresoras;
- spooler, ESC/POS, tickets, cola, jobs, reintentos o comunicación servidor;
- API, base de datos, autenticación, aplicaciones productivas o infraestructura;
- updater, autostart, firma, listeners, puertos o telemetría remota;
- `SPK-PRINT-002` en adelante, `PRINT-001`, `PRINT-002` o ADR-0008;
- staging, commits, push o lógica original de LoopKit.

## Detenerse si

- faltan C++ Build Tools o WebView2 y su instalación requiere flujo pesado,
  interactivo o reinicio;
- aparece un cambio ajeno en el árbol de trabajo;
- una prueba previamente verde falla por el spike;
- se requiere elevar el proceso normal, desactivar AV/firewall o debilitar un
  control;
- el código sale de `spikes/printing-agent/`.

## Sprint contract — 2026-07-29

Entregable: bootstrap Tauri 2 descartable que abre una ventana técnica
identificable y genera un NSIS per-user sin capacidades de impresión o red
externa. El IPC empaquetado de Tauri no constituye un listener ni transporte de
red.

Predicados de aceptación:

- [ ] pruebas automatizadas del contrato pasan sin exclusiones;
- [ ] build debug y release terminan con código 0;
- [ ] el binario release inicia, permanece operativo y cierra limpiamente;
- [ ] el NSIS per-user existe, tiene hash y no solicita privilegio permanente;
- [ ] no existen permisos o tráfico de red externa, shell, filesystem general,
      updater, autostart ni impresión; el instalador WebView2 es offline;
- [ ] artefactos y evidencia quedan inventariados sin secretos;
- [ ] validaciones manuales no observadas permanecen pendientes y bloquean
      `completed`.

Fuera de alcance: imprimir, enumerar hardware, persistir cola, integrar servidor,
aceptar Tauri o habilitar Fase 1.
