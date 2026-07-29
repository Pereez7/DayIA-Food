# ADR 008 — Dirección del agente local de impresión

## Contexto

El navegador no puede ofrecer impresión térmica silenciosa, deduplicada,
auditable y observable de forma portable. A la vez, empaquetar toda la aplicación
como desktop aumentaría operación y acoplamiento.

## Decisión

Aceptar la separación web/agente y la comunicación HTTPS saliente con la API.
Mantener Tauri 2 como candidato preferido, condicionado al spike definido en
`PRINTING_ARCHITECTURE.md`. QZ Tray es la contingencia si Tauri no demuestra
instalación, hardware, firma, actualización y resiliencia.

No se selecciona todavía una librería ESC/POS, protocolo exacto, instalador ni
canal de actualización.

## Alternativas

- QZ Tray: soporte de impresoras maduro; añade certificados/firma, WebSocket local
  y posible costo/licencia.
- Electron: Node y empaquetado conocidos; huella y shell innecesarias para agente.
- servicio Node: lenguaje compartido; instalación, lifecycle y seguridad local
  más difíciles.
- impresión del navegador: insuficiente para operación silenciosa y estado
  durable.

## Consecuencias

`PRINT-001` y `PRINT-002` siguen bloqueadas. El spike debe ejecutarse con Windows,
antivirus y dos impresoras objetivo. Ningún resultado simulado prueba papel
físico; reinicio y `delivery-unknown` conservan intervención humana.

## Estado

proposed

## Fecha

2026-07-29
