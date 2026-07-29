# Reglas de sesión de caja

## Propiedad conceptual

La sesión representa un turno operativo de la `Organization`, no un navegador ni
un dispositivo. Conserva el usuario que abre y permite que otros owner/cashier
activos de la misma organización cobren; cada operación conserva su actor.
Existe como máximo una sesión `open` o `closing` por organización.

## Estados

| Estado | Significado | Operaciones |
|---|---|---|
| `open` | Turno habilitado | cobros, ingresos, retiros e inicio de cierre |
| `closing` | Conteo presentado; operaciones monetarias congeladas | autorizar diferencia, corregir conteo mediante nuevo intento o finalizar |
| `closed` | Cierre final e inmutable | sólo consulta y auditoría |

Transiciones: `open → closing → closed`. Owner o el cashier que abrió puede
iniciar cierre. Si se abandona un intento de cierre antes de finalizar,
`closing → open` exige owner o cajero que abrió y genera auditoría. `closed`
nunca se reabre.

## Apertura y movimientos

- owner o cashier puede abrir si no existe otra sesión activa;
- monto inicial es entero en centavos, mayor o igual a cero;
- browser cerrado, recarga o logout no cierran ni transfieren la sesión;
- todo pago se asocia a la sesión; no se cobra sin sesión `open`;
- un pago cash genera atómicamente su movimiento de venta inmutable;
- ingresos y retiros manuales usan importes positivos y una dirección;
- motivo es obligatorio;
- owner los registra directamente; cashier necesita una autorización de owner
  identificada y auditada;
- un retiro no puede hacer negativo el efectivo esperado.

## Cierre

- esperado = apertura + pagos en efectivo + ingresos - retiros;
- QR y transferencia se reportan por método pero no alteran efectivo esperado;
- contado es un importe no negativo presentado por el actor;
- diferencia = contado - esperado y puede ser positiva, cero o negativa;
- no se inicia/finaliza cierre con pedidos no cancelados sin completar o
  `PaymentAttempt.pending`;
- en `closing` no se aceptan cobros ni movimientos;
- diferencia cero: owner o cashier que abrió puede finalizar;
- diferencia no cero: requiere autorización explícita de owner; si owner cierra,
  su propia identidad constituye autorización;
- dos cierres concurrentes se serializan contra el estado autoritativo: sólo uno
  puede finalizar;
- sesión cerrada, movimientos, esperado, contado y diferencia son inmutables;
  cualquier ajuste futuro será un nuevo movimiento auditado en una sesión
  posterior, nunca edición retroactiva.
