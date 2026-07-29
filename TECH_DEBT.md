# Deuda técnica

## Reglas

- Toda deuda debe registrarse aquí; no se oculta en comentarios TODO.
- Deuda `critical` bloquea el cierre de funcionalidad, fase y release.
- Deuda `high` requiere aprobación explícita, responsable y fecha límite.
- Una prueba no puede eliminarse, debilitarse ni excluirse para convertir un
  defecto en deuda aceptada.
- Un defecto funcional no se reclasifica como deuda para evitar un quality gate.
- La deuda conserva su ID aunque se resuelva.
- Cada cierre de funcionalidad y fase revisa este registro.

## Severidades

- `critical`: riesgo inmediato de seguridad, integridad, operación o release;
- `high`: impacto material o probabilidad alta, requiere plan aprobado;
- `medium`: costo o riesgo controlado con fecha acordada;
- `low`: mejora mantenible sin impacto material actual.

## Estados

`identified | accepted | in-progress | blocked | resolved | rejected`

## Registro

No existe deuda técnica registrada: aún no hay implementación de producto. Las
decisiones pendientes pertenecen al plan o a ADR, no son deuda.

| ID | Descripción | Severidad | Motivo | Impacto | Fase de origen | Fecha límite | Estado |
|---|---|---|---|---|---|---|---|
| — | Sin deuda registrada | — | — | — | — | — | — |

## Alta de una deuda

Una entrada nueva debe:

1. usar un ID estable `TD-NNN`;
2. describir el atajo o limitación concreta;
3. justificar por qué no se resuelve en el ciclo actual;
4. indicar impacto y severidad;
5. registrar fase de origen y fecha límite;
6. identificar aprobación cuando sea `high`;
7. vincular criterios para considerarla resuelta.
