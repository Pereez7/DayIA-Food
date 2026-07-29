# Matriz del spike de impresión

## Uso

Cada fila es una obligación experimental. `planned` no significa que funcione:
la ejecución posterior debe añadir ambiente, hora, versión, resultado observado
y artefacto. Un mock puede validar forma, nunca hardware, spooler, antivirus ni
salida física.

## Veinte capacidades

| # | Capacidad | Experimento mínimo | Evidencia requerida | Falla si | Ciclo |
|---:|---|---|---|---|---|
| 1 | instalar/ejecutar Windows | instalar, iniciar, cerrar y reiniciar con estándar/admin | build/hash, OS, UAC, tiempos | no inicia en objetivo o exige elevación permanente | 001 |
| 2 | enumerar impresoras | listar locales/conectadas con spooler normal/degradado | inventario sanitizado y duración | omite objetivo o bloquea proceso sin timeout | 002 |
| 3 | identidad cocina | reboot, USB, driver, puerto y renombre | matriz before/after | cambia sin detección o selecciona otra | 002/005 |
| 4 | identidad caja | repetir matriz independiente | matriz before/after | cambia sin detección o selecciona otra | 002/005 |
| 5 | selección explícita | vincular roles y rechazar mapping ambiguo/igual | binding y errores | imprime por default/fuzzy match | 005 |
| 6 | impresión silenciosa | enviar sin diálogo con usuario estándar | captura/log/UAC | diálogo inevitable o permiso incompatible | 003/004 |
| 7 | ticket cocina | imprimir fixture completo | hash + foto/escaneo | faltan/cambian campos | 003 |
| 8 | ticket caja | imprimir fixture no fiscal | hash + foto/escaneo | importes/formato incorrectos | 004 |
| 9 | español y BOB | fixture áéíóúñÑ/Bs/separadores | foto y bytes/encoding elegidos | glifos ilegibles o importe ambiguo | 003/004 |
| 10 | corte | probar capacidad declarada y fallback sin corte | foto, estado y capability | fallo de corte oculta resultado o rompe ticket | 003/004 |
| 11 | 58/80 mm | ejecutar ancho disponible y fixture del otro mediante preview/impresora real | medidas y hardware | truncado silencioso | 003/004 |
| 12 | impresora apagada | apagar antes del envío | estado spooler, error, log | falso `submitted` definitivo o retry ciego | 003/004/008 |
| 13 | cola bloqueada | pausar spooler/job y recuperar | timeline y estados | cuelgue sin timeout/diagnóstico | 003/004/008 |
| 14 | reintento manual | fallo conocido → retry con actor/motivo | dos attempts, un resultado | retry automático incierto o pierde auditoría | 006 |
| 15 | evitar duplicado | replay, kill antes/después y dos instancias | conteo lógico/físico | duplicado automático | 006/008 |
| 16 | registrar resultado | correlacionar job/attempt/spooler | logs allowlist + timeline | no distingue failed/submitted/unknown | 006 |
| 17 | comunicación segura | cuatro transportes, auth/replay/TLS/firewall | matriz/tráfico sanitizado | acepta comando no autenticado/replay | 007/009 |
| 18 | offline limitado | desconectar tras persistir, imprimir, reconectar | timeline y reporte tardío | inventa trabajo o duplica al volver | 008 |
| 19 | antivirus/firewall | ejecutar con controles activos y binario sin firma aislado | producto/versión/alerta/acción | requiere excluir controles | 009 |
| 20 | instalar/actualizar/desinstalar | ciclo N→N+1→rollback/uninstall | hashes, UAC, archivos/servicios before/after | dos versiones activas, estado perdido o residuos críticos | 001/009 |

## Preguntas convertidas en experimentos

