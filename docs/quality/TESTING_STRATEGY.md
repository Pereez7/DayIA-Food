# Estrategia de pruebas

## Objetivo

Obtener confianza proporcional al riesgo mediante pruebas complementarias,
evidencia reproducible y recorridos reales. Ninguna capa sustituye a todas las
demás.

No se fija un porcentaje global arbitrario de cobertura. La revisión se realiza
por comportamiento, criticidad, bordes y riesgo residual.

## Toolchain seleccionado

- Vitest para reglas y módulos TypeScript;
- React Testing Library para comportamiento accesible de componentes;
- Vitest contra Supabase local para integración de API;
- pgTAP para restricciones, funciones y políticas RLS;
- pruebas de contrato sobre Zod/OpenAPI y compatibilidad del agente;
- Playwright para recorridos E2E en navegadores objetivo;
- Lighthouse/Web Vitals y telemetría propia para rendimiento;
- Gitleaks, OSV-Scanner y auditoría de pnpm para seguridad de supply chain.

No están instalados. Su selección no cuenta como ejecución ni permite omitir un
gate.

## Pirámide de pruebas

1. **Unitarias:** muchas, rápidas y deterministas para reglas puras.
2. **Integración:** fronteras reales entre módulos, persistencia y adaptadores.
3. **Contratos:** compatibilidad entre productores, consumidores y agentes.
4. **E2E:** pocos recorridos críticos completos sobre un artefacto ejecutable.
5. **Pruebas especializadas:** seguridad, accesibilidad, rendimiento, resiliencia,
   migración, hardware y piloto según el riesgo.

El E2E prueba integración real; no debe convertirse en sustituto lento de reglas
que pertenecen a unitarias.

## Pruebas unitarias

Deben cubrir:

- reglas de opciones y selecciones;
- cantidades, precios, subtotales, totales y redondeo cuando se defina;
- estados y transiciones permitidas;
- idempotencia modelable de comandos;
- políticas de permisos;
- reglas de caja y pagos para el MVP;
- reglas de inventario y promociones cuando sus fases se habiliten;
- errores, límites y casos degenerados.

Los dominios de pedidos, importes, caja, pagos, permisos e inventario requieren
mayor profundidad por criticidad, no un porcentaje uniforme.

## Pruebas de integración

Deben cubrir:

- casos de uso contra persistencia real o una equivalencia justificada;
- restricciones, transacciones y concurrencia;
- aplicación web y backend a través de contratos públicos;
- actualización de estado y recuperación tras reconexión;
- colas y adaptadores externos;
- autorización en fronteras;
- migraciones y compatibilidad entre versiones cuando existan.

Mocks sólo se usan para aislar terceros o fallos difíciles; no pueden reemplazar
la frontera que la prueba afirma verificar.

## Flujos E2E

Como mínimo, una vez aprobados por alcance:

- recorrido vigente del MVP: login → caja → POS/pedido → cocina → cobro →
  impresión → cierre → logout;
- errores críticos de producto no disponible y transición inválida;
- inicio de sesión, cierre y rechazo por rol u organización;
- apertura → movimientos → cobro → arqueo → cierre de caja;
- envío, actualización e impresión en cocina;
- impresión de caja sin duplicar cobro;
- conexión inestable, reconexión y ausencia de duplicados;
- reconciliación y existencias críticas en Fase 2;
- aislamiento entre organizaciones desde el MVP;
- aislamiento entre sucursales cuando multi-sucursal se habilite en Fase 4.

Cada E2E debe documentar datos iniciales, acciones, resultados y limpieza.

## Pruebas de contratos

Se requieren para:

- aplicación web ↔ backend;
- productor ↔ mecanismo de actualización en tiempo real;
- backend ↔ agente local de impresión;
- eventos o colas internas;
- integraciones externas de Fase 4.

Deben verificar forma, semántica, errores, compatibilidad, idempotencia y versión.
No se inventará un contrato hasta aprobar la frontera correspondiente.

## Pruebas de impresión

