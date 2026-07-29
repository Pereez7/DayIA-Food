# Fases del producto

## Propósito

Este documento define el orden de desarrollo de DAYIA FOOD y el contrato que
impide comenzar una fase con problemas no resueltos de la anterior. El alcance
vigente del MVP sigue siendo el de [`MVP_SCOPE.md`](../../MVP_SCOPE.md).

Una fase sólo puede cerrarse cuando todos sus criterios de salida tienen evidencia
ejecutable, los quality gates aplicables están aprobados y existe autorización
explícita para habilitar la siguiente. El tiempo transcurrido, una demostración
parcial o la compilación exitosa no sustituyen esa puerta.

## Estados y bloqueo entre fases

Estados permitidos para una fase:

- `not-started`: todavía no se ha autorizado trabajo de la fase;
- `in-progress`: existe una funcionalidad autorizada en curso;
- `verifying`: se están reuniendo y revisando evidencias de salida;
- `blocked`: un criterio, defecto o decisión impide avanzar;
- `completed`: todos los criterios fueron demostrados y aprobados.

Sólo `completed`, acompañado por una aprobación explícita registrada, habilita la
fase siguiente. La aprobación no convierte automáticamente en terminadas las
funcionalidades que aún no tengan evidencia propia.

## Fase 0 — Fundaciones técnicas

### Objetivo

Establecer contratos de producto, arquitectura propuesta, disciplina de calidad,
seguimiento y un entorno técnico verificable antes de implementar capacidades
comerciales.

### Incluye

- gobierno documental y trazabilidad de funcionalidades;
- vocabulario inicial del dominio;
- arquitectura propuesta y decisiones pendientes;
- estrategia de pruebas y quality gates;
- definición del entorno mínimo de desarrollo y verificación;
- criterios de aceptación de la primera funcionalidad del MVP.

### Excluye

- implementación de funcionalidades comerciales;
- ampliación del MVP;
- decisiones técnicas definitivas sin ADR aprobado;
- optimizaciones o infraestructura para fases futuras.

### Dependencias

- `PRODUCT.md` y `MVP_SCOPE.md` vigentes;
- responsables de producto y técnicos disponibles para aprobar decisiones;
- controles de LoopKit operativos o equivalentes documentados.

### Riesgos

- elegir tecnología antes de validar requisitos;
- confundir extensibilidad futura con alcance actual;
- dejar quality gates sin comandos ejecutables;
- aceptar documentos contradictorios como fuente de verdad.

### Criterios de entrada

- contrato Plan → Act → Verify adoptado;
- una sola funcionalidad documental autorizada;
- repositorio y archivos existentes inspeccionados.

### Criterios de salida

- arquitectura inicial revisada y aprobada mediante ADR cuando corresponda;
- catálogo y ledger de funcionalidades coherentes con el alcance aprobado;
- quality gates y estrategia de pruebas con responsables y evidencias definidos;
- stack y comandos mínimos decididos en sesiones separadas, con justificación;
- primera funcionalidad del MVP especificada con criterios ejecutables;
- cero defectos críticos, bloqueos sin resolver o deuda crítica;
- documentación y estado de fase actualizados.

### Evidencias necesarias

- validación automática de documentos y JSON;
- comandos reales de typecheck, lint, tests y build, una vez exista stack;
- ADR aprobados de decisiones técnicas;
- revisión de alcance contra `MVP_SCOPE.md`;
- checklist de release de fase firmado.

### Habilitación de Fase 1

Requiere todos los criterios de salida, `phase-0` en `completed`, registro de la
evidencia y aprobación explícita `phase-0-exit-review`. Mientras algún comando no
exista o no sea ejecutable, Fase 1 permanece bloqueada.

## Fase 1 — MVP comercial

### Objetivo

Entregar y validar el recorrido operativo definido en `MVP_SCOPE.md` para el
primer vertical de pizzería, manteniendo un núcleo neutral de restaurante.

### Incluye

- autenticación mínima, usuarios internos, roles iniciales y protección de rutas;
- separación de datos por organización, sin multi-sucursal;
- configuración básica del restaurante;
- catálogo esencial;
- POS y configuración mínima de pizzería;
- registro de pedidos, importes y observaciones;
- envío, vista y estados básicos de cocina;
- apertura, movimientos, arqueo y cierre de caja;
- cobro básico en efectivo, QR manual y transferencia;
- impresión básica en cocina y caja;
- resúmenes operativos estrictamente necesarios dentro de estos flujos.

