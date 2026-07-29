# Contrato de sesión — phase-0-stack-review

## Objetivo

Seleccionar y justificar documentalmente el stack inicial de DAYIA FOOD, su
estrategia de repositorio, despliegue, seguridad, pruebas, rendimiento e
impresión, sin instalar ni inicializar tecnología.

## Termina cuando

- las alternativas relevantes están comparadas con criterios, riesgos, costo y
  estado explícito;
- las decisiones aceptadas tienen ADR y las inciertas quedan `needs-spike`;
- existen 25 escenarios adversariales con mitigación, limitación y prueba futura;
- los documentos de arquitectura y calidad son coherentes con el dominio;
- validadores, enlaces, JSON, diff y revisión adversarial pasan con evidencia
  fresca;
- `IMPLEMENTATION_PLAN.md` conserva `STATUS: planning`, Fase 1 continúa bloqueada
  y ninguna funcionalidad queda `completed`.

## No tocar

- código de producto, manifests, dependencias, componentes, pantallas, SQL,
  migraciones, CI o infraestructura;
- reglas de dominio aprobadas o lógica original de LoopKit;
- staging, commits o remotos Git.

## Detenerse si

- la revisión de dominio no está comprometida o el árbol no parte limpio;
- una decisión incierta se intenta declarar probada sin un spike ejecutable;
- aparece un cambio ajeno al alcance;
- un control tendría que debilitarse para obtener un resultado verde.

## Ruta de verificación

Validación documental reproducible sobre el diff, parseo del ledger, resolución
de enlaces Markdown, revisión de ADR y matrices, búsqueda de artefactos técnicos
y secretos, validadores LoopKit y revisión adversarial independiente.
