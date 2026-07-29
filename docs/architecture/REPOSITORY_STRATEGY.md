# Estrategia de repositorio

## Decisión

Usar un monorepo con pnpm workspaces y un único lockfile. No adoptar Nx, Turborepo
ni otro orquestador hasta que tiempos medidos de CI o build lo justifiquen.

## Estructura lógica futura

```text
apps/
  web/
  api/
  print-agent/
packages/
  domain/
  contracts/
  config/
supabase/
  migrations/
  tests/
tests/
  e2e/
docs/
```

La estructura es descriptiva: ninguna de estas carpetas se crea en esta sesión.

## Fronteras

- `domain`: reglas puras sin frameworks, IO ni detalles de plataforma;
- `contracts`: esquemas runtime, eventos y compatibilidad pública;
- `web`: presentación y cliente de API;
- `api`: casos de uso, autorización y adaptadores;
- `print-agent`: reclamación y ejecución local de trabajos;
- `supabase`: migraciones, políticas y pruebas de persistencia;
- `config`: configuración compartida de herramientas, no secretos.

No hay importaciones de `apps` hacia otras `apps`; la comunicación cruza
contratos públicos. `domain` no depende de `contracts` de transporte.

## Alternativas

| Opción | Pros | Contras/riesgos | Costo | Estado |
|---|---|---|---|---|
| pnpm workspaces | instalación estricta, cambios atómicos, contratos próximos | herramienta adicional, CI único puede crecer | bajo inicial | accepted |
| npm workspaces | menos herramienta específica | menor control del grafo y almacenamiento | bajo | rejected |
| repos separados | despliegue y permisos independientes | drift de contratos, PR coordinadas, más operación | alto para MVP | rejected |
| pnpm + Nx/Turbo | caché y grafo avanzados | configuración y superficie innecesarias hoy | medio | deferred |

## Versionado y releases

Web y API se despliegan independientemente desde el mismo commit. Los contratos
incluyen versión compatible; el agente debe tolerar una ventana de API definida
antes del piloto. Cambios incompatibles usan transición expand/contract.

## Reglas de gobierno

- una funcionalidad por sesión y diff acotado;
- dependencias sólo por necesidad aprobada y revisión de licencia/seguridad;
- lockfile obligatorio cuando exista toolchain;
- ownership humano para seguridad, datos e impresión;
- no publicar paquetes internos inicialmente;
- CI futura en GitHub Actions con permisos mínimos y acciones fijadas por SHA.

## Riesgos y reversibilidad

Un monorepo puede alargar CI y ampliar el checkout. Se mitiga con jobs por
frontera, caché verificada y, sólo con métricas, un orquestador. Separar un
servicio en otro repositorio sigue siendo posible porque los contratos son
explícitos; no se anticipa esa complejidad.
