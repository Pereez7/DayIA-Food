# Checklist manual — SPK-PRINT-001

## Identificación de la ejecución

| Campo | Valor |
|---|---|
| Fecha/hora UTC | pendiente |
| Operador | pendiente |
| Windows edición/versión/build | pendiente |
| Tipo de cuenta | estándar / administrador / pendiente |
| Instalador y SHA-256 | pendiente |
| WebView2 | pendiente |
| Antivirus | pendiente |

## Procedimiento

1. Confirmar que Defender/antivirus y firewall siguen activos.
2. Iniciar sesión con una cuenta estándar real.
3. Ejecutar el NSIS generado sin “Ejecutar como administrador”.
4. Registrar literalmente cualquier aviso de UAC, Defender o SmartScreen.
5. Abrir la aplicación, verificar todos los campos y `runtime-operational`.
6. Cerrar desde el botón, comprobar el proceso y abrirla de nuevo.
7. Desinstalar desde Configuración de Windows.
8. Inspeccionar accesos directos, procesos y datos residuales.

No desactivar ni excluir controles para obtener éxito. Adjuntar capturas
sanitizadas; no incluir nombre completo de usuario, rutas personales, tokens ni
otros datos sensibles.

## Doce confirmaciones obligatorias

| # | Pregunta | Respuesta | Evidencia |
|---:|---|---|---|
| 1 | ¿Apareció aviso UAC? | pendiente | pendiente |
| 2 | ¿Windows Defender mostró alerta? | pendiente | pendiente |
| 3 | ¿SmartScreen bloqueó o advirtió? | pendiente | pendiente |
| 4 | ¿La aplicación abrió? | pendiente | pendiente |
| 5 | ¿Mostró `runtime-operational`? | pendiente | pendiente |
| 6 | ¿Pudo cerrarse? | pendiente | pendiente |
| 7 | ¿Pudo abrirse nuevamente? | pendiente | pendiente |
| 8 | ¿Pudo desinstalarse? | pendiente | pendiente |
| 9 | ¿Quedaron accesos directos? | pendiente | pendiente |
| 10 | ¿Quedó un proceso activo? | pendiente | pendiente |
| 11 | ¿Quedaron archivos de datos? | pendiente | pendiente |
| 12 | ¿Fue necesario reiniciar Windows? | pendiente | pendiente |

## Criterio

Hasta completar las doce respuestas con evidencia humana:

- estado de `SPK-PRINT-001`: `verifying`;
- resultado: `manual-validation-pending`;
- está prohibido marcarlo `completed`.
