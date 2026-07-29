# Plan del spike de impresión

## Estado y decisión que habilita

`specified` — este documento define cómo obtener evidencia para ADR-0008. No
crea el agente, no selecciona una dependencia de impresión y no acepta Tauri 2.

El spike responde una sola pregunta: **¿Tauri 2 permite operar un agente local
de impresión suficientemente instalable, seguro, observable y resistente para
el MVP en el hardware Windows objetivo?**

Fuentes complementarias:

- [matriz de experimentos](PRINTING_SPIKE_MATRIX.md);
- [ficha de hardware](PRINTING_HARDWARE_TEMPLATE.md);
- [regla de decisión](PRINTING_GO_NO_GO.md);
- [arquitectura lógica](../architecture/PRINTING_ARCHITECTURE.md).

## Límites

Incluye instalación, descubrimiento/selección de dos impresoras, tickets de
prueba, spooler/ESC-POS, cola local mínima, idempotencia, fallos, comunicación
simulada, offline limitado, seguridad, observabilidad, rendimiento, actualización
y desinstalación.

Excluye agente productivo, UI completa, pedidos reales, facturación fiscal,
múltiples estaciones/sucursales, diseñador de tickets, firma final, soporte
remoto, telemetría productiva, impresión móvil y creación de pedidos offline.

Todo artefacto ejecutable del spike posterior será descartable y no entrará en
la aplicación hasta una decisión explícita posterior.

## Plataforma y prerrequisitos a comprobar

### Matriz inicial

| Objetivo | Papel en el spike | Condición |
|---|---|---|
| Windows 11 25H2 x64 Home/Pro | baseline primario | prueba con usuario estándar y administrador |
| Windows 11 26H1 x64 | compatibilidad adelantada | ejecutar si existe equipo objetivo; no sustituye baseline 25H2 |
| Windows 11 24H2 x64 | transición | sólo antes de su fin de soporte 2026-10-13 y junto a 25H2 |
| Windows 10 x64 LTSC o equipo cubierto por ESU | compatibilidad condicionada | sólo si representa hardware real del piloto |
| Windows 10 Home/Pro sin soporte, Windows 7/8, ARM | fuera del soporte inicial | no pueden justificar `GO` |

Windows 10 Home/Pro terminó soporte general el 2025-10-14. La ficha registra
edición, versión, build y estado de actualizaciones; no se promete compatibilidad
por el solo hecho de que el binario abra.

Para desarrollar Tauri en Windows se verifican Microsoft C++ Build Tools, Rust y
WebView2; Node sólo será necesario por el frontend mínimo que se elija en
SPK-PRINT-001. El equipo de destino no debe requerir toolchain de desarrollo.
WebView2 Evergreen es la hipótesis inicial; se medirá presencia, instalación y
operación sin internet. No se usará `skip` si el runtime falta.

### Instaladores

Se comparan MSI y NSIS, sin decidirlos todavía:

- NSIS `perUser` es la hipótesis primaria porque Tauri documenta instalación en
  `%LOCALAPPDATA%` sin privilegios administrativos;
- NSIS `perMachine`/`both` y MSI se ejecutan como contraste de UAC, reparación,
  actualización, desinstalación y residuos;
- WebView2 se prueba presente, ausente con red y ausente sin red;
- se registran archivos, accesos directos, claves, procesos, tareas/servicios y
  directorios dejados después de instalar, actualizar y desinstalar.

El spike usa binario sin firma sólo en equipo de prueba aislado. SmartScreen y
antivirus son resultados, no controles que deban desactivarse.

## Estrategia de impresión por evaluar

Tauri no se presume proveedor de una API oficial de impresión térmica. Se
comparan dos rutas detrás del mismo contrato provisional:

1. spooler/driver Windows: enumeración y envío mediante APIs nativas, útil para
   impresoras instaladas y formatos que el driver acepte;
2. raw ESC/POS: sólo para hardware compatible, con corte y encoding probados.

SPK-PRINT-002 realiza una revisión de mantenimiento, licencia, permisos,
advisories, actividad y compatibilidad Tauri 2 de cualquier plugin/adaptador
candidato antes de incorporarlo al spike. Si no existe candidato aceptable, se
permite un adaptador Rust mínimo sobre APIs Windows exclusivamente dentro del
spike. No se invoca shell ni ejecutables arbitrarios para imprimir.

`submitted-to-os` significa que Windows/driver aceptó bytes o trabajo. Incluso
un estado completo del spooler puede no probar que el papel salió; ante caída
entre envío y reporte el resultado es `delivery-unknown`, sin reintento
automático.

## Descubrimiento y selección

El experimento enumera impresoras locales y conexiones instaladas sin bloquear
la UI. Para cada descubrimiento conserva nombre visible, nombre interno,
driver, puerto/conexión, atributos y estado disponible.

