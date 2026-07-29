# Stack tecnológico

## Estado y veredicto

`approved-with-actions` — dirección aceptada para el MVP; no autoriza
instalación. Versiones exactas, proveedor de hosting y runtime final de impresión
se fijan sólo con evidencia en sus gates.

## Criterios de decisión

Las opciones se evaluaron por: ajuste al MVP; aprendizaje del equipo; madurez y
soporte; TypeScript de extremo a extremo; testabilidad; seguridad y aislamiento;
transacciones; tiempo real; impresión Windows; operación; costo inicial y
predecible; rendimiento; accesibilidad; portabilidad; lock-in; mantenibilidad;
experiencia de agentes; ecosistema; y reversibilidad.

## Matriz general

| Área | Alternativas | Ventajas | Costos/riesgos | Recomendación | Estado |
|---|---|---|---|---|---|
| Web | React/Vite; Next.js; Vue/Vite | React tiene ecosistema y talento amplios; Vite entrega SPA simple | Next añade servidor/SSR innecesario; Vue divide el stack propuesto | React 19 + TypeScript + Vite | accepted |
| Navegación | React Router; router propio | estándar probado frente a código propio | dependencia adicional | React Router | accepted |
| Estado remoto | TanStack Query; Redux Toolkit Query; fetch manual | caché, reintentos y refetch explícitos | mal uso puede duplicar autoridad | TanStack Query | accepted |
| Estado cliente | React; Zustand; Redux Toolkit | React minimiza dependencias; Zustand cubre borrador transversal | stores globales pueden ocultar flujos | React local + Zustand acotado | accepted |
| Formularios/validación | React Hook Form + Zod; formularios controlados; Yup | schemas runtime reutilizables y menor rerender | doble fuente si schema y API divergen | RHF + Zod | accepted |
| Estilos | CSS Modules/tokens; Tailwind; librería UI completa | CSS estándar, aislamiento y tokens sin runtime | exige disciplina de componentes | CSS Modules + custom properties | accepted |
| Backend | Fastify; NestJS; Supabase-only | Fastify es pequeño, schema-first y testeable | requiere definir convenciones propias | Node 24 LTS + Fastify | accepted |
| Persistencia | PostgreSQL/Supabase; PostgreSQL autogestionado; Firebase | relacional, transaccional y managed | dependencia de plataforma administrada | Supabase PostgreSQL | accepted |
| Acceso DB | `pg` + SQL; Prisma; Drizzle | SQL explícito preserva control de transacciones | más trabajo manual y disciplina | `pg` tras repositorios | accepted |
| Auth | Supabase Auth; Auth.js; proveedor SaaS separado | integrado con Postgres/RLS y bajo costo inicial | sesión/claims deben diseñarse | Supabase Auth | accepted |
| Tiempo real | Supabase Realtime; WebSocket propio; polling | reduce operación y tiene fallback sencillo | entrega no equivale a autoridad | invalidación + refetch | accepted |
| Repositorio | pnpm monorepo; npm monorepo; repos separados | contratos atómicos y lockfile único | CI puede crecer; pnpm es otra herramienta | pnpm workspaces | accepted |
| Impresión | Tauri; QZ Tray; Electron; servicio Node | Tauri ofrece NSIS per-user y capacidades acotables | API/plugin, hardware, identidad, firma y updates sin probar | Tauri candidato; QZ contingencia; plan SPK-PRINT-001–010 | needs-spike |
| Observabilidad | Pino/Sentry; OpenTelemetry/APM; logs de proveedor | inicio proporcional y correlación | proveedor y privacidad por validar | Pino + Sentry; OTel diferido | accepted |
| Hosting | host estático + contenedor; PaaS integrado; VM | separación portable y rollback por artefacto | región/costos aún desconocidos | topología aceptada, proveedor diferido | needs-spike |

Costo significa complejidad, operación, licencias y consumo; los precios
monetarios se verificarán al contratar porque cambian con el tiempo.

## Frontend y fronteras de estado

- React 19 estable con TypeScript estricto y Vite estable compatible con Node 24
  LTS. SPA es suficiente para una aplicación autenticada; no se asume SSR.
- React Router posee navegación y permisos de presentación, nunca autorización.
- TanStack Query posee exclusivamente estado remoto, caché y refetch.
- `useState`/`useReducer` poseen estado local; los valores derivables no se
  almacenan.
