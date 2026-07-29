# Arquitectura lógica del MVP

> **Estado de revisión: approved-with-actions — 2026-07-29.**
>
> Este documento no decide tecnologías, proveedores ni dependencias y no autoriza
> implementación. Toda decisión difícil de revertir requiere un ADR según
> [`docs/decisions/README.md`](../decisions/README.md).

La revisión aprueba las fronteras, fuentes de verdad y garantías lógicas
descritas aquí. Las acciones pendientes al final del documento bloquean la
selección de stack y el inicio de Fase 1.

## Objetivos arquitectónicos

- sostener el MVP de pizzería sobre un núcleo neutral de restaurante;
- soportar el flujo autenticación → caja → POS/pedido → cocina → cobro →
  impresión → cierre;
- mantener límites claros entre producto común y configuración de vertical;
- permitir verificación automatizada por capas y extremo a extremo;
- preservar consistencia de pedidos, importes y estados;
- preparar límites conceptuales para evolución sin implementar fases futuras;
- tolerar fallos parciales de red e impresión de forma observable.

## Vista lógica propuesta

```text
Aplicación web
      |
      v
Interfaz de backend / contratos
      |
      +--> Núcleo de aplicación y dominio
      |       +--> restaurante y catálogo
      |       +--> pedidos, importes y estados
      |       \--> políticas y permisos
      |
      +--> Persistencia
      +--> Actualización en tiempo real
      +--> Observabilidad
      \--> Cola de impresión --> Agente local --> Hardware
```

Esta vista expresa responsabilidades, no procesos, servicios desplegables ni
productos concretos.

## Documentos de detalle

- [`COMPONENT_BOUNDARIES.md`](COMPONENT_BOUNDARIES.md): componentes,
  responsabilidades, transacciones, idempotencia y fallos independientes.
- [`ORDER_LIFECYCLE.md`](ORDER_LIFECYCLE.md): identidad, instantáneas, estados y
  concurrencia de pedidos y cocina.
- [`CASH_AND_PAYMENT_MODEL.md`](CASH_AND_PAYMENT_MODEL.md): caja, cobros,
  movimientos y cierres.
- [`PRINTING_ARCHITECTURE.md`](PRINTING_ARCHITECTURE.md): cola durable, agente,
  impresoras, reintentos y certeza física.
- [`OFFLINE_AND_SYNC.md`](OFFLINE_AND_SYNC.md): clasificación de conectividad,
  reconciliación y orden de eventos.
- [`SECURITY_MODEL.md`](SECURITY_MODEL.md): organización, membresía, roles,
  sesiones y secretos.
- [`OBSERVABILITY.md`](OBSERVABILITY.md): auditoría, correlación, eventos y
  errores rastreables.

Estos documentos son contratos lógicos coordinados. Ninguno selecciona procesos,
productos, protocolos, motor de datos ni topología de despliegue.

## Fuentes de verdad

| Concepto | Fuente de verdad autoritativa |
|---|---|
| Organización, usuarios, membresías y roles | Registros persistidos de identidad y acceso validados por el servidor |
| Pedido, líneas e importes históricos | Pedido persistido con instantáneas comerciales confirmadas |
| Estado de pedido y cocina | Estado/version vigente y su historial de transiciones aceptadas |
| Pago | Registro único de cobro confirmado por el servidor |
| Sesión y movimientos de caja | Sesión persistida y movimientos aceptados dentro de ella |
| Trabajo e intentos de impresión | Cola durable del servidor y confirmaciones registradas del agente |

El estado local del navegador es borrador o caché. Los mensajes en tiempo real
son avisos para volver a consultar. Ninguno sustituye la fuente autoritativa.

## Aplicación web

Responsable de presentar capacidades autorizadas, capturar intención del usuario
y mostrar resultados y fallos sin duplicar reglas del dominio. Debe contemplar
estados de carga, vacío, error y operación degradada cuando corresponda.

Pendiente de decisión:

- modelo de entrega y ejecución;
- límites entre estado local y estado confirmado;
- estrategia de accesibilidad y compatibilidad de dispositivos;
- alcance real de operación sin internet.

## Backend

Frontera autoritativa para:

- validar comandos y permisos;
- ejecutar casos de uso;
- aplicar reglas de catálogo, pedidos, importes y transiciones;
- controlar idempotencia y concurrencia;
- emitir resultados y eventos observables;
- coordinar persistencia e integraciones.

ADR-0006 aprobó una API Node/Fastify separada de la SPA. Se despliega como
artefacto contenedorizado independiente y conserva el límite lógico aun si web y
API comparten proveedor.

## Núcleo y verticales

El núcleo común contiene conceptos de restaurante, catálogo, pedido, línea,
importe, estado, identidad, caja, cobro e impresión. El vertical de pizzería
aporta configuración y reglas especializadas sólo cuando el MVP las requiere.

Reglas propuestas:

- una línea de pedido común para todos los verticales;
- extensiones explícitas, no condicionales dispersos por toda la aplicación;
- ningún módulo futuro puede duplicar pedido, precio o identidad;
- una abstracción se introduce por una necesidad demostrada, no por especulación.