No se declara estable ningún campo antes de probar reinicio, reconexión USB,
renombre Windows, reinstalación de driver y cambio de puerto. La vinculación
provisional usa una huella de varios atributos más confirmación humana:

- `printer_role`: `kitchen | cash`;
- identidad observada y huella no secreta;
- nombre mostrado;
- última verificación;
- capacidades detectadas y comprobadas.

Si la huella cambia, el agente no elige por semejanza: marca destino no
disponible y exige volver a vincular. Cocina y caja no pueden apuntar al mismo
dispositivo salvo prueba explícita bloqueada por defecto.

## Tickets mínimos de prueba

### Cocina

- `job_id`, número visible y hora UTC del servidor;
- productos, cantidad, variante, modificadores y observaciones acotadas;
- marca visible `REIMPRESIÓN` cuando aplique;
- sin precios ni datos fiscales.

### Caja

- nombre ficticio `DAYIA FOOD — PRUEBA`;
- `job_id`, número de pedido, fecha/hora y marca de reimpresión;
- productos, subtotal y total en BOB;
- método, recibido y cambio;
- leyenda explícita `NO ES FACTURA`.

Ambos fixtures incluyen `á é í ó ú ñ Ñ`, `Bs`, separadores, una línea larga,
58/80 mm y cantidades límite. No contienen datos reales. Se conserva fotografía
o escaneo del resultado junto al hash del fixture, nunca el ticket productivo.

## Contrato provisional de cola

Campos mínimos: `job_id`, `organization_id` ficticio, `printer_role`,
`payload_version`, `content_hash`, `status`, `attempt_count`, `created_at`,
`claimed_at`, `submitted_at`, `error_code`, `attempt_id` y `correlation_id`.

Reglas:

- `job_id + content_hash` repetido recupera el registro sin imprimir otra vez;
- mismo `job_id` con otro hash se rechaza y audita;
- sólo una instancia posee el claim local;
- el estado se persiste atómicamente antes y después del envío;
- caída previa al envío permite reintento; caída posterior sin evidencia queda
  `delivery-unknown`;
- `delivery-unknown` requiere decisión humana;
- reintento manual añade intento, actor ficticio, motivo y correlación;
- los trabajos mantienen orden de recepción por impresora, pero un trabajo
  bloqueado debe hacer visible la cola y no reordenarse silenciosamente;
- el reloj del servidor ordena intención; reloj local sólo diagnostica.

La persistencia concreta es deliberadamente descartable y se elige dentro de
SPK-PRINT-006 sin introducir una dependencia productiva.

## Comunicación provisional

La recomendación inicial para experimentar es polling HTTPS saliente hacia un
servidor simulado: evita listeners entrantes y permite medir timeout, replay y
reconciliación con menor superficie. No es todavía el protocolo aceptado.

El contrato simulado incluye:

- identidad y token efímeros exclusivos del spike, sin valores versionados;
- claims limitados a agente/organización ficticios;
- TLS cuando abandona loopback;
- `correlation_id`, versión, nonce/identificador de mensaje y expiración;
- payload con bounds estrictos y campos desconocidos rechazados;
- timeouts/retries acotados y backoff medido;
- claim/lease/reporte idempotentes;
- revocación, replay y dos agentes con identidad duplicada.

La comparación completa está en la matriz. HTTP local desde navegador no recibe
preferencia porque expone listener, origen, CORS y firewall; archivo/cola local
sirve como control offline, no como transporte servidor.

## Offline limitado

Sólo un trabajo ya recibido y persistido localmente puede continuar cuando el
servidor cae. El agente:

1. registra `agent_offline`;
2. no inventa ni reclama nuevos trabajos;
3. puede imprimir el trabajo local según su estado;
4. conserva resultado y correlación;
5. al reconectar reporta primero pendientes/resultados;
6. rechaza el mismo `job_id + hash` reenviado;
7. no convierte timeout en éxito.

No se crean pedidos, pagos ni reimpresiones offline.

## Seguridad del spike

- proceso sin elevación después de instalar;
- una sola instancia por identidad/equipo;
- capacidades Tauri mínimas; sin shell, filesystem general ni origen remoto;
- comandos sólo desde contenido empaquetado;
- payload versionado con allowlist, tamaños y longitudes máximas;
- observaciones tratadas como texto: sin rutas, comandos ni markup ejecutable;
- selección restringida a impresoras vinculadas;
- credencial efímera en almacén seguro Windows evaluado; nunca en repo/log;
- logs por allowlist, rotativos, con exportación manual y sin ticket completo;
- token robado, payload hostil, replay, disco lleno, reloj errado y suplantación
  tienen experimento negativo;