- Zustand sólo puede conservar borradores efímeros del POS entre rutas. No
  guarda sesión autoritativa, permisos, catálogo canónico ni resultados de
  comandos.
- React Hook Form orquesta formularios y Zod valida entradas/salidas runtime.
- CSS Modules y variables CSS implementan tokens. Se prefieren elementos nativos
  y componentes accesibles propios; primitivas externas se evaluarán por
  necesidad demostrada.
- Lucide aporta iconos; nombres, etiquetas y estados no dependen sólo del icono.
- `Intl` cubre fecha, hora, moneda y zona; una biblioteca temporal se difiere
  hasta demostrar una necesidad que `Intl` no resuelva.

## Backend, datos, auth y tiempo real

La API Fastify es la autoridad de comandos y consultas. El navegador nunca
escribe directamente tablas ni decide organización, rol, precio, total, estado o
idempotencia.

Supabase aporta PostgreSQL administrado, Auth y Realtime. Fastify valida JWT
asimétrico con JWKS, pero consulta profile, session context y membership para
cada autorización. RLS es defensa en profundidad, no sustituto de autorización.

El frontend no tiene CRUD directo de negocio: el cliente Supabase se limita a
Auth y Realtime privado. Fastify/`pg` usa un rol DB no-owner sujeto a RLS; service
role queda aislada a Auth Admin.

El acceso usa SQL parametrizado mediante `pg` detrás de repositorios. Dinero se
persiste en unidades menores enteras; restricciones, índices únicos y
transacciones protegen invariantes. Las migraciones SQL y tipos generados por
schema se crearán sólo tras el siguiente gate.

Realtime transporta avisos mínimos con organización/recurso/id/versión/correlación.
El cliente invalida y vuelve a consultar la API. Si falla la suscripción, usa
polling y reconciliación; un evento nunca reemplaza el estado persistido.

## Contratos y portabilidad

`packages/contracts` será la fuente TypeScript de esquemas Zod para límites
web/API. OpenAPI, schemas Fastify y cliente se generarán de esos contratos para
agente/pruebas; no se mantendrán descripciones manuales paralelas. Los tipos
compilados no sustituyen validación runtime.

El dominio puro no importará React, Fastify, Supabase ni Tauri. Adaptadores,
repositorios y contratos limitan lock-in. Exportaciones y restauración
PostgreSQL, compatibilidad de API y ventanas de versión del agente son requisitos
operativos.

## Dirección provisional del spike de impresión

- objetivo primario: Windows 11 x64 soportado; Windows 10 sólo LTSC/ESU
  representativo;
- Tauri requiere WebView2 en runtime y C++ Build Tools/Rust sólo en desarrollo;
- NSIS per-user es hipótesis de instalación sin admin, no decisión final;
- Tauri no se presume proveedor de impresión térmica: se evaluarán spooler
  Windows/driver y raw ESC/POS detrás de un contrato;
- cualquier plugin/adaptador exige evidencia de mantenimiento, licencia,
  advisories, permisos y Tauri 2 antes de usarse;
- polling HTTPS saliente es hipótesis preferida; tres transportes alternativos
  se comparan;
- updater y code signing sólo se prueban en el ciclo correspondiente; ninguna
  clave se crea en esta sesión.

Fuente contractual:
[`PRINTING_SPIKE_PLAN.md`](../spikes/PRINTING_SPIKE_PLAN.md). ADR-0008 continúa
`proposed`.

## Toolchain futuro

| Gate | Herramienta prevista | Comando estándar futuro |
|---|---|---|
| Types | TypeScript | `pnpm typecheck` |
| Estilo | ESLint + Prettier | `pnpm lint`, `pnpm format:check` |
| Unitarias | Vitest | `pnpm test:unit` |
| Integración | Vitest + Supabase local + pgTAP | `pnpm test:integration` |
| Contratos | Vitest/OpenAPI | `pnpm test:contract` |
| E2E | Playwright | `pnpm test:e2e` |
| Build | Vite/TypeScript/Tauri cuando se apruebe | `pnpm build` |
| Dependencias | pnpm audit + OSV-Scanner | `pnpm security:dependencies` |
| Secretos | Gitleaks | `pnpm security:secrets` |
| Verificación | composición sin atajos | `pnpm verify` |

Estos comandos son contratos documentales: hoy no existen scripts ni
dependencias y deben permanecer `blocked` hasta su inicialización explícita.

## Escenarios adversariales

