# Arquitectura inicial propuesta

> **Estado: propuesta pendiente de aprobación.**
>
> Este documento no decide tecnologías, proveedores ni dependencias y no autoriza
> implementación. Toda decisión difícil de revertir requiere un ADR según
> [`docs/decisions/README.md`](../decisions/README.md).

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

La separación física del backend respecto de la aplicación web está pendiente de
aprobación. El límite lógico debe existir aunque el despliegue inicial sea simple.

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
encuentra en [`DATABASE_DESIGN.md`](DATABASE_DESIGN.md). El motor, modelo físico,
tipos, índices, particiones y estrategia de migración siguen pendientes.

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

- stack de aplicación web y backend;
- motor y topología de persistencia;
- transporte de actualización en tiempo real;
- mecanismo de autenticación, sesiones y aplicación de permisos;
- estrategia de operación degradada;
- protocolo y distribución del agente de impresión;
- modelo de despliegue, observabilidad y secretos;
- estrategia de aislamiento por organización;
- estrategia futura de múltiples sucursales.

Ningún punto de esta lista se considera aprobado por aparecer en este documento.