## Base de datos

Debe preservar consistencia, trazabilidad y aislamiento. El diseño conceptual se
encuentra en [`DATABASE_DESIGN.md`](DATABASE_DESIGN.md). PostgreSQL administrado
por Supabase es el motor aceptado; modelo físico, tipos, índices, RLS y estrategia
de migración corresponden al siguiente gate.

## Actualización en tiempo real

Se propone una capacidad para propagar cambios operativos, especialmente estados
de pedido, sin convertir la entrega en tiempo real en la fuente de verdad.

Debe contemplar:

- reconexión y recuperación del estado vigente;
- mensajes repetidos, retrasados o fuera de orden;
- autorización de suscripciones;
- degradación a actualización explícita si el canal no está disponible;
- métricas de demora y fallos.

El mecanismo concreto no está decidido.

## Impresión y agente local

La impresión básica en cocina y caja forma parte del MVP. Se propone separar un
agente local del backend para alcanzar las dos impresoras dentro del
establecimiento.

Responsabilidades conceptuales:

- recibir trabajos identificados de forma idempotente;
- mantener una cola observable;
- informar aceptación, éxito y fallo;
- aplicar reintentos controlados;
- distinguir reimpresión autorizada de duplicado accidental;
- soportar pruebas con hardware real.

Protocolo, empaquetado, actualización, operación degradada y seguridad del agente
requieren un ADR técnico. El alcance aprobado no elige su implementación.

## Organizaciones y sucursales

La separación de datos por organización forma parte del MVP.
Multi-sucursal pertenece a Fase 4 y no debe implementarse anticipadamente.

Límites conceptuales a preservar:

- cada usuario y dato operativo pertenece a una organización identificable;
- toda operación accede a un contexto explícito;
- permisos y consultas no mezclan contextos;
- el MVP debe probar accesos cruzados negativos;
- la evolución hacia múltiples sucursales requiere una decisión posterior.

La forma física del aislamiento organizativo queda pendiente de ADR.

## Funcionamiento degradado sin internet

Es una posibilidad por evaluar, no un compromiso aprobado. Antes de implementarlo
deben clasificarse operaciones:

- seguras para lectura local;
- seguras para cola con idempotencia;
- inseguras sin confirmación autoritativa;
- sujetas a reconciliación humana.

Pedidos, cobros e impresión tienen riesgos distintos. No se permitirá afirmar
soporte offline hasta ejecutar pruebas de desconexión, reconexión, orden y
duplicados.

## Observabilidad

La propuesta contempla:

- logs estructurados sin secretos;
- métricas de latencia, errores, colas y transiciones;
- trazas o correlación entre solicitud, pedido y trabajo externo;
- auditoría de acciones sensibles;
- alertas vinculadas a objetivos medibles;
- evidencia de despliegue, rollback y recuperación.

Los proveedores y la retención están pendientes.

## Seguridad

Controles mínimos a decidir y verificar:

- autenticación de usuarios internos e invalidación de sesión;
- roles iniciales propietario, cajero y cocina;
- autorización por acción y contexto;
- validación en las fronteras;
- protección de secretos y datos sensibles;
- cifrado en tránsito y política de almacenamiento;
- auditoría de acciones críticas;
- análisis de dependencias y amenazas;
- principio de menor privilegio;
- aislamiento entre organizaciones desde el MVP.

Ninguna integración o modo degradado puede omitir estos controles.

## Despliegue y evolución

La topología inicial debe ser la mínima que cumpla los criterios medidos. La
separación en múltiples procesos o servicios sólo se aprobará por una necesidad
de escala, seguridad, disponibilidad o propiedad claramente demostrada.

Toda evolución debe mantener:

- contratos versionados;
- migraciones reversibles o con rollback explícito;
- compatibilidad durante despliegues;
- observabilidad del cambio;
- evidencia de quality gates.

## Decisiones pendientes

- modelo físico PostgreSQL, transacciones, RLS y migraciones;
- detalle de sesión, revocación y aplicación física de permisos;
- publicación durable y autorización exacta de Realtime;
- estrategia de operación degradada;
- runtime/protocolo/distribución del agente tras spike;
- proveedor/región, retención, alertas y gestor de secretos;
- aislamiento físico por organización;
- estrategia futura de múltiples sucursales.

Ningún punto de esta lista se considera aprobado por aparecer en este documento.

## Revisión adversarial obligatoria

