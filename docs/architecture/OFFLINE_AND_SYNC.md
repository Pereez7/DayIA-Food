# Conectividad inestable y sincronización

## Política del MVP

No se aprueba un modo offline-first completo. El navegador puede preparar
borradores o mostrar caché, pero ninguna operación crítica se considera aceptada
sin confirmación del servidor.

## Clasificación

| Operación | Requiere conexión | Puede prepararse localmente | Puede encolarse | Debe bloquearse sin conexión |
|---|---:|---:|---:|---:|
| Consultar catálogo | para vigencia autoritativa | sí, caché con antigüedad visible | no aplica | no para lectura; sí para prometer disponibilidad/precio |
| Crear carrito | no | sí | no aplica | no |
| Confirmar pedido | sí | clave y carga | sólo reintento de la misma intención, no nueva confirmación automática | sí |
| Enviar a cocina | sí | no | intención durable sólo después de aceptación servidor | sí |
| Cobrar | sí | clave y datos de entrada | sólo reintento de la misma intención | sí |
| Abrir caja | sí | monto y clave | no automáticamente | sí |
| Cerrar caja | sí | contado y clave | no automáticamente | sí |
| Cambiar estado de cocina | sí | no | no en MVP | sí |
| Imprimir | servidor crea trabajo; agente puede estar desconectado | no desde navegador | sí, en cola durable del servidor; el agente puede concluir un trabajo ya aceptado | no bloquea la venta, pero se muestra degradación |
| Reimprimir | sí para autorización | motivo | trabajo queda en cola servidor | sí para solicitarla |

“Encolable” no significa éxito. La UI conserva estado `pending` hasta reconciliar
un resultado autoritativo.

## Reintentos

- Cada intención crítica usa una clave estable.
- El cliente no genera una nueva clave por timeout, recarga o reconexión.
- El servidor devuelve el resultado anterior si carga y clave coinciden.
- Si la carga difiere, responde conflicto sin efecto.
- Los reintentos usan límites y retroceso; no ocultan un fallo permanente.
- El usuario puede consultar y resolver una intención pendiente.

## Reconexión

Al recuperar conexión:

1. restablecer sesión o solicitar autenticación;
2. consultar por claves pendientes;
3. obtener versiones actuales de pedidos, cocina, caja y pagos;
4. comparar con versión/cursor local;
5. descartar avisos antiguos;
6. consultar huecos o snapshot vigente;
7. mostrar conflictos y decisiones humanas pendientes;
8. reanudar suscripciones sólo después de reconciliar.

Una sesión expirada no elimina las claves locales, pero el resultado sólo se
revela tras nueva autorización.

## Orden y tiempo

- El servidor asigna versión monotónica por agregado.
- Los avisos incluyen identificador, versión y correlación.
- Un consumidor ignora versiones menores o iguales.
- Un salto de versión obliga a consultar.
- La hora del servidor determina auditoría, expiración y orden lógico.
- La hora del dispositivo se conserva sólo para diagnóstico y puede marcarse
  como no confiable.

## Conflictos

| Conflicto | Resultado |
|---|---|
| Precio/catalogo cambió antes de confirmar | servidor rechaza o devuelve nueva cotización para aceptación |
| Pedido ya confirmado | recuperar por idempotencia |
| Pedido cambió de estado | rechazar precondición y reconciliar |
| Pedido ya pagado | mostrar cobro existente; no cobrar otra vez |
| Caja ya cerrada | mostrar cierre vigente; no registrar operación |
| Trabajo con resultado incierto | bloquear reintento automático y pedir decisión |
| Membresía/rol cambió | nueva autorización prevalece; intención puede quedar denegada |

No existe resolución automática “última escritura gana” para estados, dinero o
permisos.

## Experiencia degradada

Toda vista operativa debe distinguir:

- online y sincronizada;
- online pero reconciliando;
- desconectada con datos posiblemente obsoletos;
- intención pendiente;
- conflicto que requiere acción;
- operación bloqueada.

Una notificación visual nunca sustituye confirmación de negocio.

## Seguridad

- No almacenar credenciales o secretos en colas del navegador.
- Minimizar datos de catálogo/pedido cacheados.
- Revalidar sesión, organización y permisos en cada reintento.
- No confiar en `organization_id`, rol, total o tiempo local persistidos.
- Definir limpieza al cerrar sesión y retención antes de implementar caché.

## Límites y decisiones pendientes

- almacenamiento local, cifrado y política de limpieza;
- tiempo máximo de intención pendiente;
- contrato de cursor/version y retención de eventos;
- perfiles de red y objetivos de recuperación;
- si algún cambio de cocina podrá encolarse en una fase posterior.

Estas decisiones no habilitan offline-first.
