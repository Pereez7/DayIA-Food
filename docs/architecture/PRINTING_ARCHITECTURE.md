# Arquitectura lógica de impresión

## Alcance

El MVP contempla una impresora lógica de cocina y una de caja por organización y
contexto operativo. No incluye múltiples estaciones, diseñador de plantillas,
impresión remota ni multi-sucursal.

## Flujo autoritativo

```text
operación confirmada
    → trabajo durable en servidor
    → agente local autenticado consulta trabajo
    → agente confirma aceptación
    → agente entrega al sistema operativo/impresora
    → agente registra resultado observable
```

El servidor conserva trabajos e intentos. El agente consulta trabajos porque debe
operar detrás de la red del establecimiento y recuperarse tras desconexión; el
transporte concreto y la frecuencia requieren ADR técnico.

## Responsabilidades

### Servidor y cola

- crear un trabajo sólo después de confirmar el evento de negocio;
- asignar identificador estable, organización, propósito y referencia;
- seleccionar destino lógico `kitchen` o `cash`;
- entregar mediante lease o reserva temporal;
- registrar aceptación, intentos, resultado y antigüedad;
- limitar reintentos automáticos;
- autorizar y auditar reimpresiones;
- exponer fallos sin declarar certeza física inexistente.

### Agente local

- registrarse como dispositivo autorizado para una organización;
- custodiar su credencial fuera del navegador;
- consultar únicamente sus destinos autorizados;
- deduplicar por identificador incluso tras reinicio;
- confirmar aceptación antes de ejecutar;
- acceder al sistema operativo y a las impresoras;
- reportar envío, fallo o resultado incierto;
- no crear ventas, pagos, pedidos ni reimpresiones por iniciativa propia.

### Aplicación web

- mostrar estado autoritativo consultado;
- advertir agente desconectado o trabajo envejecido;
- permitir reintento/reimpresión sólo con permiso y motivo;
- no comunicarse directamente con la impresora;
- no convertir un timeout en “impreso”.

## Registro de dispositivo y selección

Un agente se vincula explícitamente con:

- identificador de dispositivo;
- organización derivada del proceso de registro;
- estado activo/revocado;
- destinos permitidos;
- identidad/versión observable;
- última comunicación.

Cada destino lógico selecciona una configuración de impresora dentro del agente.
El servidor no acepta un identificador de organización o destino arbitrario del
cliente. Rotación de credenciales, emparejamiento y distribución requieren ADR.

## Estados del trabajo

```text
queued
  → leased
  → accepted
  → submitted
```

Desde `leased` o `accepted` puede resultar:

- `failed`: el agente conoce un fallo antes o durante la entrega;
- `delivery-unknown`: hubo entrega posible, pero falta confirmación fiable;
- `queued`: el lease venció antes de aceptación y puede reasignarse;
- `cancelled`: sólo antes de una entrega y mediante acción autorizada.

`submitted` significa que el agente recibió una aceptación razonable del sistema
operativo/controlador. No prueba que el papel salió, fue legible o llegó a la
persona correcta.

## Idempotencia y duplicados

- Un trabajo tiene identificador estable y propósito único.
- El agente registra localmente trabajos aceptados y resultados.
- Recibir dos veces el mismo identificador no imprime dos veces.
- Un lease vencido no autoriza reejecución automática si el resultado anterior
  puede ser incierto.
- Confirmaciones repetidas se procesan idempotentemente.
- La pérdida de confirmación produce reconciliación, no impresión automática.

La persistencia local duradera y el protocolo exacto son criterios obligatorios
para elegir el agente.

## Reintento frente a reimpresión

**Reintento** continúa el mismo trabajo cuando existe certeza de que no fue
entregado físicamente. Conserva identificador y aumenta intento.

**Reimpresión** crea un nuevo trabajo que:

- referencia al original;
- declara propósito `reprint`;
- exige actor autorizado y motivo;
- puede marcar visualmente que es copia;
- nunca crea o modifica pedido, cobro o movimiento de caja.

Ante `delivery-unknown`, la reimpresión requiere confirmación humana del riesgo de
duplicado físico.

## Agente desconectado

- Los trabajos permanecen `queued` en el servidor.
- La operación comercial confirmada no se revierte.
- Cocina y caja ven el fallo/degradación.
- Al reconectar, el agente consulta trabajos y reconcilia leases/resultados.
- La antigüedad de cola genera evento y alerta.
- No se promete impresión remota ni entrega mientras el establecimiento carece
  del agente.

## Seguridad y auditoría

Auditar registro/revocación, cambios de destino, aceptación, fallo, resultado
incierto, reintento manual y reimpresión. El agente usa mínimo privilegio y no
recibe credenciales de usuarios ni más datos del pedido que los necesarios para
el documento.

## Verificación futura obligatoria

- pruebas de contrato servidor/agente;
- duplicado y reinicio del agente;
- lease vencido y confirmación perdida;
- impresora apagada, sin papel y error de controlador;
- cola acumulada y reconexión;
- reimpresión sin nueva venta;
- hardware real para cocina y caja.

## Decisiones pendientes

- tecnología, empaquetado y actualización del agente;
- protocolo, autenticación y rotación;
- persistencia local y duración de leases;
- formato del documento y compatibilidad de impresoras;
- códigos de error y límites de reintento;
- procedimiento operativo ante `delivery-unknown`.
