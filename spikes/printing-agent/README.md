# SPK-PRINT-001 — bootstrap Tauri 2

Bootstrap técnico descartable de DAYIA FOOD para comprobar el ciclo mínimo de
Tauri 2 en Windows. No es el agente de impresión y no contiene impresoras,
spooler, ESC/POS, cola, backend, secretos, updater, autostart ni listeners.

## Alcance observable

La única ventana muestra:

- ID `SPK-PRINT-001`;
- versión de la aplicación y de Tauri;
- sistema operativo y arquitectura;
- disponibilidad/versión de WebView2;
- estado `runtime-operational`;
- control para cerrar el proceso.

## Prerrequisitos

En PowerShell:

```powershell
node --version
npm.cmd --version
& "$env:USERPROFILE\.cargo\bin\rustc.exe" --version
& "$env:USERPROFILE\.cargo\bin\cargo.exe" --version
```

También se requieren Microsoft C++ Build Tools con “Desktop development with
C++” y WebView2 Evergreen. Si Rust acaba de instalarse, abrir una terminal nueva
o anteponerlo sólo a la sesión:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
```

## Instalación reproducible de dependencias

Desde `spikes/printing-agent/`:

```powershell
npm.cmd ci --ignore-scripts
```

El lockfile fija la CLI de Tauri. Cargo descarga las crates fijadas al primer
build. No ejecutar `npm update`, `cargo update` ni instalar plugins.

## Pruebas y desarrollo

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm.cmd test
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
npm.cmd run tauri:dev
```

`tauri:dev` abre una ventana visible. Confirmar los campos técnicos y cerrarla
con “Cerrar aplicación”; no usar este comando como evidencia de instalador.

## Build debug y release

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm.cmd run tauri:build:debug
npm.cmd run tauri:build
powershell -ExecutionPolicy Bypass -File scripts/verify-runtime.ps1
```

Salidas esperadas, no versionadas:

```text
src-tauri/target/debug/dayia-food-spk-print-001.exe
src-tauri/target/release/dayia-food-spk-print-001.exe
src-tauri/target/release/bundle/nsis/*-setup.exe
```

Inventario local:

```powershell
Get-ChildItem src-tauri/target/debug/dayia-food-spk-print-001.exe,
  src-tauri/target/release/dayia-food-spk-print-001.exe,
  src-tauri/target/release/bundle/nsis/*-setup.exe |
  Select-Object FullName, Length, LastWriteTime

Get-ChildItem src-tauri/target/release/dayia-food-spk-print-001.exe,
  src-tauri/target/release/bundle/nsis/*-setup.exe |
  Get-FileHash -Algorithm SHA256
```

## Instalación y desinstalación manual

1. Cerrar cualquier ejecución desde `target`.
2. Usar una cuenta estándar de Windows.
3. Ejecutar el `*-setup.exe` de `target/release/bundle/nsis/`.
4. Registrar UAC, Defender y SmartScreen sin desactivar ningún control.
5. Abrir la aplicación instalada, confirmar los siete campos, cerrarla y
   abrirla otra vez.
6. Desinstalar desde **Configuración → Aplicaciones → Aplicaciones instaladas**.
7. Contestar las 12 preguntas de
   [MANUAL_TEST_CHECKLIST.md](MANUAL_TEST_CHECKLIST.md).

El modo NSIS `currentUser` equivale a instalación per-user bajo HKCU y
`%LOCALAPPDATA%`; no debe necesitar elevación. El instalador incluye el WebView2
Offline Installer para no descargarlo durante instalación. Un resultado distinto
es un hallazgo, no una razón para relanzar como administrador.

## Limpieza del sandbox descartable

Ejecutar sólo desde `spikes/printing-agent/` después de guardar la evidencia:

```powershell
$spikeRoot = (Resolve-Path .).Path
$expectedSuffix = 'spikes\printing-agent'
if (-not $spikeRoot.EndsWith($expectedSuffix)) {
  throw "Ruta inesperada: $spikeRoot"
}

@(
  'node_modules',
  'frontend-dist',
  'src-tauri\target',
  'src-tauri\gen',
  'artifacts',
  'installers',
  'bin',
  'temp'
) | ForEach-Object {
  $target = Join-Path $spikeRoot $_
  if (Test-Path -LiteralPath $target) {
    Remove-Item -LiteralPath $target -Recurse -Force
  }
}
```

No desinstalar Rust automáticamente: el inventario detectó configuración
preexistente de rustup. No borrar `Cargo.lock`, `package-lock.json`, fuentes,
pruebas ni evidencia documental.

## Estado y evidencia

Consultar [EVIDENCE.md](EVIDENCE.md) y
[KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md). La ausencia de confirmación humana
mantiene el resultado `manual-validation-pending`.
