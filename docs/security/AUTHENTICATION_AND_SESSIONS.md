# Autenticación y sesiones

## Alcance

Supabase Auth autentica identidad. Fastify autoriza. El MVP incluye
correo/contraseña, invitación interna, recuperación, verificación, logout,
revocación y desactivación. Excluye registro público, social login, MFA, SSO y
directorio empresarial.

## Alta y recuperación

- primer owner: bootstrap operacional restringido y auditado;
- owner crea una `user_invitations` idempotente; un worker/adapter Fastify llama
  Auth Admin con service role sólo en servidor;
- respuesta perdida se reconcilia por provider user/idempotencia; fallo queda
  reintentable y no concede acceso;
- profile/membership se crean o activan transaccionalmente sólo después de
  aceptar/verificar email;
- no existe endpoint público de signup;
- recuperación usa email de Supabase y enlace de un solo uso; al confirmar la
  nueva contraseña revoca todos los `session_contexts` y sesiones Auth, limpia
  tokens locales y exige un login nuevo;
- errores públicos no confirman si un email existe; auditoría conserva categoría
  segura.

## Flujo

```text
cliente SPA
→ Supabase Auth con PKCE
→ access JWT + refresh token
→ Authorization Bearer hacia Fastify
→ firma/issuer/audience/exp/session_id verificados
→ profile + session_context + membership consultados
→ organización/rol/ownership autorizados
→ caso de uso
```

El cliente Supabase se limita a Auth y Realtime privado. La sesión se persiste en
un adapter de `sessionStorage`, no `localStorage`: sobrevive recarga de la pestaña
pero no cerrar navegador. Access y refresh token siguen accesibles a JavaScript,
riesgo inherente de SPA que se mitiga con CSP estricta, sin scripts arbitrarios,
escape de salida, dependencias auditadas y limpieza en logout.

## Validación Fastify

Se requieren signing keys asimétricas. Una librería JWT mantenida valida
criptográficamente contra JWKS oficial:

- algoritmo permitido explícito; `kid` conocido;
- `iss` exacto del proyecto, audience esperado, `sub` UUID;
- `exp`, `nbf`/`iat` y tolerancia máxima de reloj de 60 segundos;
- `session_id` UUID presente;
- HTTPS obligatorio.

JWKS se cachea como máximo 10 minutos, se refresca ante `kid` desconocido y puede
purgarse operacionalmente. La rotación prepara la nueva key, espera propagación
mínima documentada por el proveedor y conserva overlap hasta expirar tokens
anteriores.

Fastify puede confiar sólo en identidad criptográfica (`sub`), emisor, audience,
tiempos y `session_id`. No confía para autorización en email, `role`,
`user_metadata`, `app_metadata`, organization o permisos del token.

## Duraciones y refresh

- access token: objetivo 1 hora y nunca mayor sin nueva revisión;
- app session: máximo 12 horas e inactividad máxima 2 horas mediante
  `session_contexts`, aun si el plan Supabase no ofrece esos controles;
- refresh rotation: administrada por Supabase, token de un solo uso con su
  ventana de reutilización segura;
- el cliente refresca antes de expirar; una petición ya aceptada termina
  atómicamente aunque el token expire durante ella;
- reloj de servidor sincronizado; nunca se usa reloj cliente para autorizar.

Los tiempos se validarán con turnos reales; cambiarlos requiere pruebas de
seguridad, carga Auth y experiencia operativa.

## Revocación y cambios

Cada petición consulta profile, session_context y membership:

- logout local revoca el `session_context` y solicita signout de la sesión Auth;
- “cerrar todas” revoca todos los contextos y sesiones Auth del usuario;
- desactivar profile o membership incrementa `authz_version`, revoca contextos y
  solicita revocación Auth;
- cambio de rol incrementa versión y rige en la siguiente petición;
- organización suspendida deniega todos los casos de uso salvo recuperación
  administrativa explícita;
- access tokens de Supabase pueden seguir criptográficamente válidos hasta
  `exp`; `session_contexts` proporciona negación inmediata en la API.

No se borra una sesión de caja al cerrar sesión; caja es turno organizacional.

## Fallos

| Fallo | Resultado |
|---|---|
| Auth no disponible al iniciar/refrescar | no crear sesión; error recuperable |
| Auth no disponible con JWT válido y JWKS cacheada | API puede continuar hasta exp si DB y contexto están activos |
| `kid` desconocido y JWKS inaccesible | fail closed |
| PostgreSQL/membership inaccesible | fail closed para negocio |
| refresh reutilizado fuera de tolerancia | sesión terminada; reautenticar |
| token expirado durante cobro antes de aceptar | rechazo sin writes |
| token expira después de iniciar transacción autorizada | commit/rollback atómico; no reautorizar a mitad |
| error Auth Admin al invitar/desactivar | no afirmar éxito; reconciliar Auth y datos aplicativos |

## Auditoría

Registrar login relevante, logout, recovery solicitado/completado, invitación,
activación, fallo categorizado, revocación, desactivación, cambio de rol y sesión
denegada. Un fallo pre-auth sin organización va al log de seguridad; sólo entra a
`audit_events` cuando organización/actor se resolvieron. Nunca registrar token,
password, link de recovery, secreto, payload Auth completo o email innecesario.

## Pruebas futuras

PKCE, email verification, enumeration, expiry/skew, refresh concurrente,
revocación inmediata, logout local/global, rol/membership durante request, JWKS
rotation/cache purge, provider outage, XSS/storage cleanup y dos organizaciones.

## Referencias verificadas

- [Supabase JWT](https://supabase.com/docs/guides/auth/jwts)
- [Supabase sessions](https://supabase.com/docs/guides/auth/sessions)
- [Supabase signing keys](https://supabase.com/docs/guides/auth/signing-keys)
- [Supabase signout](https://supabase.com/docs/guides/auth/signout)
