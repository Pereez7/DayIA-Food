# Autorización

## Separación

Autenticación responde “quién y qué sesión”. Autorización responde “puede esa
identidad ejecutar este caso de uso sobre este recurso, organización y estado”.
Un JWT válido nunca basta.

## Pipeline Fastify

1. middleware autentica JWT y produce `subject/session_id`;
2. resolver carga profile, session_context, membership y organization activas;
3. caso de uso declara permiso requerido y estados válidos;
4. policy evalúa role, ownership, autorización secundaria y recurso dentro de la
   organización;
5. repositorio agrega organization derivada y PostgreSQL/RLS vuelve a limitar;
6. denegación no escribe salvo audit seguro y no revela existencia cruzada.

No hay middleware genérico “logged in = allowed”. Cada handler registra
explícitamente su policy.

## Reglas técnicas de roles

La fuente funcional es
[`ROLE_PERMISSION_MATRIX.md`](../domain/ROLE_PERMISSION_MATRIX.md).

- `owner`: administración de usuarios/catalogo y capacidades operativas;
- `cashier`: pedidos, cobro y caja dentro de condiciones;
- `kitchen`: lectura/transiciones de cocina e impresión de comanda;
- denegación por defecto para acción nueva;
- ownership añade condiciones como “cashier que abrió”;
- un permiso `A` exige una autorización owner de un solo uso vinculada a
  organización, operación, recurso, actor, expiración corta y payload hash;
- la autorización secundaria no guarda ni comparte password.

Roles siguen siendo valores cerrados en membership; no se crea un editor de
permisos.

`owner_authorizations` es consumida dentro de la misma transacción del comando.
Expirada, usada, para otro actor/recurso/hash o de otra organización se deniega.

## Contexto y queries

Toda consulta usa `organization_id` derivada más ID opaco. En children se aplican
FK compuestas. Listados son paginados, acotados y filtrados por policy. Búsquedas
cruzadas responden como no encontrado, excepto auditoría interna segura.

No se confía en:

- ruta o botón oculto;
- `organization_id`, `role`, totals o actor del request;
- cache/store React;
- claims de metadata;
- una vista Realtime;
- pertenencia inferida sólo por un parent leído antes de otra transacción.

## Operaciones sensibles

Pedidos, cancelación, estado, pagos, caja, movimientos, usuarios/roles,
auditoría, impresoras y reimpresión atraviesan Fastify. No se exponen funciones
SQL públicas para saltar casos de uso.

Cambiar membership/rol bloquea la fila objetivo, impide eliminar al último owner
activo mediante constraint diferida o validación transaccional y revoca contextos
afectados.

## Matriz de pruebas

Por cada handler:

- éxito para cada rol permitido;
- denegación para los otros roles sin side effects;
- ID de otra organización;
- profile/membership/session/organization inactivos;
- recurso en estado incompatible;
- autorización secundaria ausente, expirada, ya usada o de otro payload;
- rol cambiado entre lectura y commit;
- RLS activada y desactivación accidental detectada por pgTAP;
- respuesta/error no revela datos.

Los fixtures mínimos contienen dos organizaciones, tres roles por organización y
IDs intercambiables. Mocks de policy no prueban autorización real.