- updater no se habilita hasta probar firma, verificación y rollback. Tauri exige
  firma de artefactos de actualización; la clave privada nunca reside en agente
  ni repo.

## Eventos observables

Eventos mínimos:

`agent_started`, `printer_discovered`, `job_received`, `job_claimed`,
`print_submitted`, `print_failed`, `delivery_unknown`, `retry_requested`,
`job_duplicate_rejected`, `agent_offline`, `agent_reconnected`.

Cada evento incluye timestamp UTC local marcado como diagnóstico, `agent_id`,
`job_id` cuando aplique, `printer_role`, `attempt_id`, `correlation_id`,
`result`, `error_code` y duración. También incluye versión del agente y desfase
estimado cuando exista servidor. No registra token, contenido completo, rutas
sensibles ni PII.

## Métricas y baseline

Se miden en al menos cinco ejecuciones por combinación relevante, registrando
mediana, p95 observado, mínimo, máximo y fallos; 20 impresiones consecutivas se
reservan para la tasa de impresión.

- inicio frío/caliente;
- memoria en reposo y pico durante impresión;
- CPU en reposo y durante impresión;
- recepción → claim → envío al OS;
- éxito observado en 20 impresiones de cada ticket;
- duplicados físicos y lógicos;
- recuperación tras reinicio/desconexión;
- tamaño de instalador y huella instalada;
- instalación, actualización, rollback y desinstalación;
- UAC/permisos, alertas AV/firewall;
- estabilidad de identidad de impresora.

No hay umbrales finales antes del baseline. Los únicos criterios bloqueantes son
semánticos: cero duplicados automáticos, sin secreto expuesto, sin desactivación
de AV, sin elevación permanente y fallos observables. Los números alimentan la
decisión de complejidad proporcional en SPK-PRINT-010.

## Registro mínimo de riesgos

| Riesgo | Experimento/control | Resultado que bloquea |
|---|---|---|
| plugin/adaptador abandonado | releases, issues, advisories, licencia y Tauri 2 | dependencia crítica sin mantenimiento viable |
| enviado al OS ≠ papel | kill y observación contra spooler | modelo declara certeza física |
| driver incompatible | driver/raw en hardware objetivo | no hay ruta silenciosa suficiente |
| nombre inestable | rename/reboot/USB/driver/puerto | elige otra impresora sin confirmación |
| corte no soportado | capability y fallback | ticket inutilizable o fallo oculto |
| antivirus | escaneo/ejecución sin exclusiones | bloqueo sistemático sin mitigación |
| permisos | estándar/admin e install modes | elevación permanente |
| actualización | N→N+1 interrumpido y rollback | dos versiones o cola corrupta |
| secretos locales | canario, disco/proceso/log scan | token/clave expuesto |
| duplicados | replay/kill/reconnect | segundo efecto automático |
| pérdida de estado | crash/disco lleno | imprime sin registro durable |
| dos agentes con identidad igual | dos procesos/clientes | claims simultáneos |
| caracteres incorrectos | fixture español/BOB | ticket ambiguo o ilegible |
| USB desconectado | retirar antes/durante envío | retry incierto o hang |
| cola Windows bloqueada | pause/error/timeout | espera ilimitada o falso éxito |

## Fuentes técnicas contrastadas

