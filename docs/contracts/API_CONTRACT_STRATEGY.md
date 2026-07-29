# Estrategia de contrato API

## Autoridad

El servidor publica el contrato. Esquemas Zod versionados en
`packages/contracts` serán la única fuente TypeScript/runtime. De ellos se
derivarán:

- schemas JSON consumidos por validación/serialización Fastify;
- documento OpenAPI;
- tipos/cliente web generado;
- modelos compatibles para el agente;
- fixtures y pruebas de contrato.

No se escriben manualmente una interfaz TypeScript y un OpenAPI paralelos. Esta
sesión no crea packages, schemas ni generadores.

## Contrato de cada operación

- método/path y versión;
- autenticación y permiso requerido;
- parámetros/body con unknown fields rechazados;
- bounds de strings, arrays, importes y paginación;
- idempotency key y precondición/version cuando aplica;
- respuesta de éxito y errores categorizados;
- IDs opacos, dinero en centavos y timestamps UTC;
- correlation ID;
- efectos, invariantes y compatibilidad.

Los errores no incluyen stack, SQL, policy, existencia cruzada ni claims
completos.

## Versionado

- prefijo mayor `/v1`; cambios aditivos compatibles no cambian major;
- campos nuevos son opcionales para consumidores antiguos;
- no cambiar significado/tipo ni eliminar campos dentro de v1;
- deprecación documentada y medida antes de retirar;
- breaking change requiere `/v2`, ADR y periodo paralelo;
- OpenAPI se publica como artefacto identificado por commit y versión;
- agente local declara rango de versiones soportadas antes del piloto.

## Flujo

1. cambiar schema fuente y ejemplos;
2. generar JSON Schema/OpenAPI/client;
3. detectar diff de contrato;
4. clasificar additive/deprecated/breaking;
5. ejecutar productor y consumidores contra el artefacto real;
6. desplegar servidor compatible antes que consumidores dependientes;
7. conservar versión anterior durante la ventana aprobada.

La selección del adapter Zod↔Fastify/OpenAPI ocurre al inicializar dependencias,
con prueba de round-trip y sin cambiar la autoridad.

## Realtime y agente

Realtime publica envelopes versionados mínimos y el cliente refetch. El agente
usa HTTPS y schemas de claim/lease/resultado; no comparte tipos internos ni
accede a DB.

## Pruebas obligatorias

- validación runtime de request y response;
- documento OpenAPI válido y reproducible sin diff inesperado;
- cliente generado compila contra la versión publicada;
- errores, campos opcionales, bounds, idempotencia y version conflict;
- consumer test web y agente contra contrato real, no mock autoescrito;
- compatibilidad N/N-1 durante despliegue;
- contrato no expone secret, organization derivada ni campos internos.
