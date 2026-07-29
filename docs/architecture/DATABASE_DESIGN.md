# Diseño conceptual de datos

> **Estado: conceptual y pendiente de aprobación.**
>
> No es un esquema físico. No define motor, tablas, columnas, tipos, claves,
> índices, restricciones concretas ni migraciones.

## Principios

- representar primero conceptos del negocio, no preferencias de una tecnología;
- mantener pedidos e importes trazables;
- separar el núcleo común de la configuración del vertical;
- expresar contexto de restaurante en toda información operativa;
- preservar historial cuando una edición posterior no debe cambiar un pedido;
- preparar evolución por fases sin crear entidades futuras prematuramente.

## Dominios del MVP vigente

### Contexto de restaurante

Organización representa el límite de propiedad y aislamiento de datos del MVP.

**Restaurante** representa la unidad operativa inicial dentro de una organización.

Relaciones conceptuales:

- una organización contiene el contexto operativo autorizado;
- usuarios, catálogo, pedidos, caja e impresión pertenecen a una organización;
- un restaurante mantiene un catálogo;
- un restaurante recibe pedidos;
- un restaurante define el contexto de disponibilidad y operación.

**Sucursal** y la administración multi-sucursal son conceptos de Fase 4. El MVP
no debe crear múltiples sucursales.

### Catálogo

**Categoría de catálogo** organiza productos sin definir su presentación.

**Producto** representa un elemento vendible común a cualquier vertical.

**Oferta o precio vigente** expresa la condición comercial aplicable cuando se
crea una línea.

**Disponibilidad** indica si una oferta puede seleccionarse en un contexto
operativo.

Relaciones conceptuales:

- un catálogo contiene categorías y productos;
- un producto puede tener una o más opciones vendibles aprobadas;
- disponibilidad y precio pertenecen al contexto del restaurante;
- cambios futuros no deben reescribir el valor histórico de pedidos confirmados.

### Configuración de vertical

**Grupo de opciones** expresa una elección permitida, como una variante o
complemento.

**Opción** representa una selección concreta y su posible efecto comercial.

**Regla de selección** expresa mínimos, máximos o compatibilidades.

Relaciones conceptuales:

- un producto puede exponer grupos de opciones;
- un grupo contiene opciones;
- una línea de pedido conserva las selecciones aceptadas;
- las reglas de pizza especializan configuración, no el concepto de pedido.

Los nombres y límites definitivos requieren especificación de `PIZZA-001`.

### Pedidos

**Pedido** representa una operación comercial y su estado actual.

**Línea de pedido** representa producto, cantidad, selecciones y valores
confirmados.

**Selección de línea** conserva las opciones elegidas.

**Resumen de importes** conserva subtotales, ajustes aprobados y total.

**Transición de pedido** registra el paso entre estados y su contexto.

Relaciones conceptuales:

- un restaurante tiene muchos pedidos;
- un pedido tiene una o más líneas;
- una línea referencia el producto de origen y conserva una instantánea comercial
  suficiente para mantener el histórico;
- una línea puede tener selecciones;
- un pedido tiene un estado actual derivable o reconciliable con sus transiciones;
- una transición pertenece a un pedido y no puede violar el flujo permitido.

## Dominios del flujo comercial aprobado

Estos conceptos pertenecen al MVP por `ADR-0001`. Su representación física sigue
pendiente.

### Identidad y permisos

- **Identidad:** persona o agente autenticado.
- **Rol inicial:** propietario, cajero o cocina.
- **Asignación de acceso:** relación entre identidad, contexto y permisos.
- **Sesión:** autenticación vigente y revocable.

`AUTH-001` está aprobado en alcance. El mecanismo de autenticación, almacenamiento
de credenciales y sesiones requiere ADR técnico.

### Caja y cobro

- **Sesión de caja:** intervalo operativo abierto y cerrado de forma controlada.
- **Movimiento de caja:** entrada, salida o ajuste trazable.
- **Cobro:** resultado financiero asociado a un pedido.
- **Medio de cobro:** efectivo, QR manual o transferencia.
- **Arqueo:** comparación entre esperado y contado.

Relaciones conceptuales:

- una sesión de caja pertenece a organización y usuario que la abrió;
- ventas y movimientos manuales afectan el esperado de la sesión;
- un cobro pertenece a un pedido, una caja y el usuario que cobró;
- un cierre conserva contado, esperado y diferencia;
- una repetición no crea doble cobro o movimiento.

Pago mixto y fiscalidad permanecen fuera hasta una decisión posterior.

### Impresión

- **Trabajo de impresión:** intención idempotente de producir una salida.
- **Destino de impresión:** configuración lógica del hardware.
- **Intento de entrega:** resultado trazable de cada intento.

Relaciones conceptuales:

- cocina y caja tienen un destino lógico cada una;
- un trabajo referencia pedido y propósito;
- una reimpresión queda diferenciada y auditada;
- los intentos no duplican el cobro ni ocultan fallos.

No se decide formato, protocolo, retención, agente ni estructura física.

## Dominios de fases futuras

### Fase 2

- ingrediente;
- inventario e ítem de inventario;
- unidad de medida;
- movimiento y ajuste;
- receta y componente;
- proveedor;
- compra y recepción;
- merma.

### Fase 3

- mesa y ocupación;
- canal de delivery;
- promoción y aplicación de regla.

### Fase 4

- múltiples sucursales;
- credencial y contrato de integración.

Nombrarlos no habilita su implementación ni autoriza referencias físicas en el
MVP.

## Integridad conceptual

Las decisiones futuras deben demostrar al menos:

- un pedido confirmado mantiene sus importes históricos;
- una solicitud repetida no crea pedidos, cobros o impresiones duplicados;
- una transición inválida no altera el pedido;
- toda operación respeta el contexto de restaurante;
- la concurrencia tiene un resultado definido;
- borrados o correcciones sensibles conservan trazabilidad;
- datos de organizaciones distintas no se mezclan desde el MVP.

## Ciclo de vida y auditoría

Debe decidirse por dominio:

- qué puede editarse;
- qué debe versionarse o registrarse como evento;
- qué puede archivarse;
- qué exige auditoría;
- qué retención y eliminación corresponde;
- cómo se recupera ante una operación parcial.

No se asume borrado físico ni event sourcing.

## Migraciones

No existen migraciones en esta etapa. Antes de crear la primera:

1. aprobar motor y modelo físico mediante ADR;
2. convertir relaciones conceptuales en restricciones comprobables;
3. definir procedimiento de aplicación y rollback;
4. definir respaldo y recuperación;
5. preparar pruebas de migración sobre datos representativos.

Una migración aplicada será aditiva; no se editará para ocultar un cambio.

## Decisiones pendientes

- identidad exacta del restaurante en el MVP;
- vocabulario definitivo de producto, oferta, variante y opción;
- estados y transiciones de pedido;
- representación y precisión de importes;
- estrategia de instantáneas históricas;
- idempotencia y concurrencia;
- retención y auditoría;
- modelo físico de organización sin adelantar multi-sucursal;
- representación de caja, cobro y trabajos de impresión;
- evaluación posterior de pago mixto.
