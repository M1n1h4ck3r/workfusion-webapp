# MinIO Setup Script for Windows
# Run this script as: .\scripts\setup-minio.ps1

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🚀 MinIO Configuration Setup for WorkFusion" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Function to update .env.local
function Update-EnvFile {
    param(
        [string]$Key,
        [string]$Value
    )
    
    $envPath = ".\.env.local"
    
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        $pattern = "^$Key=.*$"
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, "$Key=$Value"
        } else {
            $content += "`n$Key=$Value"
        }
        
        Set-Content -Path $envPath -Value $content -NoNewline
    } else {
        Set-Content -Path $envPath -Value "$Key=$Value"
    }
}

# Check if .env.local exists
if (Test-Path ".\.env.local") {
    Write-Host "✅ Found existing .env.local file" -ForegroundColor Green
    $envContent = Get-Content ".\.env.local" -Raw
} else {
    Write-Host "⚠️  No .env.local file found. Creating new one..." -ForegroundColor Yellow
    $envContent = ""
}

Write-Host ""
Write-Host "Please provide your MinIO server details:" -ForegroundColor Cyan
Write-Host ""

# Get current values
$currentEndpoint = if ($envContent -match 'MINIO_ENDPOINT=(.*)') { $matches[1] } else { "103.214.111.115" }
$currentPort = if ($envContent -match 'MINIO_PORT=(.*)') { $matches[1] } else { "9000" }
$currentSSL = if ($envContent -match 'MINIO_USE_SSL=(.*)') { $matches[1] } else { "false" }
$currentAccessKey = if ($envContent -match 'MINIO_ACCESS_KEY=(.*)') { $matches[1] } else { "minioadmin" }
$currentSecretKey = if ($envContent -match 'MINIO_SECRET_KEY=(.*)') { $matches[1] } else { "minioadmin" }
$currentBucket = if ($envContent -match 'MINIO_BUCKET_NAME=(.*)') { $matches[1] } else { "persona-avatars" }

# Get MinIO configuration
$endpoint = Read-Host "MinIO Server IP/Domain [$currentEndpoint]"
if ([string]::IsNullOrWhiteSpace($endpoint)) { $endpoint = $currentEndpoint }

$port = Read-Host "MinIO API Port [$currentPort]"
if ([string]::IsNullOrWhiteSpace($port)) { $port = $currentPort }

$useSSL = Read-Host "Use SSL/HTTPS? (true/false) [$currentSSL]"
if ([string]::IsNullOrWhiteSpace($useSSL)) { $useSSL = $currentSSL }

Write-Host ""
Write-Host "⚠️  IMPORTANT: Never use default credentials in production!" -ForegroundColor Red
Write-Host ""

# Check for default credentials
if ($currentAccessKey -eq "minioadmin" -or $currentSecretKey -eq "minioadmin") {
    Write-Host "🔴 WARNING: You are using default MinIO credentials!" -ForegroundColor Red
    Write-Host "This is a security risk. Please change them immediately." -ForegroundColor Red
    Write-Host ""
    
    $generateNew = Read-Host "Generate secure credentials? (Y/N) [Y]"
    if ([string]::IsNullOrWhiteSpace($generateNew) -or $generateNew -eq "Y") {
        # Generate secure credentials
        Add-Type -AssemblyName System.Web
        $accessKey = [System.Web.Security.Membership]::GeneratePassword(20, 0)
        $secretKey = [System.Web.Security.Membership]::GeneratePassword(40, 0)
        
        Write-Host ""
        Write-Host "🔐 Generated secure credentials:" -ForegroundColor Green
        Write-Host "=" * 50 -ForegroundColor Gray
        Write-Host "Access Key: $accessKey" -ForegroundColor Yellow
        Write-Host "Secret Key: $secretKey" -ForegroundColor Yellow
        Write-Host "=" * 50 -ForegroundColor Gray
        Write-Host ""
        Write-Host "⚠️  SAVE THESE CREDENTIALS! They will be added to .env.local" -ForegroundColor Red
        Write-Host ""
        
        $useGenerated = Read-Host "Use these generated credentials? (Y/N) [Y]"
        if ([string]::IsNullOrWhiteSpace($useGenerated) -or $useGenerated -eq "Y") {
            $currentAccessKey = $accessKey
            $currentSecretKey = $secretKey
        }
    }
} else {
    Write-Host "Enter your MinIO credentials (or press Enter to keep current):" -ForegroundColor Cyan
    Write-Host ""
    
    $accessKey = Read-Host "Access Key [$($currentAccessKey.Substring(0, [Math]::Min(8, $currentAccessKey.Length)))...]"
    if ([string]::IsNullOrWhiteSpace($accessKey)) { $accessKey = $currentAccessKey }
    
    $secretKey = Read-Host "Secret Key [$($currentSecretKey.Substring(0, [Math]::Min(8, $currentSecretKey.Length)))...]"
    if ([string]::IsNullOrWhiteSpace($secretKey)) { $secretKey = $currentSecretKey }
    
    $currentAccessKey = $accessKey
    $currentSecretKey = $secretKey
}

