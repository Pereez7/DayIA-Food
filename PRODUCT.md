# Producto

## Visión

DAYIA FOOD es una plataforma web de gestión operativa para restaurantes pequeños
y medianos. Su primer vertical comercial es una pizzería, pero el núcleo debe
servir después a hamburgueserías y otros restaurantes sin duplicar la aplicación.

## Usuario y problema

El usuario principal del MVP es la persona propietaria o responsable de un
restaurante, junto con el personal de caja y cocina. Necesitan ejecutar en un
único sistema el flujo comercial básico, conservar trazabilidad y reconocer
errores operativos sin depender de procesos dispersos.

## Resultado comercial del MVP

El MVP debe permitir el recorrido mínimo aprobado en
[`ADR-0001`](docs/decisions/001-flujo-comercial-completo-mvp.md):

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

El recorrido incluye sólo autenticación, POS, pedidos, cocina, caja, cobro e
impresión en sus versiones mínimas. No autoriza funciones avanzadas.

## Modelo de producto

El **núcleo común** representa:

- organización y contexto operativo del restaurante;
- usuarios, roles mínimos y acceso protegido;
- catálogo, disponibilidad, opciones y precios;
- pedidos, líneas, importes y estados;
- caja, cobros y trazabilidad operacional básica;
- trabajos de impresión y resultados observables.

El **vertical de pizzería** aporta tamaños, variantes y modificadores necesarios
para vender pizzas. No crea un segundo modelo de pedido, caja, pago o impresión.

Los verticales futuros reutilizarán el núcleo y sólo aportarán configuración o
capacidades diferenciadoras justificadas.

## Principios

1. **MVP primero.** El flujo comercial mínimo tiene prioridad sobre analítica,
   automatización y expansión futura.
2. **Un solo producto.** Los verticales comparten identidad, catálogo, pedido,
   caja y operación.
3. **Separación organizativa.** Los datos del MVP deben pertenecer a una
   organización explícita; multi-sucursal continúa fuera de alcance.
4. **Especialización explícita.** Las reglas de pizza no se dispersan por todo el
   núcleo.
5. **Decisiones técnicas aplazables.** El alcance aprobado no selecciona
   frameworks, base de datos, autenticación, impresión ni infraestructura.
6. **Terminado demostrable.** Ninguna capacidad se considera entregada sin
   evidencia ejecutable.
7. **Operación segura.** No se debilitan controles para acelerar una entrega.

## Límites

El alcance vinculante está en [`MVP_SCOPE.md`](MVP_SCOPE.md), las fases en
[`PHASES.md`](docs/product/PHASES.md) y el estado en `FEATURE_STATUS.json`.
Inventario, compras, proveedores, mesas, delivery avanzado, promociones
avanzadas, fidelización, multi-sucursal e integraciones permanecen fuera del MVP.

## Decisiones pendientes

No se han elegido framework web, backend, base de datos, mecanismo de
autenticación, transporte de tiempo real, agente de impresión, infraestructura ni
diseño visual. Cada elección requiere su propia sesión y, cuando corresponda, un
ADR aceptado.
