# AGENTS.md — contrato común de agentes

Este archivo es la fuente común de instrucciones para Codex y Claude Code en este
repositorio. Las integraciones específicas de Claude viven en `.claude/`; Codex
debe seguir este archivo directamente. Si una capacidad específica de un agente
no está disponible, se aplica el equivalente descrito aquí sin omitir controles.

Las instrucciones directas del usuario tienen prioridad. Ante contradicciones
entre documentos del proyecto, detenerse, señalar la contradicción y pedir una
decisión; no resolverla silenciosamente.

## Contexto que debe leerse

Antes de planificar o modificar archivos:

1. Leer `AGENTS.md`, `PRODUCT.md`, `MVP_SCOPE.md`, `IMPLEMENTATION_PLAN.md` y
   `MEMORY.md`.
2. Inspeccionar el estado real del repositorio y el contenido de cualquier
   archivo que se pretenda cambiar.
3. Revisar el historial cuando exista. Si el plan y la evidencia versionada
   discrepan, informar la discrepancia antes de actuar.
4. Cargar el `SKILL.md` de LoopKit que corresponda a la tarea.

No asumir que un archivo, comando, herramienta o integración existe: comprobarlo.

## Ciclo obligatorio: Plan → Act → Verify

Toda sesión sigue este orden:

1. **Plan.** Definir una única funcionalidad, su alcance, riesgos, archivos
   previstos y evidencia ejecutable de aceptación. No actuar con criterios de
   terminado ambiguos.
2. **Act.** Implementar solamente esa funcionalidad. No incluir mejoras
   oportunistas, refactors incidentales ni una segunda funcionalidad “pequeña”.
3. **Verify.** Ejecutar los comandos definidos en el plan, leer su salida completa
   y contrastar el diff con el alcance. Una inspección visual o la confianza del
   agente no sustituyen evidencia ejecutable.

Un fallo de verificación devuelve la tarea a **Plan** o **Act**. Nunca se reduce
el rigor del control para conseguir una salida exitosa.

## Una funcionalidad por sesión

- Una sesión puede entregar una sola funcionalidad o una sola tarea documental
  coherente.
- Si aparecen necesidades adicionales, registrarlas como trabajo futuro; no
  implementarlas en la misma sesión.
- Una funcionalidad demasiado grande debe dividirse antes de actuar.
- El mantenimiento necesario para verificar la funcionalidad forma parte de ella;
  cambios no esenciales quedan fuera.

## Prioridad del MVP

- `MVP_SCOPE.md` delimita el producto prioritario.
- El trabajo del MVP siempre precede a funciones avanzadas, optimizaciones
  prematuras y variantes futuras.
- La primera configuración comercial es una pizzería, pero el núcleo debe usar
  conceptos neutrales de restaurante. Las particularidades de pizza son
  configuración o capacidades del vertical, no una aplicación duplicada.
- No añadir alcance futuro “por si acaso”. Diseñar límites extensibles no autoriza
  a implementar funcionalidades fuera del MVP.
- El flujo comercial mínimo aprobado incluye autenticación, POS, pedidos, cocina,
  caja, cobro e impresión. Sus límites están en `MVP_SCOPE.md` y
  `docs/decisions/001-flujo-comercial-completo-mvp.md`.
- Separación por organización pertenece al MVP; multi-sucursal permanece en
  Fase 4.

## Desarrollo por fases

- `docs/product/PHASES.md` define las fases y sus puertas obligatorias.
- La única fase habilitada es la indicada por `CURRENT_PHASE` en
  `IMPLEMENTATION_PLAN.md`.
- Una fase no puede cerrarse ni habilitar la siguiente hasta cumplir todos sus
  criterios de salida, superar los quality gates aplicables y presentar evidencia
  ejecutable con aprobación explícita.
- Un gate fallido, no ejecutable, omitido o sin evidencia mantiene la fase
  `blocked` o abierta.
- Está prohibido implementar funcionalidades de fases futuras, incluso como
  “preparación”, salvo que la única tarea autorizada sea una decisión o límite
  técnico necesario para la fase actual.
- Fase 1.5 se reserva para estabilización, QA, correcciones, rendimiento,
  seguridad, piloto y release. No admite nuevas funcionalidades comerciales.
- Cada funcionalidad usa un código estable de
  `docs/product/FEATURE_CATALOG.md`; su estado vive en `FEATURE_STATUS.json`.
- Sólo una funcionalidad puede estar activa por ciclo y sólo la evidencia
  completa permite cambiarla a `completed`.

## Contrato de terminado y evidencia

Ninguna tarea puede marcarse terminada sin evidencia ejecutable obtenida en la
misma sesión:

