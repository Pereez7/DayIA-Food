# Estrategia de migraciones

## Decisión

Usar migraciones SQL versionadas y ordenadas por timestamp mediante Supabase CLI.
No usar ORM ni `node-pg-migrate`. La decisión aprovecha el workflow nativo para
PostgreSQL, RLS, Auth, Realtime, funciones, constraints y pruebas locales sin
añadir una segunda historia de migraciones.

No se inicializa Supabase ni se crea un archivo SQL en esta sesión.

## Comparación

| Alternativa | Ventajas | Riesgos/costo | Estado | Prueba futura |
|---|---|---|---|---|
| Supabase CLI + SQL | una historia, soporte RLS/plataforma, reset/diff/push | requiere revisión SQL disciplinada y runtime local | accepted | reset DB efímera |
| `node-pg-migrate` | TypeScript/JS y up/down programables | segunda herramienta e integración Supabase manual | rejected | reconsiderar si CLI bloquea |
| SQL propio sin tracker | mínimo tooling | drift y orden manual inseguros | rejected | no aplica |
| ORM migrations | productividad de modelo | no aprobado y peor cobertura de RLS/triggers | rejected | no aplica |

## Reglas

- nombre futuro: timestamp UTC + verbo/scope descriptivo;
- Git es autoridad; nunca cambiar production desde Dashboard/SQL editor;
- una migración aplicada o fusionada no se edita: se agrega otra;
- forward-only por defecto en producción;
- cada cambio incluye plan de rollback de aplicación/datos, no un `down`
  destructivo automático;
- DDL transaccional se ejecuta atómicamente; pasos no transaccionales se separan;
- una sola promoción coordinada por ambiente;
- `migration repair` sólo corrige historia después de comparar schema real y con
  aprobación; no aplica/revierte SQL;
- drift entre repo y ambiente bloquea despliegue.

## Expand/contract

1. expandir con tabla/columna nullable o estructura compatible;
2. desplegar aplicación que escribe/lee ambas versiones cuando sea necesario;
3. backfill por lotes idempotentes, medidos y reanudables;
4. verificar conteos, constraints y compatibilidad;
5. cambiar lectura a la forma nueva;
6. retirar estructura vieja en release posterior y backup probado.

Agregar `NOT NULL`, validar constraint o crear índice sobre tabla caliente se
planifica para minimizar locks. Cambios de tipo, drops y renames destructivos
requieren sesión separada, schema diff, estimación de lock, backup y restore.

## Seeds y datos de prueba

- seed separado, determinista, idempotente y sólo sintético;
- usuarios Auth de test se crean mediante mecanismo de test, nunca copiando
  producción;
- seed productivo limitado a referencias/configuración explícitamente aprobada;
- secretos y PII no se versionan;
- cada test limpia o recrea su base efímera.

## Gate de revisión

Cada migración futura requiere:

- diff de schema clasificado safe/locking/destructive;
- revisión SQL por inyección, constraints, índices, RLS, grants y locks;
- `db reset` desde cero;
- aplicar desde versión production y validar datos representativos;
- pgTAP de invariantes/RLS;
- rollback de aplicación y restore ensayados cuando el riesgo lo exige;
- comparación de historia local/remota;
- evidencia, aprobador y ventana operativa.

## Ambientes

Local y CI reconstruyen desde migraciones. Staging recibe exactamente el mismo
artefacto antes de production. Ningún ambiente reutiliza credenciales o datos de
otro. El paso futuro de despliegue usa `db push` no interactivo sólo después de
checks, con credencial de migración de vida corta.

Referencia verificada:
[Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations).
