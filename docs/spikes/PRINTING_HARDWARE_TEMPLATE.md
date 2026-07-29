# Ficha de hardware del spike de impresión

Duplicar una ficha por equipo Windows y por impresora. El dossier requiere como
mínimo una ejecución `development` y otra `restaurant-like`; si excepcionalmente
usan el mismo equipo físico, debe justificarse por qué representa ambos perfiles
y repetirse con cuentas/configuraciones separadas. No completar con supuestos ni
copiar datos de otro modelo.

## Control de evidencia

| Campo | Valor |
|---|---|
| ID de ejecución | pendiente |
| Ciclo SPK | pendiente |
| Fecha/hora UTC | pendiente |
| Operador/revisor | pendiente |
| Commit/artefacto/hash | pendiente |
| Carpeta de evidencia | pendiente |
| Datos ficticios confirmados | sí / no |

## Equipo Windows

| Campo | Valor observado |
|---|---|
| Fabricante/modelo del equipo | pendiente |
| Tipo de entorno | development / restaurant-like |
| Justificación de representatividad | pendiente |
| CPU/arquitectura | pendiente |
| RAM/disco libre | pendiente |
| Edición de Windows | pendiente |
| Versión/build | pendiente |
| Estado de soporte/ESU/LTSC | pendiente |
| Últimas actualizaciones | pendiente |
| Idioma/región/zona | pendiente |
| Tipo de cuenta | administrador / estándar |
| WebView2 versión/canal | pendiente |
| Antivirus producto/versión/política | pendiente |
| Firewall/perfil/reglas relevantes | pendiente |
| Spooler versión/estado | pendiente |
| Red | ethernet / wifi / sin internet |

## Impresora

| Campo | Valor observado |
|---|---|
| Rol del spike | kitchen / cash |
| Fabricante | pendiente |
| Modelo exacto | pendiente |
| Número de serie, si es accesible y permitido | pendiente/redactado |
| Ancho de papel | 58 mm / 80 mm / otro |
| Conexión | USB / red / otra |
| Driver/proveedor/versión | pendiente |
| Firmware, si es visible | pendiente |
| Nombre visible Windows | pendiente |
| Nombre interno/spooler | pendiente |
| Puerto/URI sanitizado | pendiente |
| Soporte ESC/POS declarado | sí / no / desconocido |
| ESC/POS comprobado | sí / no / no probado |
| Corte declarado | sí / no / desconocido |
| Corte comprobado | sí / no / no probado |
| Codepages/Unicode observados | pendiente |
| Estado bidireccional disponible | sí / no / parcial |

## Estabilidad de identidad

| Cambio | Antes | Después | Detectado | Binding correcto | Evidencia |
|---|---|---|---:|---:|---|
| reinicio Windows | pendiente | pendiente | — | — | pendiente |
| reinicio agente | pendiente | pendiente | — | — | pendiente |
| desconectar/reconectar USB | pendiente | pendiente | — | — | pendiente |
| cambiar puerto USB | pendiente | pendiente | — | — | pendiente |
| renombrar en Windows | pendiente | pendiente | — | — | pendiente |
| reinstalar/actualizar driver | pendiente | pendiente | — | — | pendiente |
| apagar/encender impresora | pendiente | pendiente | — | — | pendiente |

## Matriz de entorno

| Condición | Ejecutada | Resultado | Artefacto |
|---|---:|---|---|
| administrador + internet + impresora encendida | no | pendiente | pendiente |
| estándar + internet + impresora encendida | no | pendiente | pendiente |
| estándar + sin internet + trabajo local | no | pendiente | pendiente |
| impresora apagada | no | pendiente | pendiente |
| USB desconectado durante envío | no | pendiente | pendiente |
| cola pausada/bloqueada | no | pendiente | pendiente |
| antivirus y firewall activos | no | pendiente | pendiente |
| disco limitado/lleno controlado | no | pendiente | pendiente |
| reloj local alterado | no | pendiente | pendiente |

## Resultados de tickets

| Ticket | Ruta | Ancho | Español | BOB | Corte | Silencioso | Estado software | Papel observado | Evidencia |
|---|---|---|---:|---:|---:|---:|---|---|---|
| cocina original | driver/raw | pendiente | — | n/a | — | — | pendiente | pendiente | pendiente |
| cocina reimpresión | driver/raw | pendiente | — | n/a | — | — | pendiente | pendiente | pendiente |
| caja original | driver/raw | pendiente | — | — | — | — | pendiente | pendiente | pendiente |
| caja reimpresión | driver/raw | pendiente | — | — | — | — | pendiente | pendiente | pendiente |

## Instalación, actualización y residuos

| Paso | Cuenta/UAC | Duración | Tamaño/huella | Procesos/servicios/tareas | Archivos/registro relevantes | Resultado |
|---|---|---:|---:|---|---|---|
| instalar MSI | pendiente | — | — | pendiente | pendiente | no probado |
| desinstalar MSI | pendiente | — | — | pendiente | pendiente | no probado |
| instalar NSIS per-user | pendiente | — | — | pendiente | pendiente | no probado |
| actualizar N→N+1 | pendiente | — | — | pendiente | pendiente | no probado |
| interrumpir/rollback | pendiente | — | — | pendiente | pendiente | no probado |
| desinstalar final | pendiente | — | — | pendiente | pendiente | no probado |

## Métricas

Registrar cada muestra, no sólo el promedio.

| Métrica | Condición | Muestras | Mediana | p95 observado | Mín/Máx | Fallos |
|---|---|---:|---:|---:|---:|---:|
| inicio frío | pendiente | 0 | — | — | — | — |
| inicio caliente | pendiente | 0 | — | — | — | — |
| RAM reposo | pendiente | 0 | — | — | — | — |
| CPU/RAM impresión | pendiente | 0 | — | — | — | — |
| recepción→OS | pendiente | 0 | — | — | — | — |
| instalación/desinstalación | pendiente | 0 | — | — | — | — |
| recuperación reinicio | pendiente | 0 | — | — | — | — |
| recuperación red | pendiente | 0 | — | — | — | — |

Para cada ticket se ejecutan 20 impresiones consecutivas y se registra:
solicitadas, efectos lógicos, papeles observados, duplicados, fallos conocidos y
resultados inciertos.

## Hallazgos

- Bloqueantes: pendiente.
- Follow-up: pendiente.
- Riesgo residual: pendiente.
- Datos ausentes: pendiente.
- Recomendación del operador: `GO | NO-GO | NEEDS-FOLLOW-UP | INSUFFICIENT`.
- Revisión independiente: pendiente.
