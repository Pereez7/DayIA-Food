import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  const path = join(root, relativePath);
  assert.ok(existsSync(path), `required contract file is missing: ${relativePath}`);
  return readFileSync(path, "utf8");
}

function json(relativePath) {
  return JSON.parse(read(relativePath));
}

test("Tauri config fixes the spike identity and per-user NSIS contract", () => {
  const config = json("src-tauri/tauri.conf.json");

  assert.equal(config.productName, "DAYIA FOOD — SPK-PRINT-001");
  assert.equal(config.version, "0.1.0");
  assert.equal(config.identifier, "com.dayiafood.spk-print-001");
  assert.deepEqual(config.bundle.targets, ["nsis"]);
  assert.equal(config.bundle.createUpdaterArtifacts, false);
  assert.equal(config.bundle.windows.nsis.installMode, "currentUser");
  assert.equal(
    config.bundle.windows.webviewInstallMode.type,
    "offlineInstaller",
  );
  assert.deepEqual(config.bundle.icon, ["icons/icon.ico"]);
  assert.ok(
    existsSync(join(root, "src-tauri/icons/icon.ico")),
    "required Windows resource is missing: src-tauri/icons/icon.ico",
  );
});

test("Tauri config grants no core/plugin capabilities and limits connect-src to IPC", () => {
  const config = json("src-tauri/tauri.conf.json");
  const csp = config.app.security.csp;

  assert.deepEqual(config.app.security.capabilities, []);
  assert.match(csp, /connect-src ipc: http:\/\/ipc\.localhost/);
  assert.match(csp, /default-src 'self'/);
  assert.doesNotMatch(csp, /https:|wss:|ws:/);
  assert.equal((csp.match(/http:/g) ?? []).length, 1);
  assert.equal(config.app.withGlobalTauri, true);
  assert.equal(config.app.windows.length, 1);
  assert.equal(config.app.windows[0].label, "main");
});

test("Rust manifest is minimal, pinned and contains no Tauri plugins", () => {
  const cargo = read("src-tauri/Cargo.toml");

  assert.match(cargo, /tauri = \{ version = "=2\.11\.5"/);
  assert.match(cargo, /tauri-build = \{ version = "=2\.6\.3"/);
  assert.match(cargo, /serde = \{ version = "=1\.0\.229"/);
  assert.doesNotMatch(cargo, /tauri-plugin-/i);
  assert.doesNotMatch(cargo, /reqwest|hyper|tokio|printpdf|escpos/i);
});

test("frontend exposes every required technical field and close action", () => {
  const html = read("frontend/index.html");
  const script = read("frontend/app.js");

  for (const id of [
    "spike-id",
    "app-version",
    "tauri-version",
    "operating-system",
    "architecture",
    "webview2-status",
    "runtime-status",
    "close-app",
  ]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing UI field: ${id}`);
  }

  assert.match(html, /SPK-PRINT-001/);
  assert.match(script, /runtime_info/);
  assert.match(script, /close_app/);
  assert.match(script, /runtime-operational/);
  assert.match(script, /runtime-info-error/);
  assert.match(script, /runtime-close-error/);
});

test("runtime source exposes technical data without printing, network or shell", () => {
  const source = read("src-tauri/src/main.rs");
  const combined = [
    source,
    read("frontend/app.js"),
    read("src-tauri/tauri.conf.json"),
    read("src-tauri/Cargo.toml"),
  ].join("\n");

  assert.match(source, /tauri::VERSION/);
  assert.match(source, /tauri::webview_version/);
  assert.match(source, /std::env::consts::OS/);
  assert.match(source, /std::env::consts::ARCH/);
  assert.match(source, /println!\("\{SPIKE_ID\} runtime-operational"\)/);
  assert.doesNotMatch(
    combined,
    /EnumPrinters|OpenPrinter|spooler|ESC\/?POS|printer[_-]?role|print[_-]?job/i,
  );
  assert.doesNotMatch(
    combined,
    /TcpListener|UdpSocket|WebSocket|fetch\s*\(|XMLHttpRequest|reqwest|shell:|Command::new/i,
  );
});

test("package scripts provide reproducible test, debug and release paths", () => {
  const manifest = json("package.json");

  assert.equal(manifest.private, true);
  assert.equal(manifest.devDependencies["@tauri-apps/cli"], "2.11.4");
  assert.equal(manifest.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(
    manifest.scripts["tauri:build:debug"],
    "tauri build --debug --no-bundle",
  );
  assert.equal(manifest.scripts["tauri:build"], "tauri build --bundles nsis");
});

test("runtime verifier samples the full process tree, TCP and clean exit", () => {
  const verifier = read("scripts/verify-runtime.ps1");

  assert.match(verifier, /Get-NetTCPConnection/);
  assert.match(verifier, /Get-CimInstance Win32_Process/);
  assert.match(verifier, /SampleCount = 50/);
  assert.match(verifier, /ExternalTcpConnectionsObserved/);
  assert.match(verifier, /RemoteAddress/);
  assert.match(verifier, /127\.0\.0\.1/);
  assert.match(verifier, /::1/);
  assert.match(verifier, /ResidualProcesses/);
  assert.match(verifier, /RUNTIME_SMOKE=PASS/);
});
