use serde::Serialize;

const SPIKE_ID: &str = "SPK-PRINT-001";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeInfo {
    spike_id: &'static str,
    app_version: String,
    tauri_version: &'static str,
    operating_system: &'static str,
    architecture: &'static str,
    webview2_available: bool,
    webview2_version: Option<String>,
}

#[tauri::command]
fn runtime_info(app: tauri::AppHandle) -> RuntimeInfo {
    let webview2_version = tauri::webview_version().ok();
    println!("{SPIKE_ID} runtime-operational");

    RuntimeInfo {
        spike_id: SPIKE_ID,
        app_version: app.package_info().version.to_string(),
        tauri_version: tauri::VERSION,
        operating_system: std::env::consts::OS,
        architecture: std::env::consts::ARCH,
        webview2_available: webview2_version.is_some(),
        webview2_version,
    }
}

#[tauri::command]
fn close_app(app: tauri::AppHandle) {
    app.exit(0);
}

fn main() {
    println!("{SPIKE_ID} runtime starting");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![runtime_info, close_app])
        .run(tauri::generate_context!())
        .unwrap_or_else(|error| {
            eprintln!("{SPIKE_ID} runtime failed: {error}");
            std::process::exit(1);
        });
}
