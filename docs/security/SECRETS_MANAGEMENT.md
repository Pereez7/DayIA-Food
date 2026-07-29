# Gestión de secretos

## Inventario

| Secreto/configuración | Ubicación permitida | Consumidor | Rotación/revocación |
|---|---|---|---|
| Supabase publishable key | config pública web | SPA Auth/Realtime | rotar al cambiar proyecto; no es privilegiada |
| Supabase secret/service role | secret manager API | Auth Admin excepcional | inmediata por incidente/periódica |
| conexión `dayia_api` | secret manager API | Fastify | password/credencial rotatoria |
| migrator/database admin | secret CI de vida corta | job de migración | por ejecución o ventana |
| signing private keys/JWT legacy | Supabase únicamente | Auth | proceso de key rotation |
| credencial agente | almacén seguro Windows + hash/estado servidor | agente/API | por dispositivo, revocable |
| firma de actualización | HSM/secret manager de release | pipeline autorizado | ceremonia y revocación |
| deployment/provider token | secret manager CI | deploy | mínimo scope y vida corta |
| Sentry/observabilidad secret | secret manager por componente | API/agent | rotar; DSN pública separada |
| backup encryption/access | vault operacional separado | backup/restore | doble control y prueba |

Nunca se incluyen valores reales en documentación, `.env.example`, logs,
capturas, tickets o respuestas.

## Ambientes

Local, CI, staging y production usan proyectos y secretos distintos. Desarrollo
local obtiene valores desde un almacén personal no versionado; CI usa secretos
protegidos y ambientes con aprobación; production sólo desde runtime secret
manager. Ningún job de pull request no confiable recibe secretos.

## Exposición mínima

- web sólo recibe URL y publishable key;
- service role jamás se usa para construir el cliente web;
- agente no recibe DB/service role;
- Fastify usa `dayia_api` para negocio y service role sólo en un adapter Auth
  Admin aislado;
- migrator no sirve requests;
- logs usan allowlist y redacción antes de salir del proceso;
- errores no devuelven conexión, claims completos o configuración.

## Ciclo de vida

Inventariar owner, propósito, scope, ambiente, creación, última rotación y
dependencias sin guardar el valor. Rotación:

1. crear secreto nuevo/standby;
2. desplegar consumidores compatibles;
3. verificar uso;
4. revocar anterior;
5. comprobar fallos/escáner;
6. registrar auditoría.

Un secreto expuesto se considera comprometido: revocar/rotar, investigar alcance
y revisar historial; borrarlo del último commit no es suficiente.

## Controles futuros

- Gitleaks en repo completo y diff;
- OSV/pnpm audit para dependencias que manejan secretos;
- inspección de bundle web y sourcemaps;
- permisos mínimos de GitHub Actions fijados por SHA;
- variables protegidas y logs CI redactados;
- prueba de revocación de agente/API/deploy;
- runbook para signing key y service-role compromise.
