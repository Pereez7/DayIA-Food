# Fronteras de componentes

## Estado y alcance

Contrato lógico revisado el 2026-07-29. Define responsabilidades del MVP sin
decidir procesos desplegables, productos, frameworks o dependencias.

## Componentes

| Componente lógico | Responsabilidad | No puede asumir |
|---|---|---|
| Aplicación web | Presentar datos, capturar intención, preparar carrito y mostrar estados/fallos | Autorizar, fijar precios históricos, confirmar pagos o ser fuente de verdad |
| API o capa de servicios | Autenticar contexto, validar comandos, autorizar, coordinar casos de uso y devolver resultados | Confiar en cálculos o `organization_id` del cliente |
| Persistencia autoritativa | Conservar invariantes, historial, idempotencia y aislamiento | Representar cachés de navegador como confirmaciones |
| Autenticación | Establecer identidad y sesión revocable | Conceder por sí sola acceso a un recurso |
| Autorización | Decidir acción sobre organización y recurso concreto, con denegación por defecto | Delegar la decisión definitiva al frontend |
| Servicio lógico de pedidos | Confirmar líneas e importes históricos; gobernar estados e idempotencia | Cobrar o imprimir directamente |
| Servicio/vista de cocina | Consultar pedidos enviados y solicitar transiciones válidas | Inventar pedidos desde mensajes o acceder a caja |
| Gestión de caja | Abrir, registrar movimientos, calcular esperado y cerrar una vez | Alterar cobros ya confirmados sin política de reverso |
| Gestión de pagos | Registrar un único cobro básico y coordinar movimiento aplicable | Considerar una recarga o reimpresión como nuevo cobro |
| Actualización en tiempo real | Avisar que existe una versión nueva | Ser historial o fuente de verdad |
| Cola de impresión | Conservar trabajo, propósito, estado, intentos y reimpresiones | Declarar certeza física que el agente no puede probar |
| Agente local | Autenticarse, tomar trabajos, acceder a impresoras y reportar resultados | Crear ventas, cambiar totales o decidir permisos de usuario |
| Auditoría | Registrar acciones sensibles con actor, organización, versión y correlación | Reemplazar logs operativos o guardar secretos |
| Observabilidad | Correlacionar errores, latencias, colas y salud | Convertirse en fuente transaccional |
| Sincronización | Detectar versiones, reconciliar huecos y reintentar de forma idempotente | Aprobar un modo offline-first no definido |

Los componentes son límites de propiedad y pruebas. Pueden coexistir en una
topología simple mientras conserven sus contratos.

## Frontend frente a servidor

El frontend puede:

- cachear catálogo con antigüedad visible;
- preparar carrito, observaciones y una clave de idempotencia;
- calcular una estimación de subtotal/total para respuesta inmediata;
- conservar intención pendiente hasta conocer el resultado;
- mostrar eventos en tiempo real y solicitar reconciliación.

El servidor debe:

- derivar organización y permisos desde la sesión;
- revalidar catálogo, disponibilidad, opciones, precios y total;
- aceptar o rechazar estados mediante la versión vigente;
- asignar identidad interna, tiempo, número visible y resultado definitivo;
- aplicar transacciones, idempotencia, auditoría y publicación durable;
- devolver el mismo resultado ante un reintento equivalente.

Una diferencia entre estimación y validación servidor impide confirmar hasta que
el usuario vea el valor autoritativo.

## Operaciones transaccionales

Requieren una unidad atómica:

- confirmación del pedido y sus instantáneas;
- transición y versión de pedido/cocina;
- apertura y cierre único de caja;
- cobro, estado pagado y movimiento relacionado;
- movimiento manual y motivo;
- creación de trabajo/reimpresión;
- resultado de un intento de impresión.

Los avisos de tiempo real y la entrega al agente ocurren fuera de esa transacción,
desde una intención durable reintentable.

## Operaciones idempotentes

Como mínimo:

- confirmar pedido;
- enviar a cocina;
- cambiar estado;
- abrir y cerrar caja;
- registrar movimiento manual;
- cobrar;
- crear trabajo de impresión;
- solicitar reimpresión;
- tomar, aceptar y confirmar un trabajo desde el agente.

La clave se combina con organización, tipo de operación y huella de carga.

## Acciones auditadas

- login exitoso/fallido relevante, logout y revocación;
- cambios de usuario, membresía o rol;
- confirmación, cancelación y transición de pedido;
- apertura, movimiento manual, cobro, intento duplicado y cierre;
- registro/desactivación de agente o impresora;
- creación, reintento manual, reimpresión y resultado incierto;
- denegaciones sensibles y accesos cruzados.

## Fallos independientes

| Falla | Efecto permitido | Recuperación |
|---|---|---|
| Navegador | No revierte operación ya confirmada | consultar por clave/identificador |
| Canal de tiempo real | Datos pueden verse tardíos | consulta autoritativa por versión |
| Servicio de notificación | No invalida transacción | reintentar intención durable |
| Vista de cocina | No pierde pedidos persistidos | reconciliar al volver |
| Agente local | Trabajos siguen en cola | retomar por lease/identificador |
| Impresora | Intento falla o queda incierto | intervención y reintento/reimpresión autorizada |
| Observabilidad | No debe corromper negocio | buffer/alerta; degradación visible |

Persistencia autoritativa indisponible bloquea confirmaciones, cobros, caja y
transiciones: no se simula éxito local.

## Contratos que deberán formalizarse

- web ↔ servicios: comandos, resultados, errores, versiones e idempotencia;
- tiempo real ↔ consumidores: aviso con organización, recurso, versión y
  correlación, sin datos sensibles innecesarios;
- servidor ↔ agente: registro, autenticación, lease, aceptación, resultado y
  reintento;
- auditoría/observabilidad: nombres, campos permitidos y retención.

Cada contrato tendrá una única definición versionada y pruebas de productor y
consumidor cuando exista implementación.
