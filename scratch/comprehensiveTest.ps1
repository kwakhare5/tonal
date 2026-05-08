$results = @()
$allTests = @()

$neutralScenarios = @(
    @{ name = "Resignation"; text = "I'm quitting. My last day is Friday." },
    @{ name = "Promotion"; text = "I've been here 2 years, I want a raise." },
    @{ name = "Feedback"; text = "Your work was sloppy and full of errors." },
    @{ name = "Boundary"; text = "Stop emailing me every hour." },
    @{ name = "Delegation"; text = "You handle the presentation. I don't have time." },
    @{ name = "Refund"; text = "I want my money back. Product broke." },
    @{ name = "Delay"; text = "The website isn't ready. Need two weeks." },
    @{ name = "Complaint"; text = "I've been waiting an hour. No help." },
    @{ name = "Intro"; text = "I'm the new manager. Let's meet." },
    @{ name = "Pricing"; text = "This invoice is too high. Fix it." },
    @{ name = "Bug"; text = "Login button doesn't work on Safari." },
    @{ name = "Outage"; text = "Site is down. Tell everyone." },
    @{ name = "Feature"; text = "We need a dark mode." },
    @{ name = "CodeReview"; text = "This code is messy. Clean it up." },
    @{ name = "Deadline"; text = "Client will fire us if we miss tomorrow." },
    @{ name = "Apology"; text = "Sorry I missed the call. I overslept." },
    @{ name = "Privacy"; text = "Don't call me after 6 PM." },
    @{ name = "Refusal"; text = "I can't help you move." },
    @{ name = "Conflict"; text = "I didn't like how you talked to me." },
    @{ name = "SkipMeeting"; text = "This meeting is a waste of time." },
    @{ name = "ColdEmail"; text = "My product saves money. Want to talk?" },
    @{ name = "FollowUp"; text = "No reply to my last email. Interested?" },
    @{ name = "Discount"; text = "Can I get 20% off?" },
    @{ name = "Referral"; text = "Know anyone who needs a designer?" },
    @{ name = "Contract"; text = "Let's sign today so we can start." },
    @{ name = "Expense"; text = "Spent $50 on lunch. Pay me back." },
    @{ name = "Vacation"; text = "Going to beach next week. Offline." },
    @{ name = "Invite"; text = "Everyone to room 10 at 10 AM." },
    @{ name = "Kitchen"; text = "Clean your dirty dishes." },
    @{ name = "IT"; text = "Laptop is slow. Need a new one." },
    @{ name = "Dinner"; text = "What's for dinner? Hungry." },
    @{ name = "Traffic"; text = "Stuck in traffic. Start without me." },
    @{ name = "Birthday"; text = "Happy birthday! Have a good one." },
    @{ name = "Keys"; text = "Where are the keys?" },
    @{ name = "CheckIn"; text = "Seeing how you are. Okay?" },
    @{ name = "Crisis"; text = "EVERYTHING IS BROKEN." },
    @{ name = "Emergency"; text = "Family emergency. Leaving now." },
    @{ name = "Hack"; text = "Hacked. Change passwords." },
    @{ name = "Legal"; text = "Pay us or we sue." },
    @{ name = "Safety"; text = "Office is flooding. Get out." },
    @{ name = "Hire"; text = "You got the job. When start?" },
    @{ name = "Reject"; text = "Found someone else. Good luck." },
    @{ name = "HRWarning"; text = "Late 3 times. This is a warning." },
    @{ name = "Gym"; text = "Do you pay for my gym?" },
    @{ name = "Friend"; text = "Hire my friend, he's good." },
    @{ name = "Win"; text = "Signed big client! Drinks on me." },
    @{ name = "ReviewMe"; text = "What do you think of my project?" },
    @{ name = "Manual"; text = "Click red then blue." },
    @{ name = "Loss"; text = "Sorry for your loss." },
    @{ name = "Thanks"; text = "Thanks for help. You're the best." }
)

foreach ($s in $neutralScenarios) {
    foreach ($t in @("formal", "workChat", "casual")) {
        $allTests += @{ name = $s.name; text = $s.text; tone = $t; from = "Neutral" }
    }
}

# Cross-Tone Permutations
$allTests += @{ name = "Permutation"; text = "yo can u check this real quick sry i messed up"; tone = "formal"; from = "casual" }
$allTests += @{ name = "Permutation"; text = "yo can u check this real quick sry i messed up"; tone = "workChat"; from = "casual" }
$allTests += @{ name = "Permutation"; text = "Hey team, just checking in on the report. Is it ready yet?"; tone = "formal"; from = "workChat" }
$allTests += @{ name = "Permutation"; text = "Hey team, just checking in on the report. Is it ready yet?"; tone = "casual"; from = "workChat" }
$allTests += @{ name = "Permutation"; text = "I am writing to formally request a reconsideration of our current agreement."; tone = "workChat"; from = "formal" }
$allTests += @{ name = "Permutation"; text = "I am writing to formally request a reconsideration of our current agreement."; tone = "casual"; from = "formal" }

foreach ($test in $allTests) {
    $body = @{ text = $test.text; toneLevel = $test.tone; mode = "convert" } | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Uri https://tonal-proxy.kwakhare5.workers.dev -Method Post -Body $body -ContentType "application/json"
        $results += [PSCustomObject]@{
            Scenario = $test.name
            InputTone = $test.from
            TargetTone = $test.tone
            Original = $test.text
            Result   = $resp.text
        }
        Write-Host "Success: $($test.name) ($($test.tone))"
    } catch {
        $results += [PSCustomObject]@{
            Scenario = $test.name
            InputTone = $test.from
            TargetTone = $test.tone
            Original = $test.text
            Result   = "ERROR: $($_.Exception.Message)"
        }
        Write-Host "FAIL: $($test.name) ($($test.tone))"
    }
    # Cloudflare is faster, 50ms is enough
    Start-Sleep -Milliseconds 50
}

$results | ConvertTo-Json | Out-File "d:\Tonal\scratch\comprehensive_results.json"
