# Presupuesto de rendimiento

## Estado

Los presupuestos son **provisionales y pendientes de baseline medible**. En esta
etapa no existen aplicación, entorno ni tráfico representativo; por tanto, fijar
números definitivos sería inventar precisión.

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
| Carga inicial | Primera versión navegable | Dispositivo y red definidos | Baseline + umbral aprobado |
| Respuesta del punto de venta | Primera acción operativa ejecutable | Catálogo y carga representativos | Baseline + umbral aprobado |
| Agregar productos | `ORDER-001` ejecutable | Pedido y personalización representativos | Baseline + umbral aprobado |
| Confirmar pedido | Confirmación disponible | Persistencia y validaciones reales | Baseline + umbral aprobado |
| Actualización de cocina | `KITCHEN-001` ejecutable | Dos clientes y transporte real | Baseline + umbral aprobado |
| Cola de impresión | Primera versión ejecutable de `PRINT-001` | Agente y hardware identificados | Baseline + umbral aprobado |
| Tamaño de recursos | Primer build de producción | Compresión y caché definidas | Baseline + límite por recurso aprobado |
| Consultas de base de datos | Persistencia aprobada | Datos y plan representativos | Baseline + límites por recorrido |
| Conexión lenta | Primer recorrido E2E | Perfil de red reproducible | Degradación y feedback aprobados |

Ninguna fila se considera aprobada mientras conserve “baseline + umbral
aprobado”.

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

- entornos y dispositivos de referencia;
- perfiles de red;
- datos y concurrencia representativos;
- herramientas de medición;
- percentiles y umbrales por categoría;
- retención de resultados y tendencia;
- criterios diferenciados para piloto y producción.
