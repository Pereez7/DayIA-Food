# Ciclo de vida de pedidos y cocina

## Identidad y confirmación

- El pedido recibe un identificador interno globalmente estable dentro del
  sistema y una organización autoritativa.
- El cliente genera una clave de idempotencia antes de confirmar y la conserva
  hasta resolver el resultado.
- El servidor asigna un número visible único dentro del contexto y periodo que se
  defina en `phase-0-domain-review`.
- El número visible nunca reemplaza al identificador interno.
- Confirmar persiste pedido, líneas, selecciones, instantáneas, total, versión,
  número e idempotencia en una sola unidad.
- Doble confirmación equivalente devuelve el pedido original; misma clave con
  carga distinta produce conflicto.

## Instantánea histórica

Cada línea confirmada conserva al menos:

- referencia al producto de origen;
- nombre presentado en la venta;
- cantidad;
- nombres y efectos de opciones seleccionadas;
- precio unitario confirmado;
- ajustes aprobados, subtotal y total correspondientes;
- precisión y regla de redondeo, una vez decididas.

Cambiar catálogo, nombres u ofertas no reescribe la venta histórica.

## Estados mínimos

```text
confirmed
   | \
   |  \--> cancelled
   v
sent-to-kitchen
   | \
   |  \--> cancelled
   v
preparing
   | \
   |  \--> cancelled (regla y permiso pendientes)
   v
ready
```

`draft` pertenece al navegador y no es un pedido confirmado. `paid` pertenece al
modelo de pago, no sustituye el estado operativo. No se permite saltar estados,
retroceder ni repetir efectos; una repetición idempotente puede recuperar la
transición ya aceptada.

## Transiciones

| Comando | Precondición mínima | Actor |
|---|---|---|
| Confirmar | carrito válido, caja abierta, catálogo revalidado | cajero o propietario |
| Enviar a cocina | `confirmed` y versión vigente | cajero o propietario |
| Iniciar preparación | `sent-to-kitchen` y versión vigente | cocina o propietario autorizado |
| Marcar listo | `preparing` y versión vigente | cocina o propietario autorizado |
| Cancelar | estado cancelable, motivo, versión y ausencia de bloqueo financiero | permiso por definir; nunca sólo UI |

Toda transición guarda actor, organización, origen, destino, razón cuando
corresponda, versión y tiempo servidor.

## Cocina y reconciliación

La vista recibe avisos de:

- pedido enviado;
- cambio de estado aceptado;
- cancelación;
- indicación de que existe una versión más nueva.

El aviso no transporta autoridad definitiva. Al iniciar, reconectar, detectar un
hueco o recibir una versión antigua, cocina consulta pedidos vigentes y cambios
desde su cursor. Sólo aplica una proyección si la versión es posterior a la
conocida.

Si el canal falla, la vista muestra estado degradado y continúa reconciliando por
consulta. Los cambios de cocina requieren conexión en el MVP; no se promete una
cola offline de transiciones.

## Envío e impresión

Aceptar `sent-to-kitchen` crea de forma durable la intención de notificar cocina
y el propósito de impresión correspondiente. La transición no se revierte si
falla la impresora. Cocina debe poder ver el pedido y el fallo de impresión por
separado.

Un trabajo repetido con el mismo propósito se deduplica. Una reimpresión es una
acción nueva, explícita y auditada.

## Recuperación y concurrencia

- Respuesta perdida: consultar/reintentar por idempotencia.
- Recarga: recuperar pedido desde el servidor; el carrito local no decide si fue
  confirmado.
- Dos transiciones: la primera que cumple versión/precondición gana; la otra
  recibe conflicto y debe reconciliar.
- Eventos fuera de orden: ignorar versión antigua; consultar si existe hueco.
- Hora incorrecta: usar tiempo y secuencia servidor.
- Sesión expirada: rechazar antes del efecto; luego de confirmar, devolver el
  resultado persistido sólo a una sesión nuevamente autorizada.

## Cancelación y límites

- Toda cancelación requiere motivo y auditoría.
- Después de enviar, cocina recibe el aviso y reconcilia; no se borra la comanda
  histórica.
- Cancelar durante preparación tiene costo operativo y su permiso exacto queda
  pendiente.
- Un pedido cobrado no se cancela hasta definir reverso/anulación; esta decisión
  bloquea ese caso de uso.
- Reembolso, devolución y crédito no se incorporan por esta arquitectura.

## Decisiones pendientes para `phase-0-domain-review`

- nombres definitivos y matriz exacta de estados;
- regla de cancelación por estado y rol;
- formato, alcance y reinicio del número visible;
- precisión, impuestos si aplican y redondeo;
- relación exacta entre estado operativo y estado de pago;
- retención de claves y del historial.
