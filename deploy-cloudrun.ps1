<#
.SYNOPSIS
    Automated Google Cloud Run deployment for Orbit Microservices Stack.
.DESCRIPTION
    Deploys all microservices in topological order, captures their Cloud Run URLs,
    injects them into downstream services, builds the production frontend, and updates CORS.
.EXAMPLE
    .\deploy-cloudrun.ps1 -ProjectId "my-gcp-project" -Region "us-central1" -MongoUri "mongodb+srv://..." -RedisUrl "rediss://..." -JwtSecret "secret123"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",

    [Parameter(Mandatory=$true)]
    [string]$MongoUri,

    [Parameter(Mandatory=$true)]
    [string]$RedisUrl,

    [Parameter(Mandatory=$true)]
    [string]$JwtSecret,

    [Parameter(Mandatory=$false)]
    [string]$LiveKitUrl = "",

    [Parameter(Mandatory=$false)]
    [string]$LiveKitApiKey = "",

    [Parameter(Mandatory=$false)]
    [string]$LiveKitApiSecret = "",

    [Parameter(Mandatory=$false)]
    [string]$IkPubKey = "",

    [Parameter(Mandatory=$false)]
    [string]$IkPrivKey = "",

    [Parameter(Mandatory=$false)]
    [string]$IkUrl = ""
)

$ErrorActionPreference = "Stop"

Write-Host "==> Setting active GCP project to $ProjectId..." -ForegroundColor Cyan
gcloud config set project $ProjectId

Write-Host "==> Enabling required Google Cloud APIs..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# Helper to retrieve deployed service URL
function Get-ServiceUrl ($serviceName) {
    return (gcloud run services describe $serviceName --region $Region --format="value(status.url)").Trim()
}

# 1. Guild Service
Write-Host "==> [1/7] Deploying orbit-guild-service..." -ForegroundColor Cyan
gcloud run deploy orbit-guild-service `
    --source ./services/guild-service `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,MONGO_URI=$MongoUri,JWT_SECRET=$JwtSecret,IK_PUB_KEY=$IkPubKey,IK_PRIV_KEY=$IkPrivKey,IK_URL_END_POINT=$IkUrl"
$GuildUrl = Get-ServiceUrl "orbit-guild-service"
Write-Host "  -> Guild Service URL: $GuildUrl" -ForegroundColor Green

# 2. Auth Service
Write-Host "==> [2/7] Deploying orbit-auth-service..." -ForegroundColor Cyan
gcloud run deploy orbit-auth-service `
    --source ./services/auth-service `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,MONGO_URI=$MongoUri,REDIS_URL=$RedisUrl,JWT_SECRET=$JwtSecret,IK_PUB_KEY=$IkPubKey,IK_PRIV_KEY=$IkPrivKey,IK_URL_END_POINT=$IkUrl"
$AuthUrl = Get-ServiceUrl "orbit-auth-service"
Write-Host "  -> Auth Service URL: $AuthUrl" -ForegroundColor Green

# 3. Voice Service
Write-Host "==> [3/7] Deploying orbit-voice-service..." -ForegroundColor Cyan
gcloud run deploy orbit-voice-service `
    --source ./services/voice-service `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,JWT_SECRET=$JwtSecret,LIVEKIT_URL=$LiveKitUrl,LIVEKIT_API_KEY=$LiveKitApiKey,LIVEKIT_API_SECRET=$LiveKitApiSecret"
$VoiceUrl = Get-ServiceUrl "orbit-voice-service"
Write-Host "  -> Voice Service URL: $VoiceUrl" -ForegroundColor Green

# 4. Messaging Service (WebSockets enabled)
Write-Host "==> [4/7] Deploying orbit-messaging-service (Session Affinity & WebSocket timeout)..." -ForegroundColor Cyan
gcloud run deploy orbit-messaging-service `
    --source ./services/messaging-service `
    --region $Region `
    --allow-unauthenticated `
    --session-affinity `
    --timeout 3600 `
    --min-instances 1 `
    --set-env-vars "NODE_ENV=production,MONGO_URI=$MongoUri,REDIS_URL=$RedisUrl,JWT_SECRET=$JwtSecret,GUILD_SERVICE_URL=$GuildUrl"
$MessagingUrl = Get-ServiceUrl "orbit-messaging-service"
Write-Host "  -> Messaging Service URL: $MessagingUrl" -ForegroundColor Green

# 5. Friends Service (WebSockets for DMs)
Write-Host "==> [5/7] Deploying orbit-friends-service (Session Affinity & WebSocket timeout)..." -ForegroundColor Cyan
gcloud run deploy orbit-friends-service `
    --source ./services/friends-service `
    --region $Region `
    --allow-unauthenticated `
    --session-affinity `
    --timeout 3600 `
    --min-instances 1 `
    --set-env-vars "NODE_ENV=production,MONGO_URI=$MongoUri,JWT_SECRET=$JwtSecret"
$FriendsUrl = Get-ServiceUrl "orbit-friends-service"
Write-Host "  -> Friends Service URL: $FriendsUrl" -ForegroundColor Green

# 6. API Gateway
Write-Host "==> [6/7] Deploying orbit-api-gateway..." -ForegroundColor Cyan
gcloud run deploy orbit-api-gateway `
    --source ./services/api-gateway `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,JWT_SECRET=$JwtSecret,AUTH_SERVICE_URL=$AuthUrl,GUILD_SERVICE_URL=$GuildUrl,MESSAGING_SERVICE_URL=$MessagingUrl,FRIENDS_SERVICE_URL=$FriendsUrl,VOICE_SERVICE_URL=$VoiceUrl"
$GatewayUrl = Get-ServiceUrl "orbit-api-gateway"
Write-Host "  -> API Gateway URL: $GatewayUrl" -ForegroundColor Green

# 7. Frontend Client (Production Nginx Container)
Write-Host "==> [7/7] Building and deploying orbit-client..." -ForegroundColor Cyan
$ImageTag = "gcr.io/$ProjectId/orbit-client:latest"

gcloud builds submit ./client `
    --dockerfile=./client/Dockerfile.prod `
    --substitutions=_VITE_API_URL="$GatewayUrl/api",_VITE_SOCKET_URL="$MessagingUrl",_VITE_FRIENDS_SOCKET_URL="$FriendsUrl" `
    --tag $ImageTag

gcloud run deploy orbit-client `
    --image $ImageTag `
    --region $Region `
    --allow-unauthenticated `
    --port 8080

$ClientUrl = Get-ServiceUrl "orbit-client"
Write-Host "  -> Client Frontend URL: $ClientUrl" -ForegroundColor Green

# 8. Update CORS whitelist on Gateway and WebSockets with Client URL
Write-Host "==> Synchronizing CLIENT_URL CORS whitelist..." -ForegroundColor Cyan
gcloud run services update orbit-api-gateway --update-env-vars "CLIENT_URL=$ClientUrl" --region $Region
gcloud run services update orbit-messaging-service --update-env-vars "CLIENT_URL=$ClientUrl" --region $Region
gcloud run services update orbit-friends-service --update-env-vars "CLIENT_URL=$ClientUrl" --region $Region

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Orbit Deployment Complete!" -ForegroundColor Green
Write-Host " Open Orbit at: $ClientUrl" -ForegroundColor Green
Write-Host " API Gateway:   $GatewayUrl" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
