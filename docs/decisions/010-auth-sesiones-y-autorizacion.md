# ADR 010 — Autenticación, sesiones y autorización

## Contexto

Supabase Auth identifica al usuario, pero sus tokens pueden permanecer válidos
después de logout y sus metadata no reflejan necesariamente rol/membresía actual.
El MVP exige revocación práctica y autorización por recurso.

## Decisión

Usar Auth email/password con invitación interna, verificación de email,
recuperación y PKCE. La SPA persiste sesión en `sessionStorage`; no hay signup
público, social, MFA ni SSO.

Fastify verifica JWT asimétrico localmente con JWKS, issuer/audience/exp/sub y
`session_id`. Sólo confía identidad/tiempos; consulta en cada request profile,
`session_context`, membership, organización y rol.

Access token objetivo 1 hora; contexto aplicativo máximo 12 horas e inactividad
2 horas. Logout, desactivación y cambio de rol revocan contextos inmediatamente y
solicitan revocación Supabase. Las policies por caso de uso aplican la matriz y
RLS vuelve a limitar.

## Alternativas

| Alternativa | Ventaja | Riesgo/costo | Estado |
|---|---|---|---|
| confiar role/org en JWT | rápido | autorización obsoleta/manipulable | rejected |
| validar remoto cada request | revocación central | Auth en hot path y latencia/outage | rejected |
| cookies HttpOnly/BFF | reduce token JS | contradice SPA/Auth/Realtime directo y añade proxy | deferred |
| JWT local + authz DB viva | resiliencia y revocación API inmediata | consulta por request | accepted |

## Consecuencias

Un XSS puede leer tokens de la SPA; CSP, validación, dependencias y
`sessionStorage` son controles obligatorios. La caja no se ata a la sesión web.
Una caída Auth permite continuar sólo con JWT/JWKS válidos y DB disponible hasta
expirar.

## Riesgos y mitigaciones

- key revocada aún cacheada: TTL máximo, purge y procedimiento de rotación;
- DB authz indisponible: fail closed;
- refresh concurrente: cliente Supabase y pruebas de reutilización;
- usuario con varias memberships: deny hasta selector futuro autorizado.

## Prueba futura

Expiry/skew, JWKS rotation, provider outage, logout local/global, usuario
desactivado, rol en vuelo, IDOR, storage cleanup y enumeration.

## Estado

accepted

## Fecha

2026-07-29
