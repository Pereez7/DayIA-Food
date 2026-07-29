# Architecture Decision Records

## Propósito

Los Architecture Decision Records (ADR) conservan por qué se tomó una decisión
difícil de revertir. Complementan `SYSTEM_ARCHITECTURE.md`: la arquitectura puede
proponer opciones, pero sólo un ADR aprobado convierte una elección técnica en
decisión vigente.

Las decisiones de alcance y dominio `ADR-0001` a `ADR-0004` están aceptadas.
Stack, persistencia física, mecanismos de autenticación, tiempo real, agente de
impresión, offline y tenancy siguen pendientes de ADR técnicos separados.

## Cuándo crear un ADR

Crear uno antes de adoptar o cambiar:

- framework, runtime o estructura principal;
- motor o modelo físico de datos;
- autenticación y autorización;
- protocolo entre fronteras;
- mecanismo de tiempo real;
- agente local de impresión;
- estrategia offline o de sincronización;
- tenancy y aislamiento;
- despliegue, observabilidad o seguridad difíciles de revertir.

No usar ADR para preferencias menores o para justificar a posteriori una decisión
ya implementada.

## Nombre y numeración

```text
docs/decisions/NNN-descripcion-breve.md
```

- numeración correlativa de tres dígitos;
- slug estable y descriptivo;
- no reutilizar números;
- un ADR reemplazado permanece en el repositorio con estado `superseded`.

## Formato

```markdown
# ADR NNN — Título

## Contexto

Restricciones y fuerza que exige la decisión.

## Decisión

Opción elegida. Mientras no esté aprobada, escribir “pendiente”.

## Alternativas

- Opción A: ventaja y costo.
- Opción B: ventaja y costo.

## Consecuencias

Qué facilita, qué dificulta, riesgos y obligaciones resultantes.

## Estado

proposed | accepted | rejected | superseded

## Fecha

YYYY-MM-DD
```

Puede agregarse “Reemplaza/Reemplazado por” cuando corresponda, sin eliminar las
secciones obligatorias.

## Ciclo de aprobación

1. Confirmar que la fase actual autoriza la decisión.
2. Reunir restricciones y alternativas reales.
3. Crear el ADR en `proposed`.
4. Revisar efectos sobre producto, seguridad, datos, operación y rollback.
5. Obtener aprobación explícita.
6. Cambiar a `accepted` antes de implementar.
7. Actualizar arquitectura, plan y memoria sólo con la decisión estable.

Un ADR rechazado o propuesto no autoriza dependencias ni código.

## Índice

| ADR | Título | Estado | Fecha |
|---|---|---|---|
| [ADR-0001](001-flujo-comercial-completo-mvp.md) | Incluir el flujo comercial completo en el MVP | accepted | 2026-07-28 |
| [ADR-0002](002-ciclo-comercial-del-pedido.md) | Ciclo comercial del pedido | accepted | 2026-07-29 |
| [ADR-0003](003-dinero-precios-y-numeracion.md) | Dinero, precios y numeración visible | accepted | 2026-07-29 |
| [ADR-0004](004-pago-y-turno-de-caja.md) | Pago único y turno de caja organizacional | accepted | 2026-07-29 |
