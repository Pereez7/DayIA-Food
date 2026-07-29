# Flujos de usuario del MVP

## Alcance

Estos flujos fueron aprobados por
[`ADR-0001`](../decisions/001-flujo-comercial-completo-mvp.md). Describen
comportamiento observable, no pantallas ni tecnología. Cada uno sigue sujeto al
cierre de Fase 0 y a especificación verificable antes de implementarse.

## Matriz

| Flujo | Funcionalidad | Estado de alcance |
|---|---|---|
| Inicio y cierre de sesión | AUTH-001 | MVP aprobado |
| Apertura de caja | CASH-001 | MVP aprobado |
| Punto de venta y creación de pedido | POS-001, ORDER-001 | MVP aprobado |
| Personalización de pizza | PIZZA-001 | MVP aprobado |
| Envío y actualización en cocina | KITCHEN-001 | MVP aprobado |
| Cobro | PAYMENT-001 | MVP aprobado |
| Impresión en cocina | PRINT-001 | MVP aprobado |
| Impresión en caja | PRINT-002 | MVP aprobado |
| Cierre de caja | CASH-001 | MVP aprobado |

## Inicio y cierre de sesión

**Precondiciones:** usuario interno activo, rol propietario/cajero/cocina y
organización asignada.

1. La persona presenta credenciales.
2. El sistema valida identidad y contexto organizativo.
3. Inicia una sesión con el rol mínimo correspondiente.
4. Las rutas no autorizadas permanecen protegidas.
5. Al cerrar sesión, la sesión deja de permitir acciones protegidas.

**Resultado:** acceso limitado al usuario, rol y organización correctos.

**Casos obligatorios:** credenciales inválidas, usuario inactivo, ruta prohibida,
sesión expirada y acceso a otra organización.

**Excluido:** registro público, login social, MFA, SSO y permisos configurables.

## Apertura de caja

**Precondiciones:** cajero o propietario autenticado y sin sesión incompatible.

1. La persona solicita abrir caja.
2. Registra el monto inicial.
3. El sistema valida permisos y consistencia.
4. Crea una sesión de caja abierta y trazable.

**Resultado:** la caja puede recibir movimientos y ventas autorizadas.

**Casos obligatorios:** caja ya abierta, monto inválido, usuario sin permiso y
solicitud repetida.

## Punto de venta y creación de pedido

**Precondiciones:** sesión autorizada, caja abierta y catálogo disponible.

1. La persona consulta categorías y productos.
2. Agrega productos al carrito.
3. Indica cantidades, observaciones y opciones permitidas.
4. El sistema presenta subtotal y total.
5. La persona confirma.
6. El sistema asigna un número y estado inicial al pedido.

**Resultado:** pedido único, válido, trazable y listo para enviarse a cocina.

**Casos obligatorios:** producto no disponible, precio cambiado, cantidad
inválida, carrito vacío y confirmación repetida.

**Excluido:** mesas avanzadas, división de cuenta, promociones complejas,
fidelización y venta multicanal avanzada.

## Personalización de pizza

**Precondiciones:** pizza configurable con tamaños y modificadores vigentes.

1. La persona elige tamaño o variante.
2. Añade o retira modificadores básicos dentro de los límites.
3. El sistema rechaza combinaciones inválidas.
4. Actualiza el importe de la línea.
5. Conserva las selecciones al confirmar el pedido.

**Resultado:** personalización válida sobre la línea común de pedido.

**Casos obligatorios:** opción agotada, límites, incompatibilidad y cambio de
precio.

## Envío y actualización en cocina

**Precondiciones:** pedido confirmado.

1. Caja envía el pedido a cocina.
2. El sistema registra una transición única.
3. La vista de cocina muestra número, productos, opciones y observaciones.
4. Cocina marca el pedido `en preparación`.
5. Cocina lo marca `listo`.
6. El historial mínimo conserva usuario, transición y momento.

**Resultado:** estado coherente y visible para la operación.

**Casos obligatorios:** doble envío, transición inválida, cambios concurrentes,
reconexión y pedido inexistente.

**Excluido:** estaciones múltiples, prioridad automática, predicción y analítica
avanzada.

## Cobro

**Precondiciones:** pedido cobrable, caja abierta y usuario autorizado.

1. La persona revisa el total.
2. Selecciona efectivo, QR manual o transferencia.
3. Para efectivo, registra recibido y obtiene el cambio.
4. Confirma el cobro.
5. El sistema registra estado de pago y usuario.
6. La venta genera el movimiento de caja correspondiente.

**Resultado:** un único cobro básico trazable y consistente con pedido y caja.

**Casos obligatorios:** importe insuficiente, reintento, respuesta perdida,
duplicado y usuario sin permiso.

**Excluido:** integración bancaria, pasarela online, facturación electrónica,
crédito y pago mixto salvo aprobación posterior.

## Impresión en cocina

**Precondiciones:** pedido enviado, impresora de cocina configurada y trabajo
identificable.

1. El sistema crea una comanda idempotente.
2. Registra trabajo y estado.
3. Entrega a la única impresora de cocina.
4. Muestra éxito o fallo visible.
5. Permite reimpresión controlada y auditada.

**Resultado:** comanda trazable hasta hardware real sin duplicados silenciosos.

**Casos obligatorios:** impresora desconectada, sin papel, reinicio, reconexión,
reintento y confirmación perdida.

## Impresión en caja

**Precondiciones:** cobro confirmado e impresora de caja configurada.

1. El sistema crea un comprobante idempotente.
2. Registra trabajo y estado.
3. Entrega a la única impresora de caja.
4. Muestra éxito o fallo.
5. Permite reimpresión controlada sin repetir el cobro.

**Resultado:** comprobante trazable y desacoplado de la unicidad del cobro.

**Excluido para toda impresión:** diseñador de plantillas, múltiples estaciones,
enrutamiento avanzado, impresión remota y multi-sucursal.

## Movimientos y cierre de caja

**Precondiciones:** sesión de caja abierta.

1. Durante la sesión, ventas generan movimientos trazables.
2. Un usuario autorizado registra ingresos o retiros manuales con motivo.
3. Al cerrar, registra el monto contado.
4. El sistema calcula esperado y diferencia.
5. La persona confirma arqueo y cierre.
6. La caja cerrada rechaza nuevos movimientos.

**Resultado:** sesión cerrada con totales, diferencia y responsable trazables.

**Casos obligatorios:** operación pendiente, doble cierre, movimiento sin motivo,
diferencia, usuario sin permiso y reconexión.

**Excluido:** contabilidad, conciliación bancaria, cuentas por cobrar y gestión
financiera avanzada.

## Recorrido E2E obligatorio

El recorrido completo de `MVP_SCOPE.md` debe ejecutarse incluyendo aislamiento
entre organizaciones, fallos visibles de impresión, reconexión y ausencia de
duplicados. Validar subflujos aislados no sustituye este E2E.