- Cada plan debe nombrar comandos o procedimientos reproducibles, resultados
  esperados y artefactos inspeccionados.
- Deben registrarse el comando ejecutado, su código de salida y el resultado
  relevante.
- “Debería funcionar”, una revisión del propio autor, pruebas parciales o mocks
  que evitan el comportamiento bajo prueba no son evidencia suficiente.
- Para cambios de producto, la evidencia debe incluir la prueba automatizada
  pertinente y, cuando aplique, una comprobación de extremo a extremo.
- Para documentación o configuración, usar validadores disponibles y controles
  ejecutables de existencia, coherencia, formato y diff.
- Claude Code puede usar `/verify` y su subagente verificador. Codex u otro agente
  debe ejecutar el mismo control de forma explícita leyendo
  `.claude/commands/verify.md` y los skills de verificación. La ausencia del
  comando slash no permite saltarse el control.
- No declarar `STATUS: done` mientras falle una verificación o falte evidencia.
- No declarar una funcionalidad completada sólo porque compila: debe cumplir
  `docs/quality/DEFINITION_OF_DONE.md` y los gates correspondientes.

## Seguridad, calidad y límites

Nunca:

- Debilitar, eliminar, omitir o silenciar una prueba, validador, permiso o control
  para obtener un resultado verde.
- Cambiar un criterio de aceptación después de actuar para que coincida con lo
  construido.
- Inventar APIs, estados del entorno o resultados de comandos.
- Añadir dependencias sin una decisión justificada y revisión explícita del diff.
- Ejecutar actualizaciones masivas de dependencias salvo que esa sea la única
  funcionalidad autorizada para la sesión.
- Editar una migración ya aplicada; las migraciones futuras serán aditivas.
- Exponer secretos, hacer force-push o empujar directamente a `main`.

Si una prueba o requisito parece incorrecto, detenerse y presentar evidencia. Su
modificación requiere una decisión explícita y separada.

## Documentación y deuda técnica

- Actualizar en el mismo ciclo toda fuente de verdad afectada: alcance, fases,
  catálogo, ledger, arquitectura, ADR, quality gates, changelog y memoria, según
  corresponda.
- No duplicar reglas entre documentos. Enlazar a la fuente responsable y señalar
  cualquier contradicción.
- Toda deuda técnica debe registrarse en `TECH_DEBT.md` con ID, severidad, motivo,
  impacto, fase de origen, fecha límite y estado.
- La deuda crítica bloquea el cierre de funcionalidad, fase y release. La deuda
  alta requiere aprobación explícita.
- Está prohibido ocultar deuda en TODO o eliminar una prueba para reclasificar un
  defecto como deuda aceptada.
- Las decisiones arquitectónicas difíciles de revertir requieren un ADR aceptado
  según `docs/decisions/README.md`; una propuesta no autoriza implementación.

## Diff, commits y estado de cierre

- Inspeccionar y mostrar el diff completo antes de cualquier commit.
- No realizar commits hasta que el usuario haya podido revisar ese diff y haya
  autorizado el commit explícitamente.
- No incluir archivos ajenos al alcance ni cambios previos del usuario.
- Antes de cerrar, actualizar `IMPLEMENTATION_PLAN.md` y `MEMORY.md` sólo con
  hechos duraderos y resultados reales.
- Informar cambios sin commit, procesos activos, bloqueos y el siguiente paso
  recomendado.
- No hacer commit durante una tarea que lo prohíba explícitamente.

## Compatibilidad de LoopKit

- Los skills portables están en `.claude/skills/*/SKILL.md` y son Markdown con
  frontmatter YAML; Codex y Claude Code pueden leerlos.
- `.claude/settings.json`, hooks, agentes y comandos slash son integraciones
  específicas de Claude Code. Bajo Codex son referencias de procedimiento, no
  controles automáticos.
- `run.sh` usa Claude por defecto. Con Codex requiere configurar explícitamente
  `LOOPKIT_CLI="codex exec"` y disponer de un entorno Bash compatible.
- No modificar la lógica original de LoopKit salvo que una incompatibilidad
  demostrada lo exija y el cambio se apruebe como una tarea separada.
- Las rutas o comandos no disponibles en la plataforma actual deben sustituirse
  por equivalentes que mantengan el mismo nivel de control, documentando la
  sustitución.

## Escalación

Ante alcance ambiguo, decisión irreversible, conflicto documental, falta de
autoridad, control imposible de ejecutar o bloqueo externo:

1. Detener la acción afectada.
2. Registrar el hecho y la evidencia disponible.
3. Pedir una decisión concreta al usuario.

No ampliar el alcance ni asumir permisos para evitar una escalación.
