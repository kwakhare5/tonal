$tones = @("formal", "workChat", "casual")
$scenarios = @(
    @{ name = "Complaint"; text = "Your service was terrible and I want a refund now." },
    @{ name = "Apology"; text = "I'm so sorry I missed the deadline, I was sick." },
    @{ name = "Favor"; text = "Can you help me with this project? I'm swamped." },
    @{ name = "Boundary"; text = "I can't work on weekends, don't ask me again." },
    @{ name = "Urgent"; text = "The server is down!! Fix it ASAP." }
)

$results = @()

foreach ($s in $scenarios) {
    foreach ($t in $tones) {
        $body = @{ text = $s.text; toneLevel = $t; mode = "convert" } | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri https://tonal-proxy.kwakhare5.workers.dev -Method Post -Body $body -ContentType "application/json"
        
        $results += [PSCustomObject]@{
            Scenario = $s.name
            Tone     = $t
            Original = $s.text
            Result   = $resp.text
        }
    }
}

$results | Export-Csv -Path "d:\Tonal\scratch\mass_test_results.csv" -NoTypeInformation
$results | ConvertTo-Json | Out-File "d:\Tonal\scratch\mass_test_results.json"