Estas capacidades fueron aprobadas por
[`ADR-0001`](../decisions/001-flujo-comercial-completo-mvp.md). La aprobación de
alcance no selecciona tecnología ni habilita Fase 1 antes del cierre de Fase 0.

### Excluye

- inventario, recetas, compras y proveedores;
- ingredientes, mermas, mesas, delivery y promociones avanzadas;
- multi-sucursal e integraciones;
- registro público, login social, MFA, SSO y permisos configurables;
- división de cuenta, fidelización y venta multicanal avanzada;
- contabilidad, banca, pasarela online, facturación electrónica y crédito;
- pago mixto mientras no exista decisión posterior;
- impresión remota, múltiples estaciones y enrutamiento avanzado.

### Dependencias

- Fase 0 cerrada y aprobada;
- criterios de aceptación por funcionalidad;
- entorno de pruebas y observabilidad mínimo;
- decisiones de seguridad, aislamiento organizativo e impresión necesarias para
  el alcance aprobado.

### Riesgos

- dispersar reglas de pizzería dentro del núcleo;
- errores de totales o transiciones de pedido;
- inconsistencias o duplicados en caja, cobros e impresión;
- fuga de datos entre organizaciones;
- alcance comercial creciente sin aprobación;
- verificación parcial sin recorrido de extremo a extremo.

### Criterios de entrada

- evidencia y aprobación de cierre de Fase 0;
- primera funcionalidad en estado `specified`;
- ninguna deuda crítica o defecto alto no aceptado.

### Criterios de salida

- todas las capacidades aprobadas del MVP verificadas;
- E2E crítico del recorrido completo aprobado;
- separación entre organizaciones comprobada;
- caja, cobros e impresión reconciliables y trazables;
- seguridad, accesibilidad y rendimiento revisados contra sus presupuestos;
- cero defectos críticos y cero defectos altos sin aceptación explícita;
- documentación, changelog, ledger y deuda técnica actualizados;
- versión candidata disponible para estabilización, sin declarar v1.0.0.

### Evidencias necesarias

- resultados de unit, integration, contract y E2E según riesgo;
- pruebas de permisos, aislamiento, idempotencia, reconexión e impresión;
- build de producción reproducible;
- revisión adversarial del diff por funcionalidad;
- reporte de rendimiento contra baseline;
- matriz de criterios de aceptación y evidencias.

### Habilitación de Fase 1.5

Requiere cierre aprobado de Fase 1 y una candidata completa del alcance MVP.
Fase 1.5 no puede usarse para terminar funciones omitidas de Fase 1.

## Fase 1.5 — Estabilización, QA y piloto

### Objetivo

Estabilizar el MVP, ejecutar QA y piloto, corregir defectos, validar rendimiento,
seguridad y operación, y preparar la versión `v1.0.0`.

Fase 1.5 no admite nuevas funcionalidades comerciales.

### Incluye

- pruebas de regresión, resiliencia, seguridad, accesibilidad y rendimiento;
- corrección de defectos;
- endurecimiento operativo y observabilidad;
- validación con piloto y hardware real cuando corresponda;
- pruebas con conexión inestable y recuperación sin duplicados;
- preparación de rollback, soporte y release.

### Excluye

- **toda nueva funcionalidad comercial**;
- ampliaciones de alcance disfrazadas de correcciones;
- trabajo de Fase 2 o posteriores.

### Dependencias

- Fase 1 cerrada con alcance completo;
- entorno representativo de piloto;
- criterios de severidad y procedimiento de incidentes.

### Riesgos

- introducir funciones nuevas durante estabilización;
- cerrar defectos sin reproducirlos y verificar regresión;
- validar impresión o operación sólo con mocks;
- publicar sin rollback comprobado.

### Criterios de entrada

- Fase 1 en `completed`;
- candidata del MVP desplegable;
- backlog de defectos y deuda clasificado.

### Criterios de salida

- piloto aprobado;
- E2E críticos, regresión, seguridad y rendimiento aprobados;
- impresión validada con hardware real cuando aplique;
- conexión inestable, reconexión y duplicados verificados;
- cero defectos críticos o altos no aceptados;
- rollback, respaldo y recuperación revisados;
- documentación operativa y changelog listos;
- aprobación explícita para crear `v1.0.0`.

### Evidencias necesarias

- informe del piloto;
- resultados completos de quality gates de release;
- registros de hardware, reconexión y recuperación cuando apliquen;
- aprobación humana de release.

### Habilitación de Fase 2

