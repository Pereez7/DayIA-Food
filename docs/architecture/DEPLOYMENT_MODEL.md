# Modelo de despliegue

## Topología aceptada

```text
navegador → host web estático → API HTTPS contenedorizada
                                  ↓
                         Supabase administrado
                         PostgreSQL/Auth/Realtime

agente local Windows → API HTTPS saliente → impresora local
```

El navegador no accede a credenciales privilegiadas ni a impresoras. El agente
no acepta conexiones entrantes desde Internet o desde la web.

## Entornos

| Entorno | Datos/credenciales | Uso |
|---|---|---|
| local | Supabase local futuro, datos sintéticos | desarrollo y tests |
| test/CI | efímero y aislado | integración, contratos y migraciones |
| staging | proyecto y secretos propios | E2E, restore y candidato |
| production | proyecto y secretos exclusivos | operación real |

Nunca se copian datos personales de producción a entornos inferiores sin proceso
de anonimización aprobado.

## Alternativas de alojamiento

| Opción | Pros | Contras/riesgos | Costo | Recomendación/estado |
|---|---|---|---|---|
| host estático + PaaS de contenedores | portable, escalado/rollback simples | dos superficies operativas | medio | accepted como topología |
| PaaS full-stack único | experiencia integrada | más lock-in y SSR no necesario | medio | rejected |
| VM propia | control total | parches, backups y alta operación | alto | rejected |
| proveedor/región concretos | permite precio y latencia reales | datos actuales no comparados | desconocido | needs-spike |

## Entrega, rollback y datos

- artefactos web/API inmutables identificados por commit;
- despliegue gradual y smoke test antes de promover;
- rollback de web/API a artefacto anterior compatible;
- migraciones expand/contract; no se promete rollback destructivo de datos;
- backup antes de migraciones de riesgo y restauración ensayada;
- agente firmado, canal estable, rollback y compatibilidad de protocolo.

RPO, RTO, retención, región, residencia de datos y plan con PITR se aprobarán con
el proveedor y un simulacro. Los backups anunciados por una plataforma no
equivalen a recuperación probada.

## Configuración y secretos

Configuración pública de web se separa de secretos. Credenciales de servicio
viven sólo en API/gestor de secretos; las del agente son por dispositivo,
rotables y revocables. Cada entorno muestra identidad no secreta para evitar
operar sobre el destino equivocado.

## Operación mínima

Logs estructurados con `correlation_id`; errores de web/API en Sentry tras
revisión de privacidad; métricas de host/Supabase; logs locales rotativos y
exportables del agente. OpenTelemetry y APM completo quedan diferidos hasta que
una necesidad o baseline los justifique.

## Gate pendiente

Comparar al menos dos proveedores en región, latencia Bolivia, precio total,
límites, logs, TLS, dominios, despliegue, rollback, soporte, backup y egreso.
Ejecutar restore y prueba de red antes de producción.
