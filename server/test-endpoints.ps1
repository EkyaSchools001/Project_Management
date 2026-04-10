$urls = @(
    "http://localhost:8888/health",
    "http://localhost:8888/api/v1/notifications",
    "http://localhost:8888/api/v1/growth/observations",
    "http://localhost:8888/api/v1/training",
    "http://localhost:8888/api/v1/team",
    "http://localhost:8888/api/v1/goals",
    "http://localhost:8888/api/v1/goals/windows",
    "http://localhost:8888/api/v1/templates",
    "http://localhost:8888/api/v1/festivals",
    "http://localhost:8888/api/v1/courses",
    "http://localhost:8888/api/v1/announcements",
    "http://localhost:8888/api/v1/meetings",
    "http://localhost:8888/api/v1/surveys/active",
    "http://localhost:8888/api/v1/pd-hours",
    "http://localhost:8888/api/v1/dashboards"
)

foreach ($url in $urls) {
    try {
        $result = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5
        Write-Host "✅ OK  $url (status: $($result.status))"
    } catch {
        Write-Host "❌ ERR $url -- $($_.Exception.Message)"
    }
}
