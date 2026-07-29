# Idempotencia

## Modelo común

Se adopta `idempotency_records` común para coordinación más constraints
específicos de dominio. La tabla común no sustituye unique payment, caja activa,
número visible, versión de pedido o print original.

## Clave y alcance

- clave cliente opaca de al menos 128 bits de entropía, longitud y alfabeto
  acotados;
- scope único: organización + actor/sesión/dispositivo + nombre de operación +
  clave;
- la API no reutiliza una clave entre operaciones;
- `payload_hash` es SHA-256 de una representación canónica que excluye secretos y
  campos derivados como organization/role;
- estado: `in-progress`, `succeeded`, `failed`;
- almacena código y respuesta mínima sanitizada o referencia al recurso; nunca
  tokens, contraseñas o payload completo.

## Algoritmo conceptual

1. autenticar y autorizar;
2. crear/lockear el record dentro de la transacción;
3. si key+hash final existe, devolver resultado guardado;
4. si key existe con hash distinto, devolver conflicto sin efecto;
5. si está `in-progress`, esperar acotadamente o responder “en proceso”;
6. ejecutar caso de uso y guardar resultado en la misma transacción;
7. ante rollback no conservar un falso éxito.

La misma clave con payload diferente se audita. La concurrencia sólo permite un
propietario del record; los demás recuperan o esperan.

## Retención

- mínimo 30 días después de resultado final para comandos del MVP;
- records `in-progress` nunca se purgan automáticamente; un reconciliador los
  clasifica antes;
- payment/order/cash/print conservan además sus uniques e historia durante la
  vida del registro comercial;
- purga por lotes, observable y sólo de respuesta/hash no requeridos;
- un reintento después del TTL se considera una nueva intención únicamente si
  las invariantes del dominio lo permiten.

El plazo se valida con volumen/piloto; reducirlo requiere ADR o evidencia de que
no rompe reintentos esperables.

## Operaciones obligatorias

Confirmar/cancelar pedido, transición cocina, abrir/iniciar/finalizar cierre,
movimiento manual, cobrar, crear print original, reintentar/reimprimir y
claim/report del agente.

## Pruebas

- igual key/hash simultánea y secuencial;
- igual key/hash con respuesta perdida;
- igual key, hash distinto;
- error antes/después de writes;
- record en progreso abandonado;
- reloj/TTL y purga;
- actor u organización distintos con misma key;
- retries de serialización conservan key y un solo efecto.