| Tema | Hipótesis que se intenta refutar | Procedimiento | Resultado registrable |
|---|---|---|---|
| Windows | Windows 11 x64 soportado funciona con estándar; Windows 10 es sólo condicionado | matriz OS/edición/build y cuenta | compatible, incompatible o no probado |
| WebView2 | Evergreen está presente o el instalador lo provee sin sorpresa | presente/ausente, online/offline | modo, tamaño, UAC y error |
| permisos | proceso normal no necesita admin | instalar/usar/desinstalar con ambas cuentas | elevación por paso |
| MSI/NSIS | `perUser` reduce UAC sin dejar residuos | comparar ciclo completo | tiempos, rutas y residuos |
| enumeración | Win32/spooler expone destinos necesarios | local/conexión, driver offline | nombres, atributos, latencia |
| identidad | una huella compuesta detecta cambio sin elegir mal | reboot/rename/USB/driver/puerto | atributos estables/inestables |
| ruta driver/raw | una ruta soporta cada hardware sin shell | mismo fixture por driver y raw si aplica | fidelidad, estado, permisos |
| silencio | el envío puede ocurrir sin diálogo | usuario estándar + destino explícito | diálogo/UAC/resultado |
| error | spooler distingue no enviado de incierto | fallos antes/durante/después | error code y certeza |
| papel físico | ningún estado software ofrece certeza universal | comparar spooler con observación | `submitted` o `delivery-unknown` |
| plugin/adapter | candidato mantenido no amplía permisos indebidamente | release/licencia/advisories/API/capabilities | apto/no apto/no concluyente |

## Comparación de comunicación

| Alternativa | Superficie | Offline | Firewall/CORS | Auth/replay | Experimento y criterio |
|---|---|---|---|---|---|
| polling HTTPS saliente | conexión periódica a servidor simulado | conserva trabajo recibido | sin listener; proxy/TLS por medir | token dispositivo + lease/idempotencia | preferida provisionalmente si converge, no duplica y costo de polling es aceptable |
| WebSocket saliente | conexión persistente | igual después de persistir | salida permitida puede cerrarse por proxy | token + mensajes versionados/replay | seguir si mejora latencia sin complejidad desproporcionada |
| HTTP local navegador→agente | listener loopback | depende del navegador | origen/CORS/puerto/firewall y suplantación | pairing/origin/token local | `NO-GO` inicial si exige exposición o certificado frágil; sirve como contraste |
| archivo/cola local simulada | filesystem local | alta para trabajo ya escrito | sin red, requiere ACL/path seguro | integridad, ownership y replay | control experimental; no sustituye servidor ni autoriza pedidos offline |

La decisión de protocolo se difiere. Polling sólo gana el derecho a un spike más
profundo; no queda aceptado por esta matriz.

## Veinticinco escenarios adversariales

