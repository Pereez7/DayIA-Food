# Matriz de roles y permisos

## Leyenda

- `P`: permitido directamente.
- `A`: permitido sólo con autorización explícita de owner, registrada con ambos
  actores.
- `D`: prohibido.
- `O`: fuera del MVP.

La decisión se valida en servidor con membresía activa, organización, estado y
recurso. Ocultar controles de UI no autoriza ni protege.

| Acción | owner | cashier | kitchen |
|---|:---:|:---:|:---:|
| Iniciar sesión | P | P | P |
| Ver catálogo operativo | P | P | P |
| Crear propuesta de pedido | P | P | D |
| Confirmar pedido | P | P | D |
| Modificar propuesta no confirmada | P | P | D |
| Modificar pedido confirmado | D | D | D |
| Cancelar confirmado no iniciado/no pagado | P | P | D |
| Cancelar en preparación o listo | P | A | D |
| Autorizar cancelación | P | D | D |
| Cancelar pedido pagado/completado | D | D | D |
| Cobrar y reintentar fallo definitivo | P | P | D |
| Abrir caja | P | P | D |
| Registrar ingreso o retiro | P | A | D |
| Iniciar cierre de caja | P | P si abrió | D |
| Cerrar caja propia con diferencia | P | A | D |
| Cerrar caja abierta por otra persona | P | D | D |
| Ver diferencia de caja | P | P en sesión que abrió | D |
| Ver cocina | P | P | P |
| Cambiar a preparación/listo | P | D | P |
| Marcar entregado/completado | P | P | D |
| Reimprimir comanda | P | P | P |
| Reimprimir comprobante | P | P | D |
| Reintentar PrintJob de cocina tras fallo conocido | P | P | P |
| Reintentar PrintJob de caja tras fallo conocido | P | P | D |
| Modificar productos/precios | P | D | D |
| Ver reportes generales | O | O | O |
| Ver operación/caja actual propia | P | P | D |
| Administrar usuarios, membresías y roles | P | D | D |
| Ver auditoría | P | D | D |

Una autorización `A` no significa compartir credenciales: es una segunda
decisión autenticada del owner sobre el comando concreto. Un cambio o revocación
de rol rige desde la siguiente autorización de servidor, incluso si la sesión o
pantalla continúa abierta.

## Aplicación técnica

- role vive en `memberships`, no en metadata JWT ni frontend;
- Fastify declara policy por caso de uso y resuelve membership en cada request;
- un permiso `A` es un grant de un solo uso, corto, ligado a actor, autorizador,
  organización, operación, recurso y payload hash;
- RLS limita organización, pero no expresa por sí sola todas las condiciones de
  estado/ownership;
- toda acción `D` se prueba contra API y DB sin efecto lateral;
- cambiar rol incrementa versión y revoca contextos de sesión afectados.

Referencia: [`AUTHORIZATION.md`](../security/AUTHORIZATION.md).