- [Prerequisitos Tauri en Windows](https://v2.tauri.app/start/prerequisites/):
  C++ Build Tools, Rust y WebView2 para desarrollo.
- [Instaladores Windows de Tauri](https://v2.tauri.app/distribute/windows-installer/):
  MSI/NSIS, modos per-user/per-machine y opciones de WebView2.
- [Capabilities de Tauri](https://v2.tauri.app/security/capabilities/): permisos
  y scopes mínimos por ventana/webview.
- [Updater de Tauri](https://v2.tauri.app/plugin/updater/): firma de updates
  obligatoria y modos de instalación.
- [EnumPrinters](https://learn.microsoft.com/en-us/windows/win32/printdocs/enumprinters)
  y [Print Spooler API](https://learn.microsoft.com/en-us/windows/win32/printdocs/print-spooler-api):
  enumeración y administración nativas.
- [JOB_INFO_1](https://learn.microsoft.com/en-us/windows/win32/printdocs/job-info-1):
  un estado completo/impreso puede depender del monitor y no prueba papel.
- [Lifecycle Windows 11](https://learn.microsoft.com/en-us/lifecycle/products/windows-11-home-and-pro)
  y [fin de soporte Windows 10](https://learn.microsoft.com/en-us/lifecycle/announcements/windows-10-end-of-support):
  baseline soportado al ejecutar.
- [QZ Tray: raw printing](https://qz.io/docs/what-is-raw-printing) y
  [firma](https://qz.io/docs/signing): referencia primaria para la contingencia.

Las versiones se revalidan al ejecutar SPK-PRINT-001/002; estos enlaces no
sustituyen pruebas locales.

## Ciclos de ejecución

Cada ciclo ocurre en una sesión separada salvo agrupación humana explícita.

| ID | Objetivo | Entradas | Salida | Criterios | Pruebas | Evidencia | Rollback | Prohibiciones |
|---|---|---|---|---|---|---|---|---|
| SPK-PRINT-001 | bootstrap e instalación mínima | PC objetivo, matriz OS, fuentes oficiales | artefacto descartable que inicia/instala/desinstala | inicia con cuenta estándar; ciclo no deja dos versiones ni residuos críticos | estándar/admin, MSI/NSIS, WebView2 presente/ausente, install/uninstall | versiones, hashes, tiempos, capturas, inventario before/after | desinstalar y borrar sólo sandbox del spike | sin impresión, updater, CI ni app productiva |
| SPK-PRINT-002 | enumerar y caracterizar impresoras | ficha de hardware, dos dispositivos si existen | inventario y candidato de adapter | detecta objetivos/cambios sin selección errónea; candidato supera revisión | enum local/conexión, renombre, reboot, USB, mantenimiento/licencia/advisories | dumps sanitizados, matriz de identidad, decisión provisional | retirar adapter y datos de prueba | no fijar plugin ni identidad estable sin evidencia |
| SPK-PRINT-003 | ticket de cocina | fixture v1, una impresora | ticket 58/80 mm según hardware | contenido íntegro/legible; fallo conocido no se presenta como éxito | español, ancho, observaciones, silencio, apagada, cola pausada, corte si existe | foto/escaneo, hash, logs, estado spooler | eliminar job/fixture local | sin precios, pedidos reales ni retry incierto |
| SPK-PRINT-004 | ticket de caja | fixture v1, impresora caja | comprobante no fiscal | importes/BOB íntegros y leyenda no fiscal; fallo observable | recibido/cambio, español, silencio, apagada, cola y corte | foto/escaneo, hash, logs | limpiar prueba local | sin facturación ni cobrar |
| SPK-PRINT-005 | seleccionar cocina y caja | dos bindings observados | mapping explícito y validación | roles distintos; cambio/desconexión bloquea en vez de redirigir | mapping igual, desconexión, renombre y destino incorrecto | before/after, errores y confirmación humana | borrar mapping ficticio | sin routing avanzado o varias estaciones |
| SPK-PRINT-006 | cola, dedupe y reinicio | contrato provisional y fallos inyectables | estado local descartable | un efecto por id/hash; incierto queda sin retry automático; reinicio converge | duplicado, hash distinto, kill antes/después, dos instancias, orden, retry manual | timeline, storage snapshot sanitizado, conteo físico | eliminar almacenamiento del spike | sin auto-retry de `delivery-unknown` |
| SPK-PRINT-007 | comparar comunicación | servidor simulado y token ficticio | matriz con polling/WebSocket/HTTP local/archivo | sólo mensajes autorizados/versionados; replay no produce efecto | auth, token robado, replay, timeout, firewall, correlación y versión | captura de tráfico sanitizada y logs | apagar simulador y revocar token | sin API productiva ni listener público |
| SPK-PRINT-008 | fallos, offline y recuperación | trabajos ficticios persistidos | informe de convergencia | sólo trabajo recibido continúa; reconnect reporta sin duplicar | caída antes/después claim, impresión local, reconnect/replay, disco/reloj/spooler | timeline y conteos de duplicados | reset controlado del estado de spike | sin pedidos offline ni falso éxito |
| SPK-PRINT-009 | seguridad, AV e instalación | build de spike, AV/firewall activos | threat/test report y ciclo install/update/uninstall | sin exclusiones, secretos o elevación permanente; update deja una versión | payload hostil, token robado, cuarentena, UAC, update interrumpido, rollback, residuos | resultados AV/UAC, hashes, inventario, hallazgos | desinstalar/revocar/aislar binario | no excluir AV, firmar producción ni guardar secretos |
| SPK-PRINT-010 | informe y ADR | evidencia 001–009 completa | recomendación `GO`, `NO-GO`, `NEEDS-FOLLOW-UP` o `INSUFFICIENT` | toda conclusión enlaza evidencia; fallo crítico no se compensa; revisión fría coincide o bloquea | auditoría de 20 capacidades/25 escenarios, dossier, comparación QZ si aplica | dossier indexado y revisión independiente | ADR permanece `proposed` hasta aprobación humana posterior | no aceptar por opinión o mocks |

## Cierre documental

Este plan no satisface ningún ciclo. Sólo la evidencia ejecutada sobre Windows y
hardware identificado puede cambiar un SPK a `completed` y alimentar ADR-0008.
