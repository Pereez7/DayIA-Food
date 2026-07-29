# Identidad, idempotencia y número visible

## Tres conceptos separados

1. **Identificador técnico:** opaco, globalmente único, estable y generado por el
   servidor. No transmite fecha, organización ni secuencia.
2. **Clave de idempotencia:** opaca, aportada por el cliente para una intención
   concreta y validada junto con su huella; no es identificador de negocio.
3. **Número visible:** consecutivo diario para operación humana dentro de una
   organización.

## Política del número visible

- se asigna atómicamente al confirmar, sólo en servidor;
- alcance: organización + fecha operativa en la zona horaria configurada de la
  organización;
- secuencia inicia cada fecha operativa y crece monotónicamente;
- la fecha proviene del reloj del servidor, nunca del dispositivo;
- pedidos cancelados conservan su número;
- una validación rechazada antes de confirmar no consume número;
- se permiten huecos por concurrencia, rollback o fallos; nunca se reutilizan;
- la combinación de alcance, fecha y secuencia evita colisiones;
- cocina, comprobantes, búsquedas y auditoría muestran el mismo número;
- no se exige un formato textual rígido; la fecha operativa y secuencia son los
  valores autoritativos.

Multi-sucursal no pertenece al MVP. Una futura sucursal añadirá un nuevo ámbito
explícito sin cambiar el identificador técnico ni reinterpretar números
históricos.

