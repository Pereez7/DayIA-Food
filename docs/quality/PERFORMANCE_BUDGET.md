# Presupuesto de rendimiento

## Estado

Los presupuestos son **provisionales y pendientes de baseline medible**. Se fijan
objetivos iniciales para detectar regresiones, pero no se declaran aprobados: no
existen todavía aplicación, entorno ni tráfico representativo.

Fase 0 debe definir el procedimiento de medición. La primera implementación
ejecutable debe producir un baseline. Sólo después podrán aprobarse umbrales
numéricos con contexto de dispositivo, red, carga y percentil.

## Principios

- medir recorridos de usuario, no sólo funciones aisladas;
- registrar distribución y percentiles, no únicamente promedios;
- separar tiempo del cliente, red, backend, persistencia y terceros;
- evaluar condiciones normales y conexión lenta;
- evitar que una optimización comprometa consistencia o seguridad;
- tratar una regresión significativa como gate fallido hasta analizarla.

## Categorías iniciales

| Categoría | Inicio de medición | Contexto mínimo | Presupuesto provisional |
|---|---|---|---|
| Carga inicial | Primera versión navegable | móvil medio, 4G y desktop POS | LCP p75 ≤ 2.5 s; INP ≤ 200 ms; CLS ≤ 0.1 |
| Respuesta del punto de venta | Primera acción operativa ejecutable | catálogo representativo | interacción local p95 ≤ 100 ms |
| Agregar productos | `ORDER-001` ejecutable | pedido con modificadores | p95 ≤ 100 ms local |
| Confirmar pedido | persistencia real | red normal y API | p95 ≤ 1 s sin impresión |
| API | primer caso de uso real | carga normal acordada | lectura p95 ≤ 500 ms; comando p95 ≤ 800 ms |
| Actualización de cocina | `KITCHEN-001` ejecutable | dos clientes y transporte real | aviso p95 ≤ 2 s; convergencia fallback ≤ 10 s |
| Cola de impresión | agente/spike real | agente y hardware identificados | claim online ≤ 5 s; envío a OS ≤ 3 s tras claim |
| Tamaño de recursos | primer build | Brotli/gzip y caché | JS inicial gzip ≤ 250 KiB; transferencia inicial ≤ 500 KiB |
| Consultas de base de datos | persistencia aprobada | datos/plan representativos | dentro del presupuesto del caso de uso |
| Conexión lenta | primer recorrido E2E | slow 4G reproducible | shell utilizable ≤ 5 s y feedback inmediato |

Son objetivos de diseño, no evidencia. Si el baseline demuestra que un número no
representa la necesidad del usuario, se cambia mediante revisión explícita, no
para ocultar una regresión.

## Protocolo de baseline

1. Identificar versión y entorno.
2. Definir datos, dispositivo, red y concurrencia.
3. Preparar un recorrido reproducible.
4. Ejecutar suficientes repeticiones para observar variación.
5. Registrar distribución, errores y recursos.
6. Identificar cuello de botella sin modificar criterios funcionales.
7. Proponer umbral y justificarlo contra necesidad de usuario.
8. Aprobar el presupuesto y registrar fecha.

## Condiciones lentas y fallos

Evaluar:

- feedback mientras una operación está pendiente;
- timeout explícito y recuperable;
- reintento idempotente;
- reconexión y convergencia;
- ausencia de duplicados;
- uso de recursos y tamaño transferido;
- pérdida parcial de tiempo real o impresión.

No se afirmará soporte offline o degradado sólo porque una vista permanezca
abierta.

## Gate de cambio

Una funcionalidad que afecta una categoría debe:

- ejecutar el mismo protocolo antes y después;
- reportar diferencia y variabilidad;
- explicar toda regresión;
- cumplir el presupuesto aprobado o registrar una excepción temporal;
- actualizar el baseline únicamente con aprobación, nunca para ocultar regresión.

Deuda de rendimiento crítica bloquea fase. Una excepción alta requiere registro
en `TECH_DEBT.md`, responsable, impacto y fecha límite.

## Decisiones pendientes

- dispositivo POS y móvil de referencia;
- perfiles exactos de red y concurrencia;
- datos y concurrencia representativos;
- límites CPU/memoria/instalador del agente tras spike;
- retención de resultados y tendencia;
- criterios diferenciados para piloto y producción.

## Instrumentación prevista

- Web Vitals y Lighthouse para carga/interacción/layout;
- Playwright para recorridos y perfiles de red;
- análisis de artefactos Vite para tamaño;
- temporización Pino/Sentry y métricas del host para API;
- `EXPLAIN (ANALYZE, BUFFERS)` sobre datos representativos para consultas;
- medición Windows de CPU, memoria, disco y tiempos del agente.

La medición física de salida de papel se separa de `submitted-to-os`.