Son obligatorias para `PRINT-001`, `PRINT-002`, Fase 1.5 y el release del MVP:

- formato y contenido de trabajos;
- encolado, orden y prioridad;
- agente desconectado y reconexión;
- reintentos y confirmación perdida;
- deduplicación y reimpresión autorizada;
- reinicio del agente;
- impresora sin papel, apagada o con error;
- validación final con hardware real.

Una prueba mock no demuestra impresión física.

## Reconexión y duplicados

Para operaciones susceptibles a repetición:

- repetir la misma solicitud con igual identidad;
- perder la respuesta después de aceptar la operación;
- reconectar con mensajes retrasados o fuera de orden;
- reiniciar un participante;
- confirmar que el estado converge;
- comprobar que no aparecen pedidos, cobros o impresiones duplicados.

Los criterios varían por dominio y deben aprobarse antes de implementar modo
degradado.

## Permisos y seguridad

Probar:

- acción permitida para el rol y contexto correctos;
- denegación sin efecto lateral;
- acceso cruzado a otro contexto;
- propietario, cajero y cocina en acciones permitidas y denegadas;
- sesión ausente, expirada o revocada;
- modificación directa de identificadores;
- validación de entradas;
- ausencia de secretos en logs y respuestas.

El caso negativo es obligatorio; demostrar acceso permitido no prueba
autorización.

## Pruebas de caja y cobro

Cubrir:

- apertura única y monto inicial;
- venta y movimientos manuales con motivo;
- efectivo, QR manual y transferencia;
- cálculo de cambio;
- cobro repetido o respuesta perdida;
- esperado, contado y diferencia;
- cierre con operaciones pendientes o usuario sin permiso;
- consistencia entre pedido, cobro y sesión de caja.

Pago mixto no se prueba como capacidad incluida: ADR-0004 lo dejó
`excluded-from-mvp`.

## Regresión

Todo defecto corregido debe:

1. reproducirse;
2. contar con una prueba que falle por la causa observada;
3. pasar después de la corrección;
4. ejecutarse dentro de la suite pertinente;
5. preservar el criterio original sin debilitarlo.

Los E2E críticos se ejecutan en gates de fase y release, no sólo en la sesión que
los creó.

## Datos y entornos

- datos de prueba deterministas y sin información sensible;
- aislamiento entre ejecuciones;
- reloj, aleatoriedad y terceros controlados cuando afecten determinismo;
- entornos representativos para migración, red, observabilidad y hardware;
- limpieza verificable sin ocultar residuos que afectarían la siguiente prueba.

## Evidencia requerida

Por ejecución:

- commit o estado exacto probado;
- comando completo;
- entorno;
- casos ejecutados, aprobados, fallidos y omitidos;
- código de salida;
- duración y artefactos;
- fallos investigados;
- revisión humana cuando la prueba sea manual.

Una prueba omitida debe justificar por qué no aplica; “todavía no configurada”
bloquea el gate correspondiente.

## Comandos contractuales futuros

| Suite | Comando |
|---|---|
| Unitarias | `pnpm test:unit` |
| Integración | `pnpm test:integration` |
| Contratos | `pnpm test:contract` |
| E2E | `pnpm test:e2e` |
| Completa | `pnpm test` |

Cada script se implementará al inicializar la toolchain. Hasta entonces su estado
es `blocked`, no `pass`.

## Cobertura y flakiness

Se exige cobertura de invariantes y ramas de riesgo, no un porcentaje global
decorativo. El reporte V8 se conserva y cada módulo crítico puede tener un umbral
justificado. Una prueba flaky es una prueba rota: se investiga o bloquea; no se
silencia con reintentos, `.skip` o reducción de assertions.

## CI futura

GitHub Actions ejecutará typecheck, lint, format, unitarias, integración,
contratos, E2E crítico, build, secretos y dependencias. Las acciones se fijan por
SHA, los permisos son mínimos y ningún pull request puede declarar terminado un
scope con checks omitidos.
