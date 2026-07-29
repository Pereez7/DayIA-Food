# Limitaciones conocidas — SPK-PRINT-001

- El equipo disponible usa Windows 10 Pro 22H2 build 19045.6466. Está fuera del
  baseline Windows 11 soportado y no puede justificar `GO`.
- La cuenta del proceso no está elevada, pero no se ha demostrado todavía una
  instalación completa con una cuenta estándar separada.
- UAC, Defender, SmartScreen, firewall, instalación y desinstalación requieren
  observación humana; las consultas automatizadas a Defender/firewall devolvieron
  `Access denied`.
- El instalador no está firmado. Una advertencia SmartScreen es posible y debe
  registrarse, no evitarse desactivando el control.
- El icono es una marca técnica neutral requerida por el recurso Windows; no es
  identidad visual ni diseño aprobado de DAYIA FOOD.
- El NSIS incluye WebView2 Offline Installer para evitar red durante
  instalación; esto aumenta de forma material su tamaño y debe medirse.
- No se genera MSI ni se prueba WebView2 ausente/offline en este ciclo.
- Dos instancias no se bloquean deliberadamente: el control de instancia y
  estado durable pertenece a SPK-PRINT-006. Antes de un agente productivo es un
  requisito bloqueante.
- La ruta del proyecto contiene espacios, pero no se ha probado un perfil de
  usuario con caracteres Unicode.
- No hay updater, autostart, servicio Windows, persistencia, logging rotativo,
  firma, backend ni capacidades de impresión.
- El baseline de una sola máquina no define todavía umbrales de rendimiento.
- RustSec reporta seis crates `unic-*` sin mantenimiento en el grafo Windows,
  transitivas de `tauri-utils`. No hay vulnerabilidad conocida, pero deben
  reauditarse antes de aceptar Tauri. Los warnings GTK/ATK/`glib` son de targets
  no Windows y no forman parte del binario x64.
- Los binarios e instaladores viven en `src-tauri/target/`, están ignorados y no
  deben agregarse a Git.

Estas limitaciones no aceptan ADR-0008, no habilitan Fase 1 y no autorizan
SPK-PRINT-002.
