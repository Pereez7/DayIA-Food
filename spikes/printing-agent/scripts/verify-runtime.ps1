param(
  [string]$Executable = "",
  [int]$SampleCount = 50
)

$ErrorActionPreference = "Stop"
$spikeRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

if ([string]::IsNullOrWhiteSpace($Executable)) {
  $Executable = Join-Path $spikeRoot "src-tauri\target\release\dayia-food-spk-print-001.exe"
}

$Executable = (Resolve-Path -LiteralPath $Executable).Path
if (-not $Executable.StartsWith($spikeRoot + "\", [StringComparison]::OrdinalIgnoreCase)) {
  throw "Executable must remain inside the SPK-PRINT-001 sandbox."
}

$runId = [Guid]::NewGuid().ToString("N")
$stdout = Join-Path ([IO.Path]::GetTempPath()) "dayia-spk-print-001-$runId.stdout.log"
$stderr = Join-Path ([IO.Path]::GetTempPath()) "dayia-spk-print-001-$runId.stderr.log"
$appProcess = $null

function Get-ProcessTreeIds([int]$RootProcessId) {
  $snapshot = @(Get-CimInstance Win32_Process)
  $ids = @($RootProcessId)
  $changed = $true

  while ($changed) {
    $changed = $false
    foreach ($candidate in $snapshot) {
      if (
        $candidate.ParentProcessId -in $ids -and
        $candidate.ProcessId -notin $ids
      ) {
        $ids += [int]$candidate.ProcessId
        $changed = $true
      }
    }
  }

  return @($ids | Sort-Object -Unique)
}

try {
  $stopwatch = [Diagnostics.Stopwatch]::StartNew()
  $appProcess = Start-Process `
    -FilePath $Executable `
    -WorkingDirectory $spikeRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr `
    -PassThru

  $operational = $false
  $windowReady = $false
  while ($stopwatch.Elapsed.TotalSeconds -lt 15 -and -not ($operational -and $windowReady)) {
    Start-Sleep -Milliseconds 100
    $appProcess.Refresh()
    $windowReady = $appProcess.MainWindowHandle -ne 0
    $operational =
      (Test-Path -LiteralPath $stdout) -and
      ((Get-Content -Raw -LiteralPath $stdout) -match "SPK-PRINT-001 runtime-operational")
  }

  $startupMilliseconds = [math]::Round($stopwatch.Elapsed.TotalMilliseconds, 1)
  $observedConnections = @()
  $observedTreeIds = @()

  for ($sample = 0; $sample -lt $SampleCount; $sample += 1) {
    $treeIds = @(Get-ProcessTreeIds $appProcess.Id)
    $observedTreeIds += $treeIds
    $observedConnections += @(
      Get-NetTCPConnection -ErrorAction Stop |
        Where-Object { $_.OwningProcess -in $treeIds } |
        Select-Object OwningProcess, State, LocalAddress, LocalPort, RemoteAddress, RemotePort
    )
    Start-Sleep -Milliseconds 100
  }

  $appProcess.Refresh()
  $treeIds = @($observedTreeIds | Sort-Object -Unique)
  $treeProcesses = @(
    Get-CimInstance Win32_Process |
      Where-Object { $_.ProcessId -in $treeIds } |
      Select-Object ProcessId, ParentProcessId, Name
  )
  $uniqueConnections = @(
    $observedConnections |
      Sort-Object OwningProcess, State, LocalAddress, LocalPort, RemoteAddress, RemotePort -Unique
  )
  $externalConnections = @(
    $uniqueConnections |
      Where-Object {
        $_.State -notin @("Listen", "Bound") -and
        $_.RemoteAddress -notin @("0.0.0.0", "::", "127.0.0.1", "::1")
      }
  )
  $workingSetMiB = [math]::Round($appProcess.WorkingSet64 / 1MB, 2)
  $privateMiB = [math]::Round($appProcess.PrivateMemorySize64 / 1MB, 2)
  $cpuSeconds = [math]::Round($appProcess.CPU, 3)
  $threads = $appProcess.Threads.Count

  $closeSent = $appProcess.CloseMainWindow()
  $exited = $appProcess.WaitForExit(5000)
  $residualProcesses = @(
    Get-Process -Name "dayia-food-spk-print-001" -ErrorAction SilentlyContinue
  )

  $result = [ordered]@{
    SpikeId = "SPK-PRINT-001"
    VerifiedAtUtc = [DateTimeOffset]::UtcNow.ToString("O")
    Executable = $Executable
    OperationalMarker = $operational
    WindowReady = $windowReady
    StartupMilliseconds = $startupMilliseconds
    WorkingSetMiB = $workingSetMiB
    PrivateMiB = $privateMiB
    CpuSeconds = $cpuSeconds
    Threads = $threads
    ProcessTree = $treeProcesses
    NetworkSampleCount = $SampleCount
    TcpConnectionsObserved = @($observedConnections).Count
    UniqueTcpEndpointsObserved = $uniqueConnections
    ExternalTcpConnectionsObserved = @($externalConnections).Count
    CloseSent = $closeSent
    Exited = $exited
    ResidualProcesses = $residualProcesses.Count
  }

  $result | ConvertTo-Json -Depth 5

  if (
    -not $operational -or
    -not $windowReady -or
    -not $closeSent -or
    -not $exited -or
    @($externalConnections).Count -ne 0 -or
    $residualProcesses.Count -ne 0
  ) {
    throw "RUNTIME_SMOKE=FAIL"
  }

  "RUNTIME_SMOKE=PASS"
} finally {
  if ($null -ne $appProcess -and -not $appProcess.HasExited) {
    Stop-Process -Id $appProcess.Id -Force
  }

  foreach ($temporaryFile in @($stdout, $stderr)) {
    if (
      (Test-Path -LiteralPath $temporaryFile) -and
      $temporaryFile.StartsWith([IO.Path]::GetTempPath(), [StringComparison]::OrdinalIgnoreCase)
    ) {
      Remove-Item -LiteralPath $temporaryFile -Force
    }
  }
}
