# Modelo lógico de caja y cobros

## Fuentes de verdad

- La sesión de caja persistida es autoridad sobre apertura y cierre.
- Los movimientos aceptados son autoridad sobre entradas y salidas.
- El cobro persistido es autoridad sobre el estado pagado del pedido.
- El navegador sólo muestra cálculos o intenciones; recarga y tiempo real no
  crean ni eliminan movimientos.

## Sesión de caja

Para el MVP existe una única caja operativa abierta compatible por organización.
Multi-caja y multi-sucursal quedan fuera.

La apertura registra:

- organización derivada de sesión;
- usuario autorizado;
- monto inicial;
- tiempo servidor;
- clave de idempotencia;
- estado `open`.

Una apertura concurrente gana una sola vez. Repetir la misma solicitud recupera
la sesión; otra apertura incompatible se rechaza.

El cierre cambia condicionalmente `open` a `closed` y conserva:

- usuario que cierra;
- esperado calculado;
- contado informado;
- diferencia;
- momento servidor;
- motivo/observación cuando la política lo exija;
- clave de idempotencia.

Sólo existe un cierre válido. Una segunda solicitud recupera el cierre o recibe
conflicto si su carga no coincide.

## Movimientos

| Tipo | Origen | Efecto sobre efectivo esperado |
|---|---|---|
| Monto inicial | apertura | suma |
| Venta en efectivo | cobro | suma |
| Venta QR manual | cobro | no cambia efectivo; se concilia aparte |
| Transferencia | cobro | no cambia efectivo; se concilia aparte |
| Ingreso manual | usuario autorizado con motivo | suma |
| Retiro manual | usuario autorizado con motivo | resta |

Cada movimiento tiene identificador, organización, caja, importe no ambiguo,
tipo, origen, actor, tiempo servidor e idempotencia. No se edita destructivamente.

```text
efectivo esperado =
  monto inicial
  + ventas en efectivo
  + ingresos manuales
  - retiros manuales
```

Los totales por QR y transferencia se presentan por separado.

## Cobro

Precondiciones:

- sesión y rol autorizados;
- pedido perteneciente a la misma organización;
- pedido cobrable y no pagado;
- caja abierta;
- importe calculado por el servidor;
- medio permitido.

La transacción de cobro registra el pago exitoso, usuario, caja, medio, importe,
cambio cuando aplica, estado del pedido y movimiento de venta correspondiente.
Una unicidad lógica por pedido impide dos cobros exitosos.

Efectivo requiere recibido suficiente y cambio calculado con precisión aprobada.
QR manual y transferencia registran confirmación declarada por el usuario; el
MVP no promete verificación bancaria.

## Idempotencia, recarga y concurrencia

- La clave de cobro se conserva hasta obtener resultado.
- Reintentar la misma carga devuelve el cobro original.
- Misma clave con otro medio o importe produce conflicto.
- Dos usuarios cobran: sólo una transacción gana; el otro consulta el pago
  existente.
- Una recarga consulta pedido, pago y caja antes de habilitar otro intento.
- La pérdida de respuesta no autoriza a generar una clave nueva.
- Una sesión expirada rechaza un cobro no aceptado; no revierte uno confirmado.

## Cierre y operaciones pendientes

El cierre debe rechazar:

- caja ya cerrada;
- usuario sin permiso;
- contado inválido;
- operaciones de cobro cuya resolución aún sea desconocida;
- inconsistencias de reconciliación.

La definición exacta de “operación pendiente”, tolerancias de diferencia y
procedimiento humano corresponde a la revisión de dominio.

## Acciones sensibles y permisos

| Acción | Propietario | Cajero | Cocina |
|---|---|---|---|
| Abrir caja | permitido | permitido | denegado |
| Cobrar | permitido | permitido | denegado |
| Ingreso/retiro manual | permitido | sujeto a política | denegado |
| Cerrar caja | permitido | sujeto a política | denegado |
| Consultar arqueo | permitido | sólo contexto autorizado | denegado |

El servidor aplica esta matriz; la UI no concede permisos.

## Auditoría

Registrar apertura, intento duplicado, movimiento manual, cobro, rechazo de doble
cobro, cierre, diferencia y denegación sensible. Guardar actor, organización,
recurso, correlación, resultado y tiempo servidor, sin credenciales ni datos
bancarios innecesarios.

## Límites y decisiones pendientes

- Pago mixto está fuera del MVP.
- Reembolso, reverso, anulación financiera y conciliación bancaria están fuera
  hasta decisión explícita.
- Deben definirse precisión, redondeo, tolerancia de diferencia y permisos de
  movimientos/cierre.
- Cancelar un pedido cobrado queda bloqueado hasta definir una política segura.