| # | Riesgo | Experimento | Resultado esperado | Evidencia | Criterio de fallo | Mitigación | Decisión afectada |
|---:|---|---|---|---|---|---|---|
| 1 | job duplicado | entregar mismo id/hash simultáneo y secuencial | un efecto y recuperación | logs + conteo papel | segundo efecto | unique local + claim | cola/idempotencia |
| 2 | imprime y muere antes de reportar | kill tras envío, antes de persistir reporte | `delivery-unknown`, sin auto-retry | timeline + papel | reimpresión automática | write-ahead + humano | estados |
| 3 | reporta éxito sin papel | simular driver/spooler que acepta sin salida | sólo `submitted`, alerta diagnóstica | spooler + observación | declara certeza física | semántica limitada | ADR-0008 |
| 4 | impresora apagada | apagar antes de job | fallo/timeout categorizado | logs + estado | cuelga o éxito falso | timeout + retry manual | adapter |
| 5 | Windows renombra | renombrar/reinstalar | binding inválido y re-vinculación | before/after | elige por parecido | huella + confirmación | identidad |
| 6 | cocina=caja | configurar mismo destino | rechazo por defecto | error + config | acepta silenciosamente | constraint de mapping | selección |
| 7 | USB desconectado | retirar durante spool | failed o unknown según punto | timeline + papel | auto-retry incierto | estados y humano | adapter |
| 8 | cola pausada | pausar spooler | bloqueado observable y recuperable | spooler/log/duración | espera infinita | timeout/diagnóstico | fallos |
| 9 | reinicio con pending | kill/relaunch | rehidrata y continúa una vez | storage + logs | pierde/duplica | estado durable | cola |
| 10 | dos instancias | iniciar dos procesos | segunda se cierra/no reclama | procesos/logs | claims simultáneos | single-instance + lease | identidad |
| 11 | token robado | replay desde segundo cliente | rechazo/revocación observable | servidor simulado | reclama job | token scoped + rotate | seguridad |
| 12 | payload hostil | metacaracteres, rutas, markup, oversized | validación 4xx/local sin efecto | casos/resultados | comando/path/DoS | schema/bounds/texto | contrato |
| 13 | ticket excede ancho | líneas y observación límite | wrap/truncado explícito seguro | foto/medición | contenido crítico perdido | layout/bounds | formato |
| 14 | español incorrecto | fixture Unicode/codepage | glifos correctos o limitación bloqueante | foto/bytes | texto ambiguo | ruta/encoding probado | hardware |
| 15 | corte falla | cortar sin soporte/atasco | ticket útil + error categorizado | foto/log | pierde todo el job | capability/fallback | hardware |
| 16 | AV cuarentena | escaneo/ejecución con AV activo | alerta registrada, sin exclusión | producto/versión/evento | requiere desactivar AV | firma/submit/fallback | runtime |
| 17 | install sin admin | NSIS per-user con estándar | instala/usa/desinstala o follow-up explícito | UAC/rutas | admin permanente | per-user o NO-GO | instalador |
| 18 | update deja dos versiones | N→N+1 interrumpido | una activa, rollback conocido | inventario/hash | dos agentes reclaman | atomicidad/single instance | updater |
| 19 | internet cae tras claim | desconectar después de persistir | concluye local y reporta tarde | timeline | pierde/duplica | local durable/reconcile | comunicación |
| 20 | servidor reenvía al volver | replay tras reconexión | dedupe y resultado previo | logs + papel | segundo ticket | id+hash | comunicación |
| 21 | reloj local errado | ±24 h antes de flujo | servidor ordena; log marca skew | timestamps comparados | TTL/orden local autoritativo | server time/monotonic | tiempo |
| 22 | disco lleno | limitar volumen antes de persistir | no reclama/imprime sin estado durable | error + espacio | imprime sin registro | preflight/fail closed | cola |
| 23 | log filtra datos | fixture con canarios/token falso | ningún canario/ticket/token en export | scan de logs | dato completo presente | allowlist/redacción | observabilidad |
| 24 | caja recibe cocina | alterar `printer_role`/binding | rechazo antes de enviar | log + cero papel | imprime destino incorrecto | binding/purpose | autorización |
| 25 | activar QZ | provocar criterio Tauri NO-GO | misma matriz se aplica a QZ, sin downgrade | dossier comparable | fallback por intuición | gate equivalente | ADR-0008 |

## Matriz de seguridad

| Amenaza | Control que debe probarse | Evidencia |
|---|---|---|
| command injection | ningún shell; texto no ejecutable | payloads y permisos/capabilities |
| path traversal | sin ruta aportada por payload; storage fijo | casos `../`, absoluto y UNC rechazados |
| payload bomb | bounds de bytes, líneas, items y observación | máximo−1/máximo/máximo+1 |
| origen no autorizado | sólo código empaquetado y servidor simulado autorizado | origen remoto/local hostil rechazado |
| impresora no autorizada | role→binding explícito | destino distinto rechazado |
| agente falso/doble | identidad scoped, single instance y revocación | segundo proceso/cliente rechazado |
| secreto local | almacén Windows evaluado y logs limpios | inspección disco/proceso/log |
| update malicioso | firma obligatoria y rollback | artefacto sin firma/firma inválida rechazado |

## Resultado

La matriz se cierra únicamente cuando cada fila tiene evidencia real o estado
`not-tested` que bloquee la decisión correspondiente. No se permite rellenar
resultados desde documentación del proveedor.
