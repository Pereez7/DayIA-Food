# Observabilidad y auditoría

## Objetivo

Permitir reconstruir una operación y detectar fallos parciales sin convertir logs
o métricas en fuente de verdad ni registrar datos sensibles innecesarios.

## Identificadores de correlación

Toda operación usa, cuando corresponda:

- identificador de solicitud;
- clave de idempotencia o su huella no reversible;
- organización;
- usuario o agente;
- pedido, pago, caja o trabajo;
- versión del agregado;
- identificador de intento externo.

No se registran tokens, contraseñas, credenciales de agente, payloads completos
ni datos bancarios.

## Eventos rastreables mínimos

| Evento | Resultado/campos esenciales |
|---|---|
| `auth.login` | éxito/denegación, usuario conocido cuando sea seguro, organización resuelta, motivo categorizado |
| `order.created` | pedido, número visible, versión, actor, idempotencia |
| `order.duplicate_rejected` | clave/huella, conflicto o recuperación del original |
| `order.state_changed` | origen, destino, versión, actor |
| `payment.recorded` | pago, pedido, caja, medio, importe no sensible, actor |
| `payment.duplicate_rejected` | pedido, pago existente/correlación, actor |
| `cash.opened` | caja, monto inicial, actor |
| `cash.closed` | caja, esperado, contado, diferencia, actor |
| `print.job_changed` | trabajo, propósito, destino, estado, intento |
| `print.agent_failure` | agente, categoría, última comunicación, trabajos afectados |
| `sync.error` | recurso, versión/cursor, categoría, reintento |
| `unexpected.error` | correlación, componente, categoría, versión desplegada |

Cancelación, movimientos manuales, reimpresión, cambio de rol y denegación
organizativa también producen auditoría.

## Logs, métricas y trazas

### Logs estructurados

- eventos categorizados y con severidad;
- errores con causa y correlación;
- redacción/allowlist de campos;
- tiempo servidor y versión del artefacto;
- sin dumps indiscriminados.

### Métricas

- tasa y latencia de comandos;
- rechazos por idempotencia o concurrencia;
- demora de notificación/reconciliación;
- tamaño y antigüedad de cola de impresión;
- agentes conectados/desconectados;
- fallos e incertidumbre de impresión;
- errores de autenticación/autorización categorizados;
- operaciones de caja/pago fallidas sin exponer valores innecesarios.

### Trazas o correlación

Debe seguirse el recorrido:

```text
solicitud → validación/autorización → transacción
→ aviso durable → consumidor/cola → agente/intento
```

La herramienta concreta queda pendiente.

## Auditoría frente a observabilidad

**Auditoría** es un historial protegido de acciones sensibles y decisiones de
negocio. Requiere integridad, retención y acceso restringido.

**Observabilidad** diagnostica salud, rendimiento y errores. Puede agregarse,
muestrearse o retenerse de otra forma.

Ninguna reemplaza los registros transaccionales. Un fallo de telemetría no debe
invalidar una transacción, pero debe ser detectable; la forma de buffer y alerta
se decidirá con la topología.

## Alertas conceptuales

- cola de impresión envejecida;
- agente desconectado con trabajos pendientes;
- incremento de `delivery-unknown`;
- errores de sincronización persistentes;
- intentos repetidos de doble pago/cierre;
- denegaciones cruzadas anómalas;
- tasa de errores inesperados;
- demora de cocina fuera del objetivo futuro.

No se fijan umbrales hasta tener baseline.

## Errores y usuario

- Cada error visible incluye referencia de soporte no sensible.
- Timeout no se traduce en fracaso definitivo si el resultado es desconocido.
- Conflictos indican reconciliación necesaria.
- Fallos de tiempo real o agente muestran modo degradado.
- Errores inesperados no exponen stack, consultas ni secretos.

## Tiempo y dispositivos

El servidor sella eventos autoritativos. La hora del dispositivo puede
registrarse separadamente para diagnosticar desfase, nunca para ordenar pagos,
cierres o transiciones.

## Ambientes y acceso

- telemetría separada por ambiente;
- acceso por mínimo privilegio;
- datos de prueba identificables y sin PII real;
- exportación y retención sujetas a política;
- secretos redactados antes de salir del proceso.

## Decisiones pendientes

- plataforma y formato de telemetría;
- retención de auditoría, logs, métricas y trazas;
- integridad y acceso al registro de auditoría;
- responsables y canales de alerta;
- baselines, objetivos y umbrales;
- política de privacidad y eliminación.
