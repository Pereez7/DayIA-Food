# ADR 003 — Dinero, precios y numeración visible

## Contexto

Cobros, cambio, caja y snapshots deben ser exactos, comparables e idempotentes.
El número visible debe servir a cocina y caja sin confundirse con seguridad,
identidad técnica o hora del dispositivo.

## Decisión

El 2026-07-29 se acepta:

- moneda única BOB y dinero conceptual en centavos enteros;
- entradas con más de dos decimales se rechazan, sin flotantes binarios;
- precios y modificadores confirmados se guardan como snapshot;
- no hay descuentos ni cambio manual de precio; una venta debe tener total
  positivo;
- número visible secuencial diario por organización y fecha operativa, asignado
  por servidor; huecos permitidos y números nunca reutilizados;
- identificador técnico, clave de idempotencia y número visible son conceptos
  separados.

## Alternativas

- Decimal exacto: válido, pero añade reglas de escala y redondeo que no son
  necesarias para BOB con dos decimales en este MVP.
- Flotante binario: cómodo en algunos entornos, pero introduce diferencias no
  aceptables; se rechaza.
- Secuencia continua: simple, pero menos útil en operación diaria.
- Número basado en reloj cliente: vulnerable a desajustes, colisiones y
  manipulación.

## Consecuencias

Las fronteras convierten BOB a centavos y validan límites. No se selecciona una
librería o tipo físico. Futuras monedas, impuestos, descuentos o sucursales
requieren una nueva decisión sin reinterpretar ventas históricas.

## Estado

accepted

## Fecha

2026-07-29