Write-Host ""
$bucketName = Read-Host "Bucket Name [$currentBucket]"
if ([string]::IsNullOrWhiteSpace($bucketName)) { $bucketName = $currentBucket }

# Update environment variables
Write-Host ""
Write-Host "Updating configuration..." -ForegroundColor Cyan

Update-EnvFile -Key "MINIO_ENDPOINT" -Value $endpoint
Update-EnvFile -Key "MINIO_PORT" -Value $port
Update-EnvFile -Key "MINIO_USE_SSL" -Value $useSSL
Update-EnvFile -Key "MINIO_ACCESS_KEY" -Value $currentAccessKey
Update-EnvFile -Key "MINIO_SECRET_KEY" -Value $currentSecretKey
Update-EnvFile -Key "MINIO_BUCKET_NAME" -Value $bucketName
Update-EnvFile -Key "MINIO_REGION" -Value "us-east-1"
Update-EnvFile -Key "MINIO_CONSOLE_PORT" -Value "9001"

# Set public URL
$protocol = if ($useSSL -eq "true") { "https" } else { "http" }
$publicUrl = "${protocol}://${endpoint}:${port}"
Update-EnvFile -Key "MINIO_PUBLIC_URL" -Value $publicUrl

# Set image processing defaults
Update-EnvFile -Key "MINIO_MAX_IMAGE_SIZE" -Value "5242880"
Update-EnvFile -Key "MINIO_IMAGE_QUALITY" -Value "85"
Update-EnvFile -Key "MINIO_THUMBNAIL_SIZE" -Value "150"

Write-Host ""
Write-Host "✅ Configuration saved to .env.local" -ForegroundColor Green
Write-Host ""

# Display instructions
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Access MinIO Console:" -ForegroundColor White
Write-Host "   ${protocol}://${endpoint}:9001" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Login with your credentials" -ForegroundColor White
Write-Host ""
Write-Host "3. Create bucket (if not exists):" -ForegroundColor White
Write-Host "   - Name: $bucketName" -ForegroundColor Gray
Write-Host "   - Set public read policy" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Restart your Next.js development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test avatar upload at:" -ForegroundColor White
Write-Host "   http://localhost:3003/dashboard/admin/personas" -ForegroundColor Gray
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan

# Offer to test connection
Write-Host ""
$testConnection = Read-Host "Test MinIO connection now? (Y/N) [Y]"
if ([string]::IsNullOrWhiteSpace($testConnection) -or $testConnection -eq "Y") {
    Write-Host ""
    Write-Host "Testing connection to ${protocol}://${endpoint}:${port}..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "${protocol}://${endpoint}:${port}/minio/health/live" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ MinIO server is accessible!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Could not connect to MinIO server" -ForegroundColor Red
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "  - MinIO server is running" -ForegroundColor Gray
        Write-Host "  - Network/firewall allows connection" -ForegroundColor Gray
        Write-Host "  - Ports 9000 and 9001 are open" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""