| # | Riesgo | Capacidad del stack | Mitigación | Limitación | Prueba futura | Decisión/evidencia pendiente |
|---:|---|---|---|---|---|---|
| 1 | Doble confirmación de pedido | transacción + unique key | record/hash + uniques dominio | aún sin SQL | integración concurrente | materializar ADR-0009 |
| 2 | Respuesta perdida tras confirmar | API consultable | repetir misma clave y reconciliar | red puede ocultar resultado temporal | fault injection | TTL de claves |
| 3 | Dos cobros simultáneos | PostgreSQL serializa/condiciona | payment unique + partial succeeded + lock | aún sin SQL | carrera real | materializar/probar |
| 4 | Caja abierta dos veces | constraint transaccional | índice parcial open/closing | aún sin SQL | dos sesiones paralelas | materializar/probar |
| 5 | Cierre con cobro en vuelo | transacción y estado | lock/version + `closing` | timeout por medir | carrera cierre/cobro | baseline |
| 6 | Precio manipulado en navegador | API autoritativa | recalcular + constraints/snapshot | aún sin SQL | contract/integration negativo | materializar |
| 7 | `organization_id` ajeno | Auth + lookup + RLS | session context, FK compuestas y RLS | aún sin policies | IDOR/RLS pgTAP | materializar |
| 8 | Rol cliente adulterado | backend resuelve rol | membership consultada por request | costo sin medir | permisos negativos | benchmark |
| 9 | JWT robado | Auth + app revocation | sessionStorage, expiry, session context | XSS aún expone token | robo/revocación E2E | CSP/toolchain |
| 10 | Signup público accidental | Auth configurable | invitation durable, sin signup | integración no creada | configuración automatizada | materializar |
| 11 | Secreto Supabase en bundle | separación web/API | sólo clave pública en web; service key servidor | scanner aún no instalado | build + secret scan | vault/proveedor |
| 12 | Evento realtime ajeno | canales/RLS | Broadcast privado + membership/topic | policies no creadas | suscripción cruzada | materializar |
| 13 | Evento perdido/desordenado | versión + refetch | invalidar, polling y comparar versión | latencia degradada | desconexión/reorden | intervalos |
| 14 | Realtime duplicado | cliente idempotente | avisos sin efectos de negocio | consumo extra | replay de eventos | dedupe window |
| 15 | SQL injection | `pg` parametrizado | no concatenar entrada, allowlists | revisión de queries requerida | payloads maliciosos | query builder no |
| 16 | Migración rompe rollback | SQL versionado | Supabase CLI + expand/contract | no hay pipeline aún | upgrade/restore ensayo | materializar ADR-0011 |
| 17 | Restore incompleto | backups administrados | PITR requerido + simulacro | plan/costo sin contratar | restauración staging | validar RPO/RTO |
| 18 | Proveedor cae | capas portables | artefactos, export DB, runbook | Auth/Realtime tienen lock-in | ejercicio continuidad | proveedor/región |
| 19 | Bundle crece | Vite analiza artefacto | budgets y carga diferida | baseline inexistente | build medido | límite final |
| 20 | API saturada en hora pico | Fastify + métricas | límites, pool y backpressure | carga desconocida | prueba p95 concurrente | tamaño/pool |
| 21 | Agente falso reclama trabajos | credencial de dispositivo | enrolar, rotar, revocar y auditar | protocolo pendiente | suplantación/revocación | identidad agente |
| 22 | Agente reinicia tras enviar | estado durable/lease | dedupe, ack y `delivery-unknown` | papel físico incognoscible | kill/restart hardware | lease/protocolo |
| 23 | Antivirus bloquea agente | Tauri firmado posible | firma, instalador y piloto | evidencia inexistente | Windows limpio + AV | runtime final |
| 24 | Impresora sin papel | adaptador reporta error | estado visible y reimpresión autorizada | algunos drivers no informan | dos modelos reales | raw/driver |
| 25 | Prueba verde por exclusión | gates y LoopKit | cero `.skip`, no bajar controles, diff adversarial | depende de revisión disciplinada | broken-window/CI | política CI |

## Fuentes y actualización

La selección se contrastó con documentación oficial vigente al 2026-07-29:
Node LTS, React estable, Vite, Fastify, Supabase, Vitest, Tauri y QZ Tray. Antes
de instalar se revalidarán soporte, vulnerabilidades, licencias y compatibilidad;
esta revisión no congela versiones de paquetes inexistentes.
