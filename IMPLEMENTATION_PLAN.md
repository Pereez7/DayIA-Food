STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: stack-review
CURRENT_FEATURE: phase-0-stack-review
NEXT_GATE: phase-0-data-and-auth-review
FEATURE_CATALOG_ID: CORE-001

# Plan de implementación

## Objetivo del ciclo

Resolver documentalmente la dirección tecnológica inicial del MVP sin iniciar
implementación. La sesión revisa `CORE-001`; no completa esa funcionalidad, no
habilita Fase 1 y no incorpora una segunda funcionalidad.

## Resultado de revisión

Veredicto documental: `approved-with-actions`.

Se acepta la dirección general del stack. El agente de impresión, la sesión de
autenticación y el proveedor final de alojamiento conservan pruebas o decisiones
pendientes. La aprobación no autoriza instalar dependencias ni crear código.

## Stack recomendado

- web SPA: React 19 + TypeScript + Vite, React Router, TanStack Query, React Hook
  Form, Zod, CSS Modules, tokens CSS y Lucide;
- estado: TanStack Query para servidor, React para estado local/derivado y
  Zustand sólo para borradores efímeros entre rutas;
- backend: Node.js 24 LTS + TypeScript + Fastify como API autoritativa;
- datos/plataforma: PostgreSQL, Auth y Realtime administrados por Supabase;
- acceso a datos: SQL parametrizado con `pg`, repositorios explícitos,
  transacciones, restricciones y migraciones SQL futuras;
- contratos: Zod como esquema runtime compartido y OpenAPI generado;
- repositorio: monorepo con pnpm workspaces, sin orquestador adicional;
- calidad futura: TypeScript, ESLint, Prettier, Vitest, Testing Library,
  Playwright, pgTAP, Gitleaks y OSV-Scanner;
- impresión: web separada de agente local; Tauri 2 es candidato `needs-spike`,
  QZ Tray es contingencia;
- despliegue: web estática, API contenedorizada, Supabase administrado y agente
  local; proveedor concreto diferido.

Las versiones exactas se fijarán al inicializar la toolchain usando releases
estables compatibles con Node 24 LTS y lockfile, no en esta sesión.

## Plan → Act → Verify

### Plan

- confirmar revisión de dominio comprometida y árbol inicial limpio;
- leer contrato, arquitectura, dominio, calidad, ADR y skills aplicables;
- evaluar alternativas contra MVP, seguridad, costo, portabilidad y operación.

### Act

- registrar matrices y ADR técnicos;
- actualizar arquitectura, repositorio, despliegue, seguridad e impresión;
- concretar estrategia de pruebas, gates y presupuesto provisional;
- registrar 25 escenarios adversariales, riesgos y decisiones `needs-spike`;
- actualizar ledger, producto, memoria y changelog coordinadamente.

### Verify

La evidencia debe probar:

1. matrices con alternativas, criterios, pros, contras, riesgos, costo,
   recomendación y estado;
2. ADR-0005 a ADR-0008 coherentes con la arquitectura;
3. 25 escenarios adversariales completos;
4. JSON válido, enlaces locales resolubles y diff sin errores de whitespace;
5. cero código, manifests, dependencias, SQL, CI o infraestructura;
6. cero secretos y cero controles debilitados;
7. Fase 1 bloqueada, cero funcionalidades `completed`, sin staging ni commit;
8. revisión adversarial y validadores LoopKit con evidencia fresca.

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | Stack revisado; datos/autenticación y spikes siguen pendientes |
| Fase 1 | blocked | Fase 0 no cumple todavía todos sus criterios de salida |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Decisiones registradas

- ADR-0005: stack web, estado, estilos y contratos.
- ADR-0006: API TypeScript autoritativa sobre Supabase/PostgreSQL/Auth/Realtime.
- ADR-0007: monorepo pnpm y toolchain de calidad.
- ADR-0008: agente de impresión separado; Tauri condicionado a spike.

## Acciones y bloqueos restantes de Fase 0

- diseñar modelo físico, migraciones, RLS y pruebas de aislamiento;
- fijar sesión, renovación, revocación y credenciales de dispositivo;
- ejecutar spike del agente Tauri con Windows e impresoras reales;
- escoger proveedor/región/plan con medición de costo, respaldo y recuperación;
- convertir presupuestos provisionales en baselines ejecutados;
- inicializar toolchain sólo en una futura sesión expresamente autorizada.

## Evidencia del ciclo

| Control | Comando/procedimiento ejecutado | Resultado |
|---|---|---|
| Precondición | `git status`, `git log -3 --oneline`, `git branch --show-current` | árbol inicial limpio; dominio en `03a4b56`; `main` |
| JSON/fases | parsear `FEATURE_STATUS.json` y afirmar ledger/fase | PASS: 0 completed, 13 de Fase 1 bloqueadas, siguiente gate correcto |
| Enlaces | resolver referencias Markdown locales de forma recursiva | PASS: 106 archivos, 0 enlaces rotos |
| Stack/adversarial | afirmar tabla numerada y campos | PASS: 25/25 escenarios |
| LoopKit skills | validar `SKILL.md`, delimitadores, name y description | PASS: 53/53 |
| LoopKit runner | `C:\Program Files\Git\bin\bash.exe -n run.sh` | PASS, código 0 |
| Alcance/seguridad | buscar manifests, lockfiles, código, secretos y staging | PASS: 0 artefactos, 0 secretos, 0 staged |
| Whitespace | `git diff --check` | PASS, código 0 |
| Red flags | revisar añadidos por skip/only/no-verify/silenciado/fake done | PASS: menciones de `.skip` son prohibiciones documentales; 0 atajos |

Evidencia fresca: 2026-07-29T12:54:36-04:00. El `bash` de WSL no estaba
disponible (`/bin/bash` ausente); se ejecutó el mismo validador con Git Bash.

Typecheck, lint, tests y build de aplicación siguen `blocked`: no existe todavía
toolchain ni código y no se falseó su ejecución. Staging, commit y push: 0.

## Siguiente paso recomendado — no ejecutar

Ejecutar una única sesión `phase-0-data-and-auth-review` para definir el modelo
físico PostgreSQL, migraciones, RLS, Auth, sesiones, secretos y pruebas de
aislamiento, sin iniciar la implementación del MVP.
