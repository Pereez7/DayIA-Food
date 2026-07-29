const fields = {
  spikeId: document.querySelector("#spike-id"),
  appVersion: document.querySelector("#app-version"),
  tauriVersion: document.querySelector("#tauri-version"),
  operatingSystem: document.querySelector("#operating-system"),
  architecture: document.querySelector("#architecture"),
  webview2Status: document.querySelector("#webview2-status"),
  runtimeStatus: document.querySelector("#runtime-status"),
  closeApp: document.querySelector("#close-app"),
};

const invoke = window.__TAURI__?.core?.invoke;

function errorCategory(error) {
  if (error instanceof TypeError) {
    return "type-error";
  }

  if (error instanceof Error) {
    return "runtime-error";
  }

  return "unknown-error";
}

function markUnavailable(reason) {
  console.error(`SPK-PRINT-001 ${reason}`);
  fields.runtimeStatus.textContent = reason;
  fields.closeApp.disabled = true;
}

async function loadRuntime() {
  if (typeof invoke !== "function") {
    markUnavailable("runtime-bridge-unavailable");
    return;
  }

  try {
    const info = await invoke("runtime_info");
    fields.spikeId.textContent = info.spikeId;
    fields.appVersion.textContent = info.appVersion;
    fields.tauriVersion.textContent = info.tauriVersion;
    fields.operatingSystem.textContent = info.operatingSystem;
    fields.architecture.textContent = info.architecture;
    fields.webview2Status.textContent = info.webview2Available
      ? `available (${info.webview2Version ?? "version unavailable"})`
      : "unavailable";
    fields.runtimeStatus.textContent = "runtime-operational";
    fields.closeApp.disabled = false;
  } catch (error) {
    markUnavailable(`runtime-info-error:${errorCategory(error)}`);
  }
}

fields.closeApp.addEventListener("click", async () => {
  fields.closeApp.disabled = true;
  fields.runtimeStatus.textContent = "runtime-closing";

  try {
    await invoke("close_app");
  } catch (error) {
    markUnavailable(`runtime-close-error:${errorCategory(error)}`);
  }
});

void loadRuntime();
