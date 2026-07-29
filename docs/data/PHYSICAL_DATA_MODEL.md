# Modelo físico inicial de datos

## Estado y convenciones

Diseño conceptual aprobado para PostgreSQL administrado por Supabase. No contiene
SQL ejecutable ni crea tablas. Los nombres son contractuales hasta la primera
migración revisada.

- claves primarias: UUID opacos generados por servidor;
- tiempo: `timestamptz` de servidor en UTC; fecha operativa calculada con zona
  IANA de la organización;
- dinero: enteros de 64 bits en centavos BOB; nunca `float`;
- estado: valores cerrados mediante tipos o `CHECK`, definidos por migración;
- concurrencia: `version` entera monotónica en agregados mutables;
- tenancy: todo dato organizacional incluye `organization_id` y usa claves
  foráneas compuestas para impedir relaciones cruzadas;
- historial financiero/operativo: append-only o inmutable;
- borrado: `status`, `disabled_at` o archivado; no hard-delete de ventas.

Se duplica `organization_id` en hijos organizacionales deliberadamente: permite
RLS simple, índices acotados y foreign keys compuestas. Sólo `profiles`, tablas de
Auth administradas y catálogos técnicos globales carecen de organización.

## Identidad y organización

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `organizations` | tenant, PK `id` | raíz; sin parent | `name`, `timezone`, `currency`, `status`, `version` | moneda `BOB`; zona válida; índice `status` | suspender, no borrar; cambios sensibles auditados |
| `profiles` | perfil aplicativo 1:1 con `auth.users`, PK/FK `id` | global; acceso sólo vía memberships | `display_name`, `status`, `authz_version`, `disabled_at` | un perfil por identidad; estado cerrado | desactivar, no borrar mientras sea actor histórico; auditar |
| `memberships` | vínculo y rol, PK `id` | FKs separadas a organización y profile global | `role`, `status`, `invited_at`, `activated_at`, `revoked_at`, `version` | unique organización+perfil; rol owner/cashier/kitchen; índices perfil+estado y organización+estado | cambios append-audit; revocar, no borrar |
| `session_contexts` | vincula sesión Auth a membresía activa, PK `auth_session_id` | FK perfil y membership; organización derivada de membership | `expires_at`, `revoked_at`, `last_seen_at`, `authz_version_seen` | una sesión a una membership; la membresía debe seguir activa | revocación inmediata del API; retención corta tras expirar |
| `user_invitations` | coordina alta interna/Auth, PK `id` | org; invited_by y role destino | email normalizado protegido, `status`, `provider_user_id`, expiración, idempotencia | una invitación activa por org+email; sin token/link secreto | estados auditados; expirar/revocar, luego minimizar PII |
| `owner_authorizations` | aprobación secundaria de un comando, PK `id` | org; owner, actor y recurso misma org | `operation`, `payload_hash`, `expires_at`, `used_at` | un solo uso; TTL corto; hash inmutable | append-audit; no reutilizar ni guardar password |

Un perfil puede tener varias memberships en el modelo. En el MVP, si tiene una
sola activa se vincula automáticamente; cero deniega y más de una devuelve
`organization-selection-required` sin permitir elegir por body. Una futura
selección multi-organización actualizará `session_contexts` sólo mediante
Fastify después de validar la membership; no implica multi-sucursal.

