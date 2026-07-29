# ADR-0001 — Incluir el flujo comercial completo en el MVP

## Contexto

El alcance inicial de DAYIA FOOD validaba catálogo, personalización, pedidos,
importes y estados, pero dejaba autenticación, experiencia POS, caja, cobro e
impresión como candidatos bloqueados. Ese recorrido no era suficiente para operar
el ciclo comercial básico de un restaurante real.

El 2026-07-28 se aprobó humanamente ampliar de forma coordinada el MVP para cubrir
el flujo mínimo:

```text
iniciar sesión
→ abrir caja
→ registrar pedido
→ personalizar productos
→ enviar a cocina
→ preparar pedido
→ cobrar
→ imprimir
→ cerrar caja
```

La aprobación cambia alcance de producto, no decide stack, arquitectura física,
proveedores, esquema de datos ni diseño de interfaz.

## Decisión

Incluir en Fase 1 del MVP comercial:

- autenticación mínima y usuarios internos;
- roles iniciales propietario, cajero y cocina;
- protección de rutas y separación de datos por organización;
- catálogo y POS mínimos;
- pedidos y flujo básico de cocina;
- apertura, movimientos básicos, arqueo y cierre de caja;
- cobro básico;
- impresión básica en cocina y caja;
- resúmenes operativos estrictamente necesarios dentro de esos flujos.

Cada capacidad se limita a lo necesario para completar el recorrido aprobado.
Fase 1 continúa bloqueada hasta que Fase 0 cumpla sus criterios de salida.

## Alternativas

1. **Conservar el MVP anterior.** Menor esfuerzo inicial, pero sin un recorrido
   comercial utilizable en un restaurante real.
2. **Incluir el flujo comercial mínimo.** Aumenta riesgo y superficie de pruebas,
   pero permite validar una operación completa. **Elegida.**
3. **Incluir operación avanzada desde el inicio.** Podría cubrir más escenarios,
   pero rompería la prioridad del MVP y adelantaría fases futuras.

## Consecuencias

- Autenticación, POS, caja, cobro e impresión dejan de estar bloqueados por
  alcance y pasan a Fase 1.
- La separación por organización entra al MVP; multi-sucursal permanece en
  Fase 4.
- Seguridad, permisos, idempotencia, reconexión, caja e impresión con hardware
  real aumentan la exigencia de pruebas.
- Fase 1.5 debe validar impresoras reales, conexión inestable, regresión,
  seguridad, accesibilidad, rendimiento y piloto.
- Pago mixto se evaluará al especificar `PAYMENT-001`; no queda incluido por esta
  decisión.
- La arquitectura de impresión, autenticación y persistencia continúa pendiente
  de ADR técnicos separados.

## Funciones incluidas

### Autenticación mínima

- inicio y cierre de sesión;
- usuarios administrados internamente;
- roles propietario, cajero y cocina;
- protección de rutas;
- separación de datos por organización.

### POS mínimo

- categorías y productos;
- variantes o tamaños y modificadores básicos;
- cantidades, observaciones y carrito;
- subtotal, total y confirmación.

### Pedidos y cocina

- creación y número de pedido;
- estados básicos;
- envío y vista de cocina;
- en preparación y listo;
- historial mínimo de cambios.

### Caja y cobro

- apertura y monto inicial;
- movimientos por ventas;
- ingresos y retiros manuales con motivo;
- arqueo, cierre y diferencia esperado/contado;
- efectivo, QR manual y transferencia;
- cambio, estado de pago y usuario que cobró.

### Impresión

- comanda de cocina y comprobante de caja;
- una impresora de cocina y una de caja;
- reimpresión controlada;
- estado, fallos visibles y registro básico del trabajo.

## Funciones explícitamente excluidas

- registro público, login social, MFA, SSO, directorio empresarial y permisos
  avanzados configurables;
- mesas avanzadas, división de cuenta, fidelización, venta multicanal avanzada y
  promociones complejas;
- estaciones múltiples, priorización automática, predicción y analítica avanzada
  de cocina;
- contabilidad, conciliación bancaria, cuentas por cobrar y gestión financiera
  avanzada;
- integración bancaria, pasarela online, facturación electrónica y crédito;
- pago mixto hasta una decisión posterior de especificación;
- diseñador de plantillas, enrutamiento avanzado, impresión remota y múltiples
  estaciones o sucursales;
- inventario, compras, proveedores, delivery avanzado, multi-sucursal e
  integraciones.

## Estado

accepted

## Fecha

2026-07-28
