# Criterios de decisión del spike de impresión

## Regla

SPK-PRINT-010 sólo puede recomendar una opción con evidencia completa y revisión
independiente. ADR-0008 permanece `proposed` hasta aprobación humana posterior.
Un resultado ausente es `INSUFFICIENT`, no `PASS`.

## Evidencia mínima

- Windows objetivo, cuenta, WebView2, AV/firewall y artefacto identificados;
- fichas completas de las dos impresoras objetivo, o bloqueo explícito por
  hardware faltante;
- 20 impresiones consecutivas de cocina y 20 de caja por ruta candidata;
- kill/restart antes y después del envío, replay, dos instancias y desconexión;
- instalación, actualización, rollback y desinstalación;
- logs/red/tráfico sanitizados y secret scan;
- métricas con muestras y dispersión;
- 20 capacidades y 25 escenarios con resultado;
- revisión fría contra el contrato.

## GO para Tauri

Todos son obligatorios:

1. instala, ejecuta, actualiza y desinstala en Windows 11 x64 objetivo;
2. el proceso normal funciona como usuario estándar sin elevación permanente;
3. enumera y permite vincular cocina/caja de forma explícita y detecta cambios;
4. imprime ambos tickets silenciosamente cuando driver/OS lo permiten;
5. caracteres españoles, BOB y ancho del hardware son correctos;
6. corte funciona donde existe y su ausencia/fallo tiene fallback observable;
7. apagado, USB y spooler bloqueado no cuelgan ni producen falso éxito;
8. replay, reinicio, reconexión y dos instancias producen cero duplicados
   automáticos;
9. `submitted`, `failed` y `delivery-unknown` se distinguen sin afirmar papel;
10. un trabajo local ya recibido puede concluirse y reconciliarse sin internet;
11. autenticación, replay protection, bounds y destinos autorizados pasan;
12. AV/firewall permanecen activos y los hallazgos tienen mitigación viable;
13. no aparecen secretos ni ticket completo en logs/artefactos;
14. plugin/adaptador crítico tiene licencia, mantenimiento, soporte Tauri 2 y
    superficie de permisos aceptables, o el adaptador nativo mínimo es
    mantenible;
15. instalación, consumo, latencia y soporte no muestran complejidad
    desproporcionada para un restaurante pequeño.

El punto 15 se decide contra baseline y evidencia operativa; no autoriza
reescribir métricas después para obtener `GO`.

## NO-GO para Tauri

Cualquiera bloquea:

- no existe ruta silenciosa confiable para el hardware objetivo;
- no se puede seleccionar/detectar inequívocamente la impresora;
- requiere admin durante operación normal o exclusiones permanentes de AV;
- antivirus/firewall lo bloquea sistemáticamente sin mitigación desplegable;
- el componente crítico está abandonado, tiene licencia incompatible o
  permisos excesivos;
- puede duplicar automáticamente después de crash/replay/reconexión;
- pierde estado local antes de distinguir envío conocido de incierto;
- instalación/update/rollback deja dos agentes o corrompe la cola;
- soporte de español, ancho o térmica es insuficiente;
- acepta payload/comando/replay no autorizado o expone secretos;
- sólo funciona debilitando un control del plan.

Ante `NO-GO`, QZ Tray no se adopta automáticamente: se ejecuta la misma matriz
en los criterios aplicables, incluyendo certificado/firma/licencia, WebSocket
local, headless, offline, dedupe, AV y operación.

## NEEDS-FOLLOW-UP

No bloquea por sí solo si está aislado, medido y tiene próximo experimento:

- requiere firma para reducir SmartScreen;
- funciona sólo con una familia de driver declarada;
- necesita regla de proxy/firewall saliente documentada;
- corte sólo está disponible por raw ESC/POS;
- WebView2 requiere bootstrapper/offline installer;
- no puede probar salida física, pero modela correctamente
  `delivery-unknown`;
- métricas necesitan más muestras sin fallo funcional;
- actualización productiva/firma final requiere un gate separado.

Un follow-up de seguridad, duplicación, pérdida de estado o permisos se eleva a
`NO-GO`, no se reclasifica aquí.

## Matriz de decisión

| Dimensión | Peso cualitativo | Resultado | Evidencia | Bloqueante | Riesgo residual |
|---|---|---|---|---:|---|
| instalación/operación Windows | crítico | pendiente | pendiente | — | pendiente |
| hardware/driver/formato | crítico | pendiente | pendiente | — | pendiente |
| dedupe/recuperación | crítico | pendiente | pendiente | — | pendiente |
| seguridad/identidad | crítico | pendiente | pendiente | — | pendiente |
| observabilidad/certeza | crítico | pendiente | pendiente | — | pendiente |
| offline limitado | alto | pendiente | pendiente | — | pendiente |
| actualización/rollback | alto | pendiente | pendiente | — | pendiente |
| rendimiento/huella | alto | pendiente | pendiente | — | pendiente |
| mantenimiento/licencia | alto | pendiente | pendiente | — | pendiente |
| soporte operativo | alto | pendiente | pendiente | — | pendiente |

No se calcula un puntaje que pueda compensar un fallo crítico.

## Dossier de cierre

El informe de SPK-PRINT-010 debe incluir:

1. inventario de versiones y hashes;
2. fichas de hardware;
3. resultados por capacidad y escenario;
4. métricas crudas y resumen;
5. hallazgos de seguridad/AV;
6. residuos de instalación/desinstalación;
7. comparación Tauri/QZ si se activó contingencia;
8. fallos, limitaciones y trabajo no ejecutado;
9. recomendación `GO | NO-GO | NEEDS-FOLLOW-UP | INSUFFICIENT`;
10. propuesta de cambio de ADR separada de su aprobación.

## Estado actual

`INSUFFICIENT`: el plan existe, pero ningún ciclo se ha ejecutado y no hay
hardware registrado.
