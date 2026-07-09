$job = Start-Job -ScriptBlock {
  Set-Location "D:\MCA2projects\ReactProject\FoodHub\backend"
  npm run start 2>&1
}
$ready = $false
for ($i=0; $i -lt 20; $i++) {
  try {
    Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/forgot-password" -ContentType "application/json" -Body (@{email='warmup@example.com'} | ConvertTo-Json -Compress) -TimeoutSec 1 | Out-Null
    $ready = $true
    break
  } catch {}
}
function Test-ForgotPassword($email) {
  $result = [ordered]@{ email = $email; status = 'NO_RESPONSE'; message = $null; hasResetToken = $false }
  try {
    $body = @{ email = $email } | ConvertTo-Json -Compress
    $resp = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/forgot-password" -ContentType "application/json" -Body $body -TimeoutSec 5
    $result.status = 200
    if ($resp.message) { $result.message = $resp.message } elseif ($resp.msg) { $result.message = $resp.msg } else { $result.message = ($resp | ConvertTo-Json -Compress -Depth 10) }
    if ($resp.data -and $null -ne $resp.data.resetToken) { $result.hasResetToken = $true }
  } catch {
    if ($_.Exception.Response) {
      $webResp = $_.Exception.Response
      $result.status = [int]$webResp.StatusCode
      $reader = New-Object System.IO.StreamReader($webResp.GetResponseStream())
      $bodyText = $reader.ReadToEnd()
      $reader.Close()
      if ($bodyText) {
        try {
          $errObj = $bodyText | ConvertFrom-Json -ErrorAction Stop
          if ($errObj.message) { $result.message = $errObj.message } elseif ($errObj.msg) { $result.message = $errObj.msg } else { $result.message = $bodyText }
          if ($errObj.data -and $null -ne $errObj.data.resetToken) { $result.hasResetToken = $true }
        } catch {
          $result.message = $bodyText
        }
      }
    } else {
      $result.message = $_.Exception.Message
    }
  }
  [pscustomobject]$result
}
$r1 = Test-ForgotPassword "test@example.com"
$r2 = Test-ForgotPassword "demo@example.com"
$state = (Get-Job -Id $job.Id).State
$logs = Receive-Job -Id $job.Id | ForEach-Object { $_.ToString() }
if ($state -eq "Running") { Stop-Job -Id $job.Id }
Remove-Job -Id $job.Id -Force
"BACKEND_READY=$ready"
"JOB_STATE=$state"
"REQ1_EMAIL=$($r1.email)"
"REQ1_STATUS=$($r1.status)"
"REQ1_MESSAGE=$($r1.message)"
"REQ1_HAS_RESETTOKEN=$($r1.hasResetToken)"
"REQ2_EMAIL=$($r2.email)"
"REQ2_STATUS=$($r2.status)"
"REQ2_MESSAGE=$($r2.message)"
"REQ2_HAS_RESETTOKEN=$($r2.hasResetToken)"
$err = $logs | Select-String -Pattern 'Error|ERR!|EADDRINUSE|Cannot find|failed|Unhandled|Mongo|Mongoose|connect' | Select-Object -First 5 | ForEach-Object { $_.Line }
if ($err) {
  "SERVER_LOG_HINTS_START"
  $err
  "SERVER_LOG_HINTS_END"
}
