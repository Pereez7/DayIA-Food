# Backup y recuperación

## Objetivos

- RPO objetivo de producción: máximo 15 minutos.
- RTO objetivo inicial: máximo 4 horas para restaurar datos, validar y reanudar
  operación.

Son objetivos contractuales pendientes de simulacro, volumen, región y plan. Los
backups diarios administrados por sí solos pueden perder hasta un día y no
cumplen el RPO; PITR es requisito para piloto/producción salvo decisión humana
que reabra el riesgo y el alcance.

## Capas

1. backup físico/PITR administrado por Supabase;
2. dump lógico cifrado nocturno para portabilidad, almacenado fuera del proyecto
   Supabase con acceso mínimo; retención provisional de 30 copias diarias y 12
   mensuales, sujeta a costo y validación legal/fiscal;
3. migraciones, configuración no secreta y contratos en Git;
4. artefactos web/API/agent identificables y reversibles;
5. runbook con responsables, accesos y orden de recuperación.

No se contrata ni configura un plan en esta sesión.

## Restore

- restaurar primero en proyecto nuevo o staging aislado;
- resetear contraseñas de roles custom si el backup no las incluye;
- aplicar/configurar secretos fuera del backup;
- comparar migración esperada, constraints, RLS, conteos y checksums/muestras;
- ejecutar smoke de login, aislamiento, pedido, pago, caja e impresión en modo
  seguro;
- reconciliar `outbox`, idempotency in-progress y agentes antes de abrir tráfico;
- registrar punto recuperado, pérdida dentro del RPO y aprobación humana.

Simulacro trimestral y antes de una migración destructiva aprobada. Un backup sin
restore exitoso no es evidencia.

## Escenarios

| Evento | Recuperación |
|---|---|
| deploy de aplicación defectuoso | volver a artefacto compatible anterior |
| migración compatible defectuosa | corregir con migración forward y rollback de app |
| migración destructiva/corrupción | detener writes, PITR/restore, validar, reanudar |
| proyecto/proveedor perdido | restaurar dump lógico y migraciones en proyecto nuevo o PostgreSQL compatible |
| restore anterior a eventos externos | reconciliar pagos manuales, caja, outbox y jobs con auditoría; no inventar éxito |
| secreto comprometido | revocar/rotar antes de reabrir; rebuild si llegó a artefacto |

## Exportación y retención

La ventana PITR y retención de dumps se decidirán con costo y validación
legal/fiscal local. El proyecto debe poder exportar schema y datos sin depender
de Auth/Realtime para leerlos. Storage, si se adopta posteriormente, tendrá
backup separado porque un backup de base sólo conserva su metadata.

## Responsabilidad y evidencia

Sólo un operador autorizado inicia restore. Evidencia: timestamp objetivo,
backup usado, comandos/procedimiento, duración, errores, validaciones, RPO/RTO
observados y aprobación. RLS se verifica también después del restore.

Referencia verificada:
[Supabase database backups/PITR](https://supabase.com/docs/guides/platform/backups).
