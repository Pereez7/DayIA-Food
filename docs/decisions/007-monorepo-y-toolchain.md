# ADR 007 — Monorepo y toolchain de calidad

## Contexto

Web, API, agente y contratos cambian coordinadamente. El equipo asistido por
agentes necesita comandos predecibles, dependencias controladas y evidencia
reproducible sin infraestructura prematura.

## Decisión

Adoptar pnpm workspaces con un lockfile y las fronteras `apps/web`, `apps/api`,
`apps/print-agent`, `packages/domain`, `packages/contracts`, `packages/config`,
`supabase` y `tests/e2e`. La estructura se creará en otra sesión.

Adoptar TypeScript estricto, ESLint, Prettier, Vitest, Testing Library,
Playwright, pgTAP, Gitleaks, OSV-Scanner y GitHub Actions. No usar orquestador de
monorepo inicialmente. Los comandos contractuales viven en
`QUALITY_GATES.md`.

## Alternativas

- npm workspaces: menos herramienta, con menor aislamiento y ergonomía pnpm.
- repos separados: autonomía, pero drift y cambios de contrato multi-repo.
- Nx/Turborepo: caché avanzada sin evidencia de que el tamaño actual la necesite.
- Jest/Cypress: maduros, pero Vitest/Vite comparten pipeline y Playwright cubre
  navegadores/recorridos con una herramienta.

## Consecuencias

CI podrá crecer con el repositorio; se optimizará sólo con medición. Cada
dependencia requiere licencia/advisory, lockfile y auditoría. Seleccionar
herramientas no significa que estén instaladas ni que sus gates pasen.

## Estado

accepted

## Fecha

2026-07-29
