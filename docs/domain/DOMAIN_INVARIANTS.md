# Invariantes y escenarios adversariales

## Invariantes canónicas

1. Toda autorización deriva organización y rol de una membresía activa.
2. Ningún identificador enviado por cliente concede acceso a otra organización.
3. Un pedido existe sólo tras confirmación válida, autoritativa e idempotente.
4. Pedido confirmado conserva líneas, precios y contenido históricos.
5. Cada transición pertenece a la matriz y tiene actor autorizado.
6. `completed` exige `ready`, pago exitoso y entrega.
7. Pedido pagado, completado o cancelado no se reabre ni se borra.
8. Máximo un pago exitoso por pedido; respuesta perdida se reconcilia por
   idempotencia.
9. Todo cobro pertenece a una caja `open` de la misma organización.
10. Máximo una caja `open` o `closing` por organización.
11. Caja cerrada es inmutable y no se reabre.
12. Todo dinero BOB usa centavos enteros; precisión adicional se rechaza.
13. Número visible se asigna en servidor y nunca se reutiliza.
14. Proyecciones, navegador, reloj cliente e impresión no son autoridad.
15. Reimpresión es explícita, motivada y auditada.
16. Toda acción sensible y todo rechazo material dejan auditoría sin secretos.

## 25 escenarios de refutación

| # | Escenario y regla | Resultado esperado | Autorización | Auditoría | Prueba futura | Pendiente |
|---:|---|---|---|---|---|---|
| 1 | Doble clic al confirmar; idempotencia | Un pedido y un número; misma respuesta | owner/cashier | una confirmación, repetición correlacionada | integración concurrente | ninguna |
| 2 | Confirmado con respuesta perdida | Reconsulta devuelve el mismo pedido | owner/cashier | confirmación única | integración con corte de respuesta | ninguna |
| 3 | Modificar tras imprimir cocina | Rechazo; snapshots y trabajo no cambian | nadie | `order-change-rejected` | contrato + integración | ninguna |
| 4 | Cancelar durante preparación | Motivo, pedido cancelado y cocina avisada | owner o cashier con autorización de owner | cancelación con actor y autorizador | autorización/transición | ninguna |
| 5 | Cancelar después del cobro | Rechazo; pago/caja intactos | nadie en MVP | `paid-order-cancel-rejected` | regla unitaria + integración | reversos futuros fuera del MVP |
| 6 | Cancelar después de entrega | Rechazo final | nadie | `completed-order-cancel-rejected` | transición negativa | ninguna |
| 7 | Dos cajeros cobran a la vez | Un `Payment`; otro recibe conflicto/dato existente | owner/cashier | éxito y doble pago rechazado | integración concurrente | ninguna |
| 8 | Cobro aprobado con respuesta perdida | Reconsulta del intento devuelve éxito; no reintenta | owner/cashier | pago único | integración con corte | ninguna |
| 9 | QR registrado dos veces | Misma clave repite resultado; otra clave choca con pago único | owner/cashier | éxito y rechazo duplicado | idempotencia + concurrencia | ninguna |
| 10 | Cerrar caja con cobro pendiente | Cierre rechazado; caja sigue `open` hasta resultado `succeeded` o `failed` | owner/cashier que abrió | `cash-close-rejected` | integración concurrente | ninguna |
| 11 | Dos usuarios cierran caja | Uno finaliza; otro observa `closed` y no muta | según matriz | cierre único y rechazo | integración concurrente | ninguna |
| 12 | Cobrar sin caja abierta | Rechazo sin Payment | owner/cashier no basta | `payment-rejected-no-open-cash` | integración negativa | ninguna |
| 13 | Diferencia negativa | Se calcula y conserva; cierre exige owner | owner autoriza | diferencia + autorización + cierre | regla y autorización | ninguna |
| 14 | Precio cambia tras confirmar | Pedido conserva snapshot; catálogo muestra nuevo precio | sólo owner cambia catálogo | modificación de precio | integración histórica | ninguna |
| 15 | Modificador se elimina tras venta | Venta e impresión históricas lo conservan | owner modifica catálogo | modificación catálogo | integración histórica | ninguna |
| 16 | Tres reimpresiones | Tres jobs separados, contador 3, motivo/actor por job | roles permitidos | tres reimpresiones | integración de cola | ninguna |
| 17 | Cocina marca listo un cancelado | Rechazo sin cambiar proyección | kitchen/owner no pueden por estado | transición rechazada | transición negativa | ninguna |
| 18 | Eventos fuera de orden | Proyección ignora versión vieja y reconcilia autoridad | actor del comando original | anomalía de sincronización | contrato/reconexión | mecanismo técnico en stack-review |
| 19 | Hora de dispositivo incorrecta | Número, fecha y auditoría usan servidor | no aplica | hora servidor | prueba con reloj cliente alterado | zona horaria operativa a configurar |
| 20 | Rol cambia durante sesión | Siguiente comando usa rol vigente y puede rechazar | membresía vigente | cambio de rol + rechazo | seguridad/integración | mecanismo de sesión en ADR técnico |
| 21 | Pedido de otra organización | Rechazo sin revelar existencia | ningún rol cruzado | acceso denegado sanitizado | IDOR/integración | ninguna |
| 22 | Importe con precisión extra | Entrada rechazada; no redondea ni persiste | no aplica | validación rechazada si sensible | límites/contract test | ninguna |
| 23 | Descuento da total negativo | Campo/acción no admitido; rechazo | nadie | validación rechazada | contrato + regla | ninguna |
| 24 | Pedido con total cero | Confirmación rechazada, sin número ni pedido | owner/cashier no supera regla | confirmación rechazada | regla unitaria | ninguna |
| 25 | Modificar sesión cerrada | Rechazo; cierre permanece inmutable | nadie | `closed-cash-change-rejected` | integración negativa | ajustes futuros como nuevo movimiento |

Cada “prueba futura” es un contrato de verificación, no evidencia de
implementación actual. Las decisiones técnicas indicadas no cambian el resultado
de dominio.