Requiere `v1.0.0` aprobada y publicada según el checklist. Si Fase 1.5 descubre una
función incompleta, se reabre la fase responsable; no se implementa como novedad.

## Fase 2 — Ingredientes, recetas, inventario, compras, proveedores y mermas

### Objetivo

Extender la operación con control de insumos y abastecimiento sobre el núcleo ya
estabilizado.

### Incluye

- inventario;
- ingredientes y unidades;
- recetas y consumo conceptual de insumos;
- compras;
- proveedores.
- mermas.

### Excluye

- mesas, delivery y promociones;
- multi-sucursal e integraciones externas no necesarias para esta fase.

### Dependencias

- Fase 1.5 cerrada;
- precisión y trazabilidad del núcleo comercial demostradas;
- decisiones de unidades, costos y auditoría aprobadas.

### Riesgos

- inconsistencias de unidades o existencias;
- cambios irreversibles sin estrategia de migración;
- acoplar recetas al vertical de pizzería.

### Criterios de entrada

- `v1.0.0` estable;
- ADR de los conceptos de inventario aprobados;
- criterios de reconciliación definidos.

### Criterios de salida

- funcionalidades de fase verificadas por riesgo;
- reconciliación y permisos aprobados;
- migraciones, respaldo y recuperación comprobados;
- deuda y documentación actualizadas;
- cero defectos críticos o altos no aceptados.

### Evidencias necesarias

- pruebas de consistencia, contratos, permisos y regresión;
- simulaciones de fallo y recuperación;
- checklist de release de fase.

### Habilitación de Fase 3

Requiere cierre y aprobación explícita de Fase 2.

## Fase 3 — Mesas, delivery, promociones y operación avanzada

### Objetivo

Ampliar los canales y herramientas operativas sin romper el recorrido comercial
estable.

### Incluye

- mesas;
- delivery;
- promociones;
- operación avanzada aprobada para la fase.

### Excluye

- multi-sucursal;
- integraciones de Fase 4;
- nuevos verticales no aprobados.

### Dependencias

- Fase 2 cerrada;
- reglas de pedidos, precios e inventario estables;
- análisis de seguridad y concurrencia.

### Riesgos

- conflictos entre canales;
- promociones que alteren totales de forma inconsistente;
- degradación de rendimiento operacional.

### Criterios de entrada

- evidencia de cierre de Fase 2;
- alcance de canales aprobado;
- baseline de rendimiento vigente.

### Criterios de salida

- flujos multicanal y regresión crítica aprobados;
- reglas de precios y permisos verificadas;
- presupuestos de rendimiento cumplidos o excepción aprobada;
- cero defectos críticos o altos no aceptados.

### Evidencias necesarias

- E2E por canal;
- pruebas de concurrencia, contratos y rendimiento;
- revisión de seguridad, accesibilidad y deuda.

### Habilitación de Fase 4

Requiere cierre y aprobación explícita de Fase 3.

## Fase 4 — Multi-sucursal e integraciones

### Objetivo

Habilitar operación por múltiples sucursales e integraciones externas manteniendo
aislamiento, trazabilidad y operación segura.

### Incluye

- organizaciones y múltiples sucursales;
- aislamiento y administración entre sucursales;
- integraciones explícitamente aprobadas;
- observabilidad y soporte acordes a la nueva escala.

### Excluye

- integraciones especulativas;
- nuevos verticales sin proceso de alcance;
- cambios de arquitectura no respaldados por ADR.

### Dependencias

- Fase 3 cerrada;
- modelo de aislamiento aprobado;
- contratos, seguridad y límites operativos de cada integración definidos.

### Riesgos

- fuga de datos entre organizaciones;
- fallos parciales de terceros;
- complejidad de sincronización y recuperación.

### Criterios de entrada

- evidencia de cierre de Fase 3;
- ADR de tenancy e integraciones aprobados;
- estrategia de migración y rollback revisada.

### Criterios de salida

- aislamiento demostrado;
- contratos y fallos parciales probados;
- observabilidad, seguridad, recuperación y rendimiento aprobados;
- documentación operativa completa;
- cero defectos críticos o altos no aceptados.

### Evidencias necesarias

- pruebas de aislamiento y permisos;
- pruebas contractuales y de resiliencia;
- simulaciones de rollback y recuperación;
- checklist de release y aprobación explícita.

### Condición posterior

El cierre de Fase 4 no autoriza automáticamente nuevos verticales o integraciones.
Cada ampliación vuelve a Plan y requiere alcance, fase y evidencia propios.
