# Modelo lógico de seguridad

## Frontera organizativa

Organización es la frontera de propiedad y aislamiento del MVP. El sistema no
confía en `organization_id` recibido desde formularios, rutas, mensajes o
almacenamiento local.

Regla contractual: nunca confiar en `organization_id` aportado por el cliente;
la organización autorizada siempre se deriva en servidor.

Para cada operación el servidor:

1. autentica la sesión;
2. resuelve usuario y membresía activa;
3. deriva la organización permitida;
4. autoriza acción y recurso concreto;
5. limita lectura/escritura a esa organización;
6. registra denegaciones sensibles sin filtrar datos.

Cambiar un identificador en el cliente no permite descubrir existencia ni
contenido de recursos ajenos.

## Identidad, membresía y roles

- Una identidad representa al usuario autenticable.
- Una membresía activa relaciona usuario y organización.
- Un rol mínimo concede un conjunto cerrado de acciones.
- Usuario inactivo, membresía revocada o sesión expirada deniegan por defecto.
- Multi-sucursal y roles configurables permanecen fuera del MVP.

## Matriz mínima

La matriz de acciones aceptada y su semántica permitido/prohibido/autorización
están en
[`ROLE_PERMISSION_MATRIX.md`](../domain/ROLE_PERMISSION_MATRIX.md). Una
autorización de owner es una segunda decisión autenticada para el comando
concreto, no una contraseña compartida ni una excepción de interfaz.

## Autenticación y sesiones

Supabase Auth es la plataforma seleccionada para identidad. El MVP usa
email/contraseña y alta administrativa: no hay registro público, OAuth social ni
MFA hasta otra fase. La API Fastify valida la sesión y vuelve a resolver
membresía/rol; un claim o estado React nunca es autoridad.

Requisitos:

- credenciales protegidas con mecanismo aprobado posteriormente;
- sesión con expiración, revocación y rotación cuando corresponda;
- cierre de sesión invalida uso posterior;
- reautenticación o nueva sesión después de expiración;
- autorización revalidada al aceptar cada comando sensible;
- agentes usan identidad de dispositivo distinta de usuarios humanos.

No se eligen proveedor, token, cookie, almacenamiento de contraseña ni duración
en esta revisión; requieren ADR técnico y threat model específico.

## Autorización

- Denegación por defecto.
- La política vive del lado servidor.
- Cada acceso verifica organización, acción, recurso y estado.
- Conocer un identificador no concede acceso.
- Operaciones masivas prueban cada frontera, no sólo una ruta inicial.
- Tiempo real filtra suscripciones y avisos por membresía vigente.
- El agente sólo accede a destinos de su registro.

Las pruebas deben intercambiar identificadores entre dos organizaciones y entre
roles, verificando denegación sin efecto lateral.

## Operaciones sensibles y auditoría

Auditar:

- login y fallos relevantes sin registrar credenciales;
- altas/bajas, membresías, roles y revocación;
- pedido confirmado, toda transición y todo intento de modificación posterior;
- cancelación autorizada o rechazada;
- pago exitoso, fallido y doble pago rechazado;
- apertura/cierre, ingreso, retiro y diferencia;
- registro, revocación y configuración de agentes;
- reimpresiones, reintentos manuales y resultados inciertos de impresión;
- modificación de producto/precio;
- error de sincronización relevante;
- accesos cruzados y denegaciones privilegiadas.

El registro contiene actor, organización, entidad/recurso, acción, resultado,
fecha del servidor, `correlation_id`, versión e identidad de dispositivo cuando
aplique, y valores anteriores/nuevos relevantes. No contiene contraseñas, tokens,
secretos, datos bancarios, contenido completo innecesario ni PII sin finalidad.

## Secretos

- Nunca se versionan ni se envían al navegador.
- Se inyectan desde el gestor de secretos del host; el proveedor concreto se
  decide con el despliegue.
- Se separan por ambiente y privilegio.
- Se rotan y revocan.
- Logs y errores los redactan.
- Credenciales de agente son específicas por dispositivo y alcance.

`.mcp.json` sólo referencia `${GITHUB_TOKEN}`; no contiene el valor. La clave
pública/anon de Supabase puede estar en web, pero jamás una service-role key.

## Separación de ambientes

Desarrollo, pruebas y producción deben tener:

- identidades, credenciales y datos separados;
- accesos mínimos y auditables;
- ninguna copia de datos sensibles sin proceso aprobado;
- endpoints/configuración inequívocos;
- promoción de artefactos sin reutilizar secretos.

La topología está en [`DEPLOYMENT_MODEL.md`](DEPLOYMENT_MODEL.md); el proveedor
concreto sigue pendiente.

## Amenazas prioritarias

| Amenaza | Control lógico |
|---|---|
| IDOR entre organizaciones | derivación servidor + filtro por organización + prueba negativa |
| Elevación de rol desde UI | política servidor y denegación por defecto |
| Manipulación de precio/total | recálculo servidor e instantánea confirmada |
| Repetición de comandos | idempotencia, huella y unicidad |
| Robo/reuso de sesión | expiración, revocación y mecanismo seguro pendiente |
| Suscripción a eventos ajenos | autorización de canal y avisos mínimos |
| Agente suplantado | registro, credencial por dispositivo y revocación |
| Secretos en logs | allowlist de campos y redacción |
| Entorno equivocado | separación de credenciales y configuración visible |

## Controles técnicos seleccionados

- PostgreSQL/RLS como defensa en profundidad y pruebas pgTAP negativas;
- API autoritativa, validación runtime y SQL parametrizado;
- TLS en tránsito y cifrado administrado en reposo;
- Gitleaks para secretos y OSV-Scanner/auditor de pnpm para dependencias;
- cabeceras, CORS allowlist, límites de cuerpo/rate y errores sin detalle sensible;
- logs allowlist con `correlation_id`, sin tokens ni payloads completos;
- credencial única, rotatoria, revocable y de alcance mínimo por agente.

## Decisiones y pruebas pendientes

- transporte/almacenamiento de sesión, renovación, revocación y recuperación;
- políticas RLS y tenancy físico;
- retención de auditoría y privacidad;
- proveedor de secretos y procedimiento de rotación;
- rate limits, CORS y cabeceras exactos;
- pruebas de sesión, IDOR, rol, dispositivo, suscripción y redacción.

Estas decisiones se resuelven en `phase-0-data-and-auth-review`; ninguna ausencia
se interpreta como control aprobado.
