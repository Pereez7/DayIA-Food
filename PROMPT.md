# Contrato de sesión — phase-0-domain-review

## Objetivo

Definir y verificar documentalmente las reglas de dominio definitivas del MVP de
DAYIA FOOD antes de seleccionar stack, diseñar SQL o iniciar implementación.

## Termina cuando

- los estados, transiciones e invariantes de pedidos, cobros, caja e impresión
  están explícitos y son coherentes;
- importes, precios, numeración, permisos y auditoría tienen reglas inequívocas;
- pago mixto tiene una decisión explícita de alcance;
- existen 25 escenarios adversariales con resultado, autorización, auditoría y
  prueba futura;
- el validador documental, JSON, enlaces, diff y revisión adversarial pasan con
  evidencia fresca;
- `FEATURE_STATUS.json` conserva cero funcionalidades `completed`, Fase 1
  bloqueada e `IMPLEMENTATION_PLAN.md` conserva `STATUS: planning`.

## No tocar

- código de producto, dependencias, componentes, pantallas, SQL, migraciones,
  infraestructura o selección de tecnologías;
- lógica original de LoopKit;
- estados de funcionalidades ajenas a `CORE-001`;
- staging, commits o remotos Git.

## Detenerse si

- la revisión de arquitectura deja de estar confirmada en `HEAD`;
- aparece un cambio ajeno al alcance;
- alguna decisión requiere elegir una tecnología;
- un control existente tendría que debilitarse para obtener un resultado verde.

## Ruta de verificación

Validación documental reproducible sobre el diff de Git, parseo de
`FEATURE_STATUS.json`, comprobación de enlaces, conteos de estados/fases,
búsqueda de artefactos técnicos y revisión adversarial independiente.