## Catálogo

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `product_categories` | agrupación operativa, PK `id` | org directa | `name`, `sort_order`, `status`, `version` | nombre normalizado único por org; índices org+status+orden | desactivar; cambios auditados |
| `products` | artículo común, PK `id` | org; categoría opcional misma org | `name`, `description`, `status`, `version` | nombre/bounds; FK compuesta de categoría; índice org+status | desactivar, no borrar si fue vendido; auditar precio/disponibilidad indirectos |
| `product_variants` | opción vendible/precio, PK `id` | org; product misma org | `name`, `price_minor`, `status`, `version` | precio > 0; unique org+product+nombre; índice org+product+status | desactivar; venta conserva snapshot |
| `modifier_groups` | regla de selección, PK `id` | org directa | `name`, `min_select`, `max_select`, `required`, `status`, `version` | 0 ≤ min ≤ max; límites finitos | desactivar; auditar |
| `modifiers` | opción y ajuste, PK `id` | org; grupo mismo org | `name`, `price_delta_minor`, `status`, `version` | ajuste ≥ 0; unique org+grupo+nombre | desactivar; snapshot histórico |
| `product_modifier_groups` | habilita grupo para producto, PK `id` | org; producto y grupo misma org | `sort_order`, `status` | unique org+product+group; dos FKs compuestas | desactivar; auditar cambios |

## Pedidos y numeración

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `daily_order_sequences` | contador por fecha operativa, PK compuesta org+fecha | org directa | `operational_date`, `next_value` | un contador por org/fecha; valor positivo | fila bloqueada al asignar; no reutilizar números |
| `orders` | venta confirmada, PK `id` | org; actor/caja/pago relacionados misma org | `operational_date`, `daily_number`, `status`, `subtotal_minor`, `total_minor`, `currency`, `version`, `confirmed_at`, `cancel_reason` | unique org+fecha+número; total/subtotal > 0 e iguales en MVP; moneda BOB; estados ADR-0002; índices org+estado+fecha y org+número | nunca hard-delete; campos comerciales inmutables tras `confirmed`; auditar |
| `order_items` | snapshot de línea, PK `id` | org; order y product/variant de misma org | nombres snapshot, `quantity`, `unit_price_minor`, `modifier_total_minor`, `line_total_minor` | cantidad > 0; importes ≥ 0; fórmula exacta; índice org+order | append-only tras confirmación; no borrar |
| `order_item_modifiers` | snapshot de opción, PK `id` | org; item/modifier misma org | nombres snapshot, `price_delta_minor`, `quantity` | ajuste ≥ 0; cantidad > 0; unique item+modifier cuando no admite repetición | append-only; no borrar |
| `order_status_history` | sólo transición aceptada, PK `id` | org; order, actor y autorizador misma org | `from_status`, `to_status`, `reason`, `version`, `occurred_at`, `correlation_id` | versión única por pedido; transición permitida; índice org+order+version | append-only; rechazos sensibles van a audit_events |

La asignación de número bloquea la fila `daily_order_sequences` de la
organización/fecha dentro de la misma transacción que crea el pedido. Sólo
después de validar todo se incrementa y asigna. Una restricción única sigue
siendo la defensa final; ante conflicto serializable se reintenta de forma
acotada con la misma idempotencia.

## Pagos y caja

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `payment_attempts` | intento idempotente, PK `id` | org; order, cash_session y actor misma org | `method`, `status`, `amount_minor`, `received_minor`, `change_minor`, `reference`, `idempotency_record_id` | importe = total; received ≥ importe sólo cash; cambio = diferencia y ≥ 0; método cerrado; índice parcial unique por order cuando `succeeded`; índice org+order+created | append-only salvo transición pending→final; no borrar |
| `payments` | único cobro exitoso, PK `id` | org; order, attempt, cash_session, actor misma org | `method`, `amount_minor`, `reference`, `paid_at` | unique org+order y unique attempt; importe > 0; BOB | inmutable; sin reversos/borrado en MVP |
| `cash_sessions` | turno compartido, PK `id` | org; opened_by/closed_by/autorizador memberships | `status`, apertura/esperado/contado/diferencia, tiempos, `version` | importes no negativos salvo diferencia; índice parcial unique por org para open/closing; índices org+fecha/estado | closed inmutable; nunca reabrir/borrar |
| `cash_movements` | efecto de efectivo, PK `id` | org; cash_session, payment opcional y actor misma org | `kind`, `direction`, `amount_minor`, `reason`, `occurred_at` | importe > 0; unique payment para venta cash; manual exige motivo/autorización; caja open | append-only; corrección es nuevo movimiento futuro |

