STATUS: planning
CURRENT_PHASE: phase-0
PHASE_STATUS: domain-review
CURRENT_FEATURE: phase-0-domain-review
NEXT_GATE: phase-0-stack-review
FEATURE_CATALOG_ID: CORE-001

# Plan de implementación

## Objetivo del ciclo

Convertir los flujos aprobados del MVP en un contrato de dominio inequívoco:
entidades, estados, transiciones, invariantes, dinero, numeración, permisos,
cancelación, caja, pagos, impresión y auditoría. Es una revisión de `CORE-001`,
no una segunda funcionalidad ni autorización de Fase 1.

## Resultado de revisión

Veredicto documental: `approved`.

La aprobación resuelve el dominio del MVP, no cierra Fase 0, no completa
`CORE-001` y no autoriza implementación.

## Alcance autorizado

- definir conceptos y reglas comprobables sin convertirlos en tablas;
- aceptar ADR de decisiones de dominio difíciles de revertir;
- actualizar arquitectura lógica y flujos afectados;
- mantener servidor/persistencia como autoridad;
- conservar una sola funcionalidad activa y cero `completed`.

## Fuera de alcance

- código, dependencias, stack, SQL, migraciones o infraestructura;
- frameworks de aplicación, componentes, pantallas o diseño de interfaz;
- inventario, mesas, delivery avanzado, promociones o multi-sucursal;
- offline-first, reversos, devoluciones, conciliación bancaria y pago mixto;
- staging, commit o push.

## Plan → Act → Verify

### Plan

- leer íntegramente fuentes, quality gates y skills aplicables;
- confirmar que arquitectura está versionada y el árbol parte limpio;
- fijar contrato de sesión en `PROMPT.md`.

### Act

- definir modelo conceptual y nueve contratos canónicos bajo `docs/domain/`;
- registrar ADR-0002 a ADR-0004;
- resolver contradicciones/pending de arquitectura y flujos;
- actualizar ledger, memoria y changelog de forma coordinada.

### Verify

La evidencia debe probar:

1. cinco estados persistidos y matriz completa con actor por transición;
2. cancelación y pedido pagado resueltos sin borrado;
3. un pago exitoso máximo, intentos e idempotencia;
4. pago mixto `excluded-from-mvp`;
5. caja por turno organizacional, cobros pendientes, cierre concurrente e
   inmutabilidad;
6. BOB en centavos enteros, sin float binario ni descuentos;
7. numeración diaria de servidor separada de ID e idempotencia;
8. matriz owner/cashier/kitchen y autorización secundaria;
9. impresión con certeza limitada y reimpresión auditada;
10. auditoría con campos mínimos y sin secretos;
11. los 25 escenarios adversariales completos;
12. JSON y enlaces válidos, diff limpio y revisión adversarial aprobada;
13. Fase 1 bloqueada, cero `completed` y cero artefactos técnicos;
14. ningún staging, commit o push.

## Estado de fases

| Fase | Estado | Motivo |
|---|---|---|
| Fase 0 | in-progress | Dominio aprobado; stack, ADR técnicos y toolchain pendientes |
| Fase 1 | blocked | Fase 0 no cumple todavía sus criterios de salida |
| Fase 1.5 | blocked | Fase 1 no está cerrada |
| Fase 2 | blocked | Fase 1.5 no está cerrada |
| Fase 3 | blocked | Fase 2 no está cerrada |
| Fase 4 | blocked | Fase 3 no está cerrada |

## Decisiones de dominio aceptadas

- ADR-0002: ciclo del pedido, inmutabilidad y cancelación.
- ADR-0003: centavos BOB, snapshots, sin descuentos y número diario servidor.
- ADR-0004: pago único, intentos, pago mixto excluido y turno de caja compartido.

## Bloqueos restantes de Fase 0

- stack, dependencias y comandos de quality gate;
- motor/modelo físico de datos, transacciones y migraciones;
- autenticación, sesiones, secretos y tenancy físico;
- transporte de tiempo real y publicación durable;
- protocolo, runtime, instalación y seguridad del agente de impresión;
- retención, respaldo, recuperación, baseline de rendimiento y hardware real.

## Evidencia del ciclo

| Control | Comando/procedimiento ejecutado | Salida |
|---|---|---|
| Precondición | `git log -1 --format="%h %s"` y `git status --short` antes de actuar | `3c9bebd docs: define MVP logical architecture`; limpio; códigos 0 |
| JSON/fases | PowerShell inline: `ConvertFrom-Json FEATURE_STATUS.json`; afirmar `completed=0`, 13 features de Fase 1 con blocker y `next_gate=phase-0-stack-review` | PASS, código 0 |
| Dominio | PowerShell inline: afirmar 12 docs/ADR, 5 estados, 5 filas de transición, 25 escenarios con 7 campos, pago mixto, centavos, permisos, impresión y auditoría | PASS, código 0, 2026-07-29T11:46:13-04:00 |
| Catálogo/enlaces | PowerShell inline: comparar los 26 IDs catálogo/ledger y resolver cada enlace Markdown local | 26/26; 0 rotos; código 0 |
| LoopKit | PowerShell inline: enumerar `.claude/skills/*/SKILL.md` y validar delimitadores, `name` y `description` | 53/53; código 0 |
| Alcance/seguridad | Escanear líneas añadidas y archivos nuevos por patrones de secretos, tecnologías nombradas, manifests y directorios técnicos | 0 secretos, 0 tecnologías, 0 dependencias/código; código 0, 2026-07-29T11:46:33-04:00 |
| Whitespace | `git diff --check` | código 0 |
| Staging | `git diff --cached --quiet` | código 0 |
| Adversarial | Procedimiento `.claude/commands/verify.md`: leer `PROMPT.md`, diff y untracked; aplicar 11 shortcuts y cuatro red flags con revisor frío | quinto pase `{"passes":true,"failures":[]}` |

- `FEATURE_STATUS.json` quedó con parse válido, 0 `completed`, 13
  funcionalidades de Fase 1 bloqueadas y ADR-0002 a ADR-0004 enlazados.
- Revisión adversarial fría 1: falló con 5 incoherencias; todas corregidas.
- Revisión adversarial fría 2: falló con 4 incoherencias; todas corregidas.
- Revisión adversarial fría 3:
  `{"passes":true,"failures":[]}`.
- Revisión adversarial fría 4: falló por contradicción de estado y evidencia sin
  comandos/códigos; ambos puntos fueron corregidos.
- Revisión adversarial fría 5:
  `{"passes":true,"failures":[]}`.
- `docs/checklists/red-flags.md` referenciado por `/verify` no existe; se usaron
  los cuatro red flags equivalentes de `broken-window-check` sin modificar
  LoopKit.
- Typecheck, lint, tests de aplicación y build: no aplican todavía porque no hay
  código, stack ni dependencias; continúan bloqueando el cierre de Fase 0.
- Staging, commit y push realizados: 0.

## Siguiente paso recomendado — no ejecutar

Si la verificación aprueba esta revisión, ejecutar una única sesión
`phase-0-stack-review` para comparar alternativas técnicas y proponer ADR sin
instalar dependencias ni iniciar Fase 1.
