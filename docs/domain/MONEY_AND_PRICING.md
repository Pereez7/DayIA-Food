# Dinero y precios

## Representación

- moneda única inicial: boliviano (`BOB`);
- representación conceptual: unidades menores enteras, un boliviano = 100
  centavos;
- precisión aceptada: exactamente dos decimales en entradas expresadas en
  bolivianos;
- no se usan flotantes binarios para importar, calcular, comparar ni persistir
  dinero;
- no hay conversión ni múltiples monedas;
- una entrada con mayor precisión se rechaza: no se redondea silenciosamente;
- cualquier cálculo futuro que requiera fracciones deberá definir redondeo
  comercial explícito antes de habilitarse.

Los enteros menores dan igualdad exacta e idempotencia simple; obligan a convertir
en fronteras y a validar límites. No se selecciona tipo, librería ni motor.

## Formación de precio

- `ProductVariant` posee el precio vendible actual; `Product` agrupa identidad.
  Incluso un producto sin opciones visibles tiene una variante base;
- cada `Modifier` permitido aporta un ajuste entero mayor o igual a cero;
- al confirmar, cada línea conserva nombres, elecciones, precios unitarios,
  ajustes, cantidad y totales históricos;
- actualizaciones o bajas de catálogo no cambian pedidos confirmados;
- no existe alteración manual de precio en el pedido;
- sólo owner modifica precios actuales del catálogo y se audita;
- descuentos porcentuales: no incluidos;
- descuentos fijos: no incluidos;
- promociones avanzadas: no incluidas;
- una variante vendible debe tener precio mayor que cero;
- modificadores sin costo pueden tener precio cero;
- un pedido con total cero se rechaza al confirmar.

## Cálculos

- total unitario = precio snapshot de variante + suma de modificadores snapshot;
- total de línea = cantidad entera positiva × total unitario;
- subtotal = suma exacta de líneas;
- total = subtotal en el MVP, porque no hay descuentos, impuestos añadidos ni
  cargos aprobados;
- efectivo recibido debe ser mayor o igual al total;
- cambio = recibido - total, nunca negativo;
- importes de entrada son no negativos; movimientos usan importe positivo y
  dirección;
- sólo la diferencia calculada de caja puede ser negativa.
