# Tenancy y Row-Level Security

## Decisión de acceso

El frontend no tiene `SELECT`, `INSERT`, `UPDATE` ni `DELETE` directo sobre
tablas o vistas comerciales. Usa el cliente Supabase únicamente para:

1. autenticación y recuperación de sesión;
2. suscripciones Realtime privadas y autorizadas.

Toda consulta o comando de catálogo, pedido, pago, caja, auditoría e impresión
pasa por Fastify. El agente tampoco accede a PostgreSQL: usa la API HTTPS.

## Resolución de organización

```text
JWT verificado
→ claim sub + session_id
→ profile activo
→ session_context vigente
→ membership activa
→ organization activa
→ política del caso de uso
```

`organization_id` en body, query, route, cabeceras o storage cliente se ignora
como fuente de autorización. Un ID de recurso se busca siempre con el contexto
organizacional derivado; un fallo cruzado devuelve la misma respuesta sanitizada
que un recurso inexistente.

En el MVP, una membership activa se vincula automáticamente a la sesión. Si hay
más de una, se deniega con un estado explícito hasta que una fase futura apruebe
selección de organización. El esquema ya admite varias memberships sin
implementar multi-sucursal.

## Estrategia física

- `profiles` es global y referencia `auth.users`; no posee organización.
- roles son el valor cerrado de `memberships`; no existe tabla/editor dinámico
  de permisos en el MVP.
- Toda tabla de negocio incluye `organization_id NOT NULL`.
- Padres organizacionales exponen unicidad conceptual `(organization_id, id)`.
- Hijos usan foreign keys compuestas con su propio `organization_id`; no pueden
  enlazar un pedido de A con una línea, caja o impresora de B.
- Todos los índices operativos comienzan por `organization_id` cuando el filtro
  normal es tenant-scoped.
- No se duplica organización en secretos globales ni en `auth.*`.
- Sucursal no existe en Fase 1. Una futura `branch_id` se añadirá por
  expand/contract sin reinterpretar `organization_id` histórico.

## Roles de PostgreSQL

| Rol | Privilegios | RLS |
|---|---|---|
| `anon` | ninguno sobre schemas de aplicación | default deny |
| `authenticated` | sin CRUD comercial; sólo autorización de canales privados | políticas explícitas |
| `dayia_api` | operaciones necesarias vía conexión Fastify | sujeto a RLS y no owner |
| `dayia_migrator` | DDL en pipeline controlado | no sirve tráfico |
| `service_role` | administración Supabase/Auth excepcional | bypass; nunca consultas comerciales normales |
| owner de tablas | sólo migraciones | `FORCE RLS` evita uso accidental en runtime |
| agente local | ningún rol DB | API solamente |

La contraseña de `dayia_api`, claves `service_role` y credenciales de migración
nunca llegan al navegador. Fastify establece dentro de cada transacción el
contexto verificado de profile, membership y organización; no acepta SQL
arbitrario del cliente.

## Políticas conceptuales

| Recurso | Lectura | Escritura | Defensa adicional |
|---|---|---|---|
| memberships | API: usuario actual/owner según caso; frontend ninguna | owner por API | profile y org derivadas |
| products/catalog | roles de la org por API | owner por API | org+status; snapshots |
| orders/items/history | roles permitidos de org por API | casos de uso Fastify | org compuesta, versión e inmutabilidad |
| payments/attempts | owner/cashier por API | cobrar por API | pago único y caja abierta |
| cash sessions/movements | owner/cashier según matriz | casos de caja | caja activa única |
| print jobs/attempts | roles/agent por API | cola y agente por API | agent/printer misma org |
| audit events | owner por API; operación interna | append interno | ninguna actualización/borrado runtime |
| realtime.messages | membership activa y topic exacto | publicación servidor; cliente sin broadcast de negocio | canal privado y topic derivado |

RLS usa denegación por defecto, `USING` y `WITH CHECK` equivalentes para evitar
crear/mover filas cruzadas. Las políticas se declaran para roles concretos; no
para `PUBLIC`. El rol de runtime no es owner ni `BYPASSRLS`.

Las policies del rol `dayia_api` leen contexto transaction-local fijado por
Fastify después de autorizar; el pool debe resetearlo al terminar. Realtime
necesita comprobar memberships sin conceder lectura de la tabla: usará una
función booleana `security definer` en schema privado, con `search_path` fijo,
sin SQL dinámico y `EXECUTE` mínimo. Esa función no concede datos, sólo
allow/deny, y tiene pruebas específicas contra escalation.

## Realtime

La dirección seleccionada es Broadcast en canales privados; Postgres Changes
queda sólo para prototipos de bajo volumen. El servidor publica desde
`outbox_events` avisos mínimos:

```text
organization scope + resource type + opaque id + version + correlation id
```

El topic no se acepta libremente del cliente. La política de
`realtime.messages` comprueba `auth.uid()` contra membership activa y el scope
del topic. El frontend no publica cambios de negocio y, al recibir un aviso,
invalida/refetch contra Fastify.

## Pruebas obligatorias

- pgTAP: cada tabla con RLS habilitada, `FORCE RLS`, grants y default deny;
- matriz `anon`, `authenticated`, `dayia_api`, owner y service role;
- dos organizaciones con IDs intercambiados en lectura/escritura;
- FK compuestas rechazan relaciones cruzadas incluso con RLS deshabilitada;
- `WITH CHECK` impide mover fila entre organizaciones;
- API y RLS evaluadas juntas para cada rol;
- canales privados rechazan topic de otra organización;
- helper Realtime no permite cambiar `search_path`, inyectar topic ni leer filas;
- scanner confirma que service/DB keys no están en build web.

Una prueba con service role no demuestra RLS porque ese rol puede omitirla.

Referencias: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
y [Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization).