El pago exitoso requiere dos defensas: `payments` único por pedido y un índice
único parcial sobre intentos `succeeded`. La caja activa usa índice único parcial
para estados `open|closing`. Estas restricciones son independientes de Fastify.

## Impresión

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `print_agents` | dispositivo enrolado, PK `id` | org directa | `name`, `status`, huella de credencial, `last_seen_at`, versión | credencial única/revocable; índice org+status | desactivar, conservar identidad histórica |
| `logical_printers` | destino kitchen/cash, PK `id` | org; agente opcional misma org | `purpose`, `name`, `status`, configuración no secreta | unique org+purpose para MVP; propósito cerrado | desactivar; cambios auditados |
| `print_jobs` | intención durable, PK `id` | org; order, printer, original_job y actor misma org | `document_type`, `purpose`, snapshot contenido/versionado, `status`, lease, `version`, motivo reprint | original unique por org+order+document_type; reprint exige original/motivo; lease coherente; índices org+status+created y agente+lease | contenido inmutable; no borrar; reprint es otro row |
| `print_attempts` | ejecución por agente, PK `id` | org; job y agent misma org | `status`, `started_at`, `finished_at`, error categorizado, `correlation_id` | estados ADR; un intento activo por job; índice org+job+started | append-only; no afirma papel físico |

La credencial secreta del agente no se guarda en claro: sólo identificador y
huella/estado; el secreto vive en el gestor correspondiente.

## Soporte transversal

| Entidad | Propósito y clave | Organización/relaciones | Columnas críticas | Constraints e índices | Historia, eliminación y auditoría |
|---|---|---|---|---|---|
| `idempotency_records` | coordina repetición de comandos, PK `id` | org; actor/sesión y recurso opcional | `operation`, `client_key`, `payload_hash`, `status`, respuesta sanitizada, expiración | unique org+actor+operation+key; hash inmutable; índices expiración y estado | no eliminar `in-progress`; finales expiran según política |
| `audit_events` | evidencia de acción sensible, PK `id` | org; actor/agente/recurso opcionales | `event_type`, resultado, before/after allowlist, `correlation_id`, tiempo servidor | append-only; índices org+tiempo, recurso+tiempo, actor+tiempo | sin hard-delete hasta política local; acceso owner restringido |
| `outbox_events` | intención durable de publicar avisos, PK `id` | org; agregado y transacción origen | `topic`, `aggregate_id`, `aggregate_version`, payload mínimo, estado/intentos | unique topic+aggregate+version; índice pending+next_attempt | retención corta tras publicar; sin datos sensibles |

## Dinero y límites

- todo importe normal usa rango `0..9_000_000_000_000_000` centavos como guard
  técnico inicial, sujeto a prueba de producto; sólo diferencia de caja puede ser
  negativa dentro del mismo rango;
- precio de variante > 0; modificador ≥ 0; total de línea/pedido > 0;
- pago = total histórico; efectivo recibido ≥ pago; cambio = recibido − pago;
- multiplicaciones y sumas verifican overflow antes de persistir;
- entradas en BOB se convierten una vez en frontera y rechazan más de dos
  decimales.

## Retención y eliminación

- pedidos, líneas, pagos, caja, movimientos e historiales: sin hard-delete en el
  MVP; plazo fiscal/legal queda pendiente de validación boliviana;
- auditoría: no se purga hasta aprobar política legal, privacidad e integridad;
- trabajos/intentos de impresión: snapshot mínimo, sin PII innecesaria; plazo
  operativo por validar;
- logs operativos: objetivo provisional 30 días; seguridad 90 días, con acceso
  restringido;
- profiles/memberships: desactivar o revocar; una anonimización futura preserva
  IDs de actor e integridad;
- invitaciones: eliminar/minimizar email cuando expiren y ya no sea necesario,
  preservando evento/actor no sensible;
- datos de test: sintéticos, aislados y eliminados al terminar el entorno.

