# Arquitectura lógica de impresión local

> **Estados de dominio aceptados — 2026-07-29.**

La fuente canónica de estados, reintento y reimpresión es
[`PRINT_JOB_STATES.md`](../domain/PRINT_JOB_STATES.md).

## Garantía real

El servidor es autoridad de la intención y del historial. El agente local puede
probar recepción y envío al OS/driver, pero no que el papel salió físicamente.
Por eso el estado final positivo es `submitted`, no `succeeded`, y puede existir
`delivery-unknown`.

## Componentes y responsabilidades

### Servidor

- crea un único job original dentro del flujo durable del pedido o comprobante;
- conserva contenido, organización, propósito, destino y estado;
- entrega por lease, valida transiciones y deduplica intentos;
- expone fallos/edad, registra auditoría y autoriza reimpresión;
- no confía en estados inventados por navegador o agente.

### Agente local

- se autentica como dispositivo registrado y restringido a su organización;
- reclama jobs, renueva lease y registra cada intento;
- envía al destino permitido y reporta `submitted-to-os`, `failed` o `unknown`;
- no modifica pedido, pago, caja ni contenido histórico;
- reconcilia al reiniciar antes de solicitar trabajo nuevo.

### Aplicación web

- consulta estado autoritativo y muestra desconexión, fallo o incertidumbre;
- no imprime directamente ni convierte timeout en éxito;
- solicita reimpresión sólo con rol y motivo.

## Estados y concurrencia

`pending → claimed → processing → submitted|failed|delivery-unknown`; un
`claimed` cuyo lease vence antes de entrega vuelve a `pending`. `cancelled` sólo
aplica antes de procesamiento. Un trabajo `delivery-unknown` jamás se reintenta
automáticamente.

La primera impresión y la reimpresión son jobs distintos. Reimpresión referencia
el original, conserva snapshot, actor, motivo y contador derivado. Tres
solicitudes autorizadas producen tres jobs auditables, no la mutación del
original.

## Continuidad operacional

Confirmación del pedido y avance de cocina no dependen del papel. Cocina consulta
la fuente de verdad y ve una cancelación aun si la comanda ya se imprimió. Fallo,
agente desconectado, job envejecido o resultado incierto alertan a cocina/cajero
según destino; sólo una decisión humana puede reimprimir cuando pudo existir
entrega.

## Seguridad y observabilidad

Jobs y agentes están aislados por organización y destino. Los logs usan IDs,
propósito, tiempos, estado y correlation ID; no incluyen secretos ni contenido
personal innecesario. Se miden edad de cola, fallos, incertidumbre, desconexión y
reimpresiones.

## Decisiones técnicas pendientes

Tecnología, protocolo, formato, transporte, leases, registro de dispositivo,
empaquetado y actualización del agente requieren ADR técnico y pruebas con
hardware real. La arquitectura no selecciona runtime ni proveedor.