| # | Escenario y riesgo | Protección arquitectónica | Limitación | Decisión pendiente o bloqueo |
|---|---|---|---|---|
| 1 | El cajero confirma dos veces: pedido duplicado. | Misma clave de idempotencia y misma carga devuelven el resultado original; carga distinta produce conflicto. | No evita que el usuario inicie intencionalmente otro pedido con otra clave. | Definir expiración y formato de claves en el contrato técnico. |
| 2 | El servidor guarda el pedido y se pierde la respuesta. | El reintento conserva la clave y recupera el pedido persistido. | El navegador debe conservar temporalmente clave y huella de la solicitud. | Seleccionar almacenamiento cliente y contrato de recuperación. |
| 3 | Cocina queda desconectada cinco minutos. | Al reconectar consulta estado vigente e historial desde un cursor/version; no confía en avisos perdidos. | No se prometen cambios de estado offline. | Probar ventana y volumen de reconciliación. |
| 4 | Falla el canal de tiempo real. | La operación autoritativa continúa; la vista muestra degradación y consulta explícita/periódica. | La actualización puede llegar tarde. | Elegir transporte y objetivo de latencia. |
| 5 | La impresora está apagada. | El agente informa fallo; el trabajo permanece trazable y reintentable con límite. | No hay salida física hasta intervención. | Definir códigos de error y política de reintentos. |
| 6 | Sale el ticket, pero no hay confirmación del sistema operativo. | El intento queda `delivery-unknown`; no se reimprime automáticamente. | No puede saberse con certeza que el papel salió. | Definir procedimiento humano ante resultado incierto. |
| 7 | El agente recibe dos veces el mismo trabajo. | Identificador estable y registro local de trabajos aceptados evitan una segunda ejecución automática. | La durabilidad local depende del agente elegido. | ADR del protocolo y persistencia del agente. |
| 8 | Se solicita reimprimir. | Nueva solicitud auditada referencia el trabajo original y no ejecuta pedido ni cobro. | Puede producir una copia física adicional, explícitamente marcada. | Motivo obligatorio; roles según matriz aceptada. |
| 9 | Dos usuarios cobran el mismo pedido. | Restricción lógica de un cobro exitoso y transacción condicional; sólo uno gana. | El perdedor debe refrescar y explicar el resultado. | Pedido pagado no se cancela; reversos fuera del MVP. |
| 10 | Dos usuarios cierran la misma caja. | Cambio condicional `open → closing → closed`, versión y un único cierre válido. | Una segunda solicitud sólo recupera el cierre existente. | Pedidos operativos e intentos `pending` bloquean cierre. |
| 11 | El precio cambia después de vender. | Líneas confirmadas conservan nombre, opciones, precio e importes históricos. | La referencia al catálogo puede apuntar a una versión nueva. | BOB en centavos enteros; no hay redondeo silencioso. |
| 12 | El cliente altera `organization_id`. | El servidor deriva organización desde sesión y membresía; ignora/rechaza contexto no autorizado. | Requiere aislamiento aplicado en toda consulta y comando. | ADR técnico de tenancy y pruebas negativas. |
| 13 | Cocina intenta acceder a caja. | Autorización servidor por acción; rol cocina carece de permisos de caja. | Ocultar controles en UI no es protección. | Matriz contractual aceptada; pruebas negativas futuras. |
| 14 | El navegador se recarga durante el cobro. | Consulta del pedido y reintento con la misma clave recuperan pago o estado cobrable. | Una clave perdida exige reconciliar antes de reintentar. | Definir persistencia temporal segura de la intención. |
| 15 | Se cancela después de enviar a cocina. | Cancelación es transición auditada y notificada; cocina reconcilia la versión. | Cancelar tras preparación causa impacto operativo; tras cobro queda bloqueado. | Owner o cashier con autorización de owner; motivo; sin reversos en MVP. |
| 16 | Expira la sesión durante una operación. | Autenticación y autorización se revalidan al aceptar el comando; fallo no produce efecto parcial. | Una operación ya confirmada no se revierte por expiración posterior. | Elegir mecanismo de sesión y renovación. |
| 17 | El dispositivo tiene hora incorrecta. | Orden, auditoría y vencimientos usan tiempo del servidor; hora cliente es sólo diagnóstico. | Sin sincronización puede confundir al usuario. | Fecha operativa usa zona configurada de organización; presentación técnica pendiente. |
| 18 | Llegan eventos fuera de orden. | Cada agregado expone versión monotónica; consumidores ignoran avisos antiguos y reconcilian huecos. | Los avisos no constituyen historial autoritativo. | Elegir formato de versión/cursor y retención. |

## Veredicto y acciones

**Veredicto lógico:** `approved-with-actions`.

Quedan aprobados:

- servidor y persistencia como autoridad;
- navegador y tiempo real como proyecciones no autoritativas;
- límites modulares de pedidos, cocina, caja, pagos, impresión, acceso,
  auditoría y sincronización;
- transacciones atómicas para invariantes financieras y de estado;
- idempotencia para comandos repetibles;
- reconciliación después de desconexión;
- cola durable del servidor y agente local como único acceso a impresoras;
- aislamiento por organización y autorización obligatoria del lado servidor;
- observabilidad correlacionada sin datos sensibles innecesarios.

Acciones que siguen bloqueando implementación:

- conservar las reglas aceptadas de dominio en ADR-0002 a ADR-0004;
- aprobar ADR técnicos de persistencia, autenticación/sesiones, tenancy, tiempo
  real y agente de impresión;
- seleccionar stack y convertir quality gates en comandos ejecutables;
- validar impresión, reconexión y certeza limitada con hardware real en la fase
  correspondiente.
