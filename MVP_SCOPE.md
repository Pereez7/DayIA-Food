# Alcance del MVP

## Objetivo

Validar que una pizzería pequeña o mediana puede ejecutar un flujo comercial
completo y mínimo sobre un núcleo reutilizable de restaurante:

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

Este alcance fue aprobado en
[`ADR-0001`](docs/decisions/001-flujo-comercial-completo-mvp.md). Su ubicación
temporal y puertas de salida están en
[`docs/product/PHASES.md`](docs/product/PHASES.md).

## Capacidades incluidas

### 1. Contexto del restaurante

- identidad operativa mínima;
- pertenencia de datos a una organización;
- configuración necesaria para catálogo, pedidos, caja e impresión.

La separación por organización está incluida. Múltiples sucursales no.

### 2. Autenticación mínima

- inicio y cierre de sesión;
- usuarios administrados internamente;
- roles iniciales: propietario, cajero y cocina;
- protección de rutas;
- separación de acceso y datos por organización.

### 3. Catálogo y POS mínimo

- categorías y productos;
- variantes o tamaños;
- modificadores básicos;
- cantidades y observaciones;
- carrito;
- subtotal y total;
- confirmación del pedido.

### 4. Pedidos y cocina

- creación y número de pedido;
- selecciones válidas y cálculo consistente;
- estados básicos;
- envío y vista de cocina;
- marcar en preparación y listo;
- historial mínimo de cambios de estado;
- consulta operativa básica.

### 5. Caja

- apertura y monto inicial;
- movimientos relacionados con ventas;
- ingresos y retiros manuales con motivo;
- arqueo y cierre;
- diferencia entre importe esperado y contado.

### 6. Cobro básico

- efectivo;
- QR registrado manualmente;
- transferencia;
- cálculo de cambio;
- estado de pago;
- usuario que realizó el cobro.

Pago mixto tiene estado `excluded-from-mvp` por ADR-0004. Una fase futura deberá
reabrir explícitamente modelo, caja, reversos, reportes, UX e idempotencia.

### 7. Impresión básica

- comanda de cocina;
- comprobante de caja;
- configuración de una impresora de cocina y una de caja;
- reimpresión controlada;
- estado de impresión;
- fallos visibles;
- registro básico del trabajo.

### 8. Reportes esenciales

Sólo se incluyen resúmenes estrictamente necesarios dentro del flujo: consulta
operativa de pedidos, estado de impresión y arqueo/cierre de caja. No se autoriza
un módulo general de reportes ni analítica.

## Recorrido de validación

El MVP deberá verificarse de extremo a extremo:

1. un usuario interno autorizado inicia sesión en su organización;
2. abre caja con monto inicial;
3. consulta categorías y productos;
4. crea y personaliza un pedido;
5. confirma subtotal y total;
6. envía la comanda a cocina y observa su impresión o fallo;
7. cocina cambia el pedido a preparación y luego a listo;
8. caja registra un cobro básico y el cambio cuando corresponde;
9. imprime o reimprime controladamente el comprobante;
10. realiza arqueo, registra diferencias y cierra caja;
11. cierra sesión;
12. los datos de otra organización no son accesibles.

Este recorrido es un contrato futuro; todavía no existe implementación.

## Exclusiones explícitas

### Autenticación avanzada

- registro público, login social, MFA, SSO y directorio empresarial;
- permisos avanzados configurables.

### POS y operación avanzados

- mesas avanzadas y división de cuenta;
- promociones complejas y fidelización;
- venta multicanal avanzada;
- múltiples estaciones, priorización automática, predicción de tiempos y
  analítica avanzada de cocina.

### Finanzas avanzadas

- contabilidad y conciliación bancaria;
- cuentas por cobrar y gestión financiera avanzada;
- integración bancaria, pasarela online y facturación electrónica;
- crédito de clientes;
- pago mixto (`excluded-from-mvp`).

### Impresión avanzada

- diseñador de plantillas;
- varias estaciones de preparación;
- enrutamiento avanzado;
- impresión remota fuera del establecimiento;
- configuración multi-sucursal.

### Fases futuras

- ingredientes, recetas, inventario, compras, proveedores y mermas;
- mesas y delivery avanzado;
- promociones avanzadas;
- múltiples sucursales;
- integraciones externas;
- otros verticales comerciales.

## Guardas

- Una capacidad avanzada no se introduce como “preparación” del MVP.
- La separación por organización no autoriza múltiples sucursales.
- Cada funcionalidad se especifica y verifica en su propio ciclo.
- Fase 1 sigue bloqueada hasta el cierre formal de Fase 0.
- El detalle técnico se decide después; este archivo sólo aprueba comportamiento
  y límites de producto.

## Criterio de salida

El MVP sólo puede declararse completado cuando todas las capacidades incluidas
tengan criterios de aceptación aprobados, pruebas ejecutadas, evidencia
registrada y el recorrido completo pase de extremo a extremo. En esta etapa
ningún criterio de implementación está satisfecho.