## 25 escenarios adversariales del gate

| # | Riesgo | Protección | Constraint físico | Autorización | Prueba futura | Limitación |
|---:|---|---|---|---|---|---|
| 1 | body trae org ajena | API la ignora y deriva sesión | FK compuestas + RLS | membership activa | IDOR API/pgTAP | errores no revelan existencia |
| 2 | JWT válido, usuario desactivado | consulta profile cada request | profile status + session revocation | deny | integración sesión | Auth puede aceptar token hasta exp |
| 3 | rol cambia con sesión abierta | membership es autoridad viva | version/revoked_at | rol nuevo en siguiente request | carrera rol/comando | UI puede verse obsoleta |
| 4 | mismo número concurrente | lock de contador | unique org+fecha+número | owner/cashier | concurrencia DB | reintento acotado |
| 5 | doble clic misma clave | recuperar resultado | unique scope idempotente | actor original | integración | key perdida exige consulta |
| 6 | misma clave, otro payload | conflicto sin efecto | payload_hash inmutable | actor original | contract test | hash no sustituye validación |
| 7 | dos pagos simultáneos | transacción y lock pedido | unique payment + partial succeeded | owner/cashier | carrera real | perdedor reconcilia |
| 8 | pago guardado, respuesta perdida | respuesta idempotente | record+payment únicos | actor autorizado | corte de red | registro expira después del plazo |
| 9 | dos cajas abren | transacción | partial unique activa | owner/cashier | carrera | error se traduce a conflicto |
| 10 | dos cierres | version/row lock | transición y version | owner/cashier según matriz | carrera | un ganador |
| 11 | RLS ausente/mal | grants mínimos y FORCE RLS | default deny | rol DB dedicado | pgTAP por tabla/rol | owner/superuser bypass se prueba aparte |
| 12 | service key en bundle | no existe en config web | secret scanner | sólo operación backend | inspección build | clave pública sí es visible |
| 13 | API y RLS discrepan | ambas deben permitir | contexto tx + política | deny si una falla | matriz dual | puede generar falso negativo |
| 14 | migración falla a mitad | transacción cuando sea posible | historial sólo tras éxito | rol migration | reset DB efímera | DDL no transaccional requiere pasos |
| 15 | cambio destructivo | expand/contract + restore | gate manual | aprobación humana | restore/rehearsal | no hay down automático seguro |
| 16 | restore más antiguo | reconciliar contra RPO | PITR + auditoría | operación restringida | simulacro | pérdida dentro de RPO posible |
| 17 | token expira cobrando | autenticar antes, tx atómica | ningún efecto parcial | sesión válida al aceptar | reloj/expiry | resultado confirmado sobrevive expiry posterior |
| 18 | Realtime cruza tenant | canal privado y payload mínimo | RLS realtime.messages | membership activa | suscripción cruzada | aviso no es fuente de verdad |
| 19 | agente reclama otro tenant | sólo API y credencial vinculada | FK/lease same org | agente activo | contract/integration | credencial robada exige revocar |
| 20 | kitchen llama caja | policy por caso de uso | grants no exponen DB | deny role kitchen | permisos negativos | ocultar botón no cuenta |
| 21 | snapshot no suma | recalcular antes de insert | checks/fórmulas verificadas | confirmador válido no salta regla | property/integration | DB no reemplaza dominio |
| 22 | editar confirmado | columnas/snapshots protegidos | trigger/política inmutable | nadie | integración SQL/API | corrección usa cancelar+nuevo |
| 23 | auditoría falla | rollback operación sensible | audit en misma tx | mismo actor | fault injection | telemetría externa no bloquea |
| 24 | idempotencia purgada pronto | TTL mínimo y uniques dominio | no purgar `in-progress` | operación original | prueba reloj | nueva orden tras TTL requiere intención nueva |
| 25 | frontend/API incompatibles | contrato versionado | schema artifact único | n/a | consumer contract | ventana de agente se define antes piloto |
