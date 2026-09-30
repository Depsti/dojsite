# Set DOJ_PORTAL_URL and DOJ_DISCORD_IMPORT_SECRET in your bot/automation environment.
if (-not $env:DOJ_PORTAL_URL -or -not $env:DOJ_DISCORD_IMPORT_SECRET) { throw 'Portal-URL oder Import-Schluessel fehlt.' }
$endpoint = [Uri]::new([Uri]$env:DOJ_PORTAL_URL, '/api/integrations/discord/cases')
if ($endpoint.Scheme -ne 'https') { throw 'HTTPS ist erforderlich.' }
$payload = @{
  externalId = 'discord-message-123456789'
  title = 'Staat gegen Miller'
  description = 'Sachverhalt aus dem RP-Verfahren'
  confidential = $true
  people = @(@{ name = 'Alex Miller'; role = 'Beschuldigter' })
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri $endpoint.AbsoluteUri -Method Post -Headers @{ Authorization = "Bearer $env:DOJ_DISCORD_IMPORT_SECRET" } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($payload))
