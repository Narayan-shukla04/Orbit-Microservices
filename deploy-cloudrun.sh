#!/usr/bin/env bash
# ==============================================================================
# Automated Google Cloud Run deployment for Orbit Microservices Stack
# ==============================================================================
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Please set PROJECT_ID}"
REGION="${REGION:-us-central1}"
MONGO_URI="${MONGO_URI:?Please set MONGO_URI}"
REDIS_URL="${REDIS_URL:?Please set REDIS_URL}"
JWT_SECRET="${JWT_SECRET:?Please set JWT_SECRET}"

LIVEKIT_URL="${LIVEKIT_URL:-}"
LIVEKIT_API_KEY="${LIVEKIT_API_KEY:-}"
LIVEKIT_API_SECRET="${LIVEKIT_API_SECRET:-}"

IK_PUB_KEY="${IK_PUB_KEY:-}"
IK_PRIV_KEY="${IK_PRIV_KEY:-}"
IK_URL_END_POINT="${IK_URL_END_POINT:-}"

echo "==> Setting active GCP project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"

echo "==> Enabling required Google Cloud APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

get_url() {
  gcloud run services describe "$1" --region "$REGION" --format="value(status.url)"
}

# 1. Guild Service
echo "==> [1/7] Deploying orbit-guild-service..."
gcloud run deploy orbit-guild-service \
  --source ./services/guild-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGO_URI=$MONGO_URI,JWT_SECRET=$JWT_SECRET,IK_PUB_KEY=$IK_PUB_KEY,IK_PRIV_KEY=$IK_PRIV_KEY,IK_URL_END_POINT=$IK_URL_END_POINT"
GUILD_URL="$(get_url orbit-guild-service)"

# 2. Auth Service
echo "==> [2/7] Deploying orbit-auth-service..."
gcloud run deploy orbit-auth-service \
  --source ./services/auth-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGO_URI=$MONGO_URI,REDIS_URL=$REDIS_URL,JWT_SECRET=$JWT_SECRET,IK_PUB_KEY=$IK_PUB_KEY,IK_PRIV_KEY=$IK_PRIV_KEY,IK_URL_END_POINT=$IK_URL_END_POINT"
AUTH_URL="$(get_url orbit-auth-service)"

# 3. Voice Service
echo "==> [3/7] Deploying orbit-voice-service..."
gcloud run deploy orbit-voice-service \
  --source ./services/voice-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,JWT_SECRET=$JWT_SECRET,LIVEKIT_URL=$LIVEKIT_URL,LIVEKIT_API_KEY=$LIVEKIT_API_KEY,LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET"
VOICE_URL="$(get_url orbit-voice-service)"

# 4. Messaging Service (WebSockets)
echo "==> [4/7] Deploying orbit-messaging-service..."
gcloud run deploy orbit-messaging-service \
  --source ./services/messaging-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --session-affinity \
  --timeout 3600 \
  --min-instances 1 \
  --set-env-vars "NODE_ENV=production,MONGO_URI=$MONGO_URI,REDIS_URL=$REDIS_URL,JWT_SECRET=$JWT_SECRET,GUILD_SERVICE_URL=$GUILD_URL"
MESSAGING_URL="$(get_url orbit-messaging-service)"

# 5. Friends Service (WebSockets)
echo "==> [5/7] Deploying orbit-friends-service..."
gcloud run deploy orbit-friends-service \
  --source ./services/friends-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --session-affinity \
  --timeout 3600 \
  --min-instances 1 \
  --set-env-vars "NODE_ENV=production,MONGO_URI=$MONGO_URI,JWT_SECRET=$JWT_SECRET"
FRIENDS_URL="$(get_url orbit-friends-service)"

# 6. API Gateway
echo "==> [6/7] Deploying orbit-api-gateway..."
gcloud run deploy orbit-api-gateway \
  --source ./services/api-gateway \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,JWT_SECRET=$JWT_SECRET,AUTH_SERVICE_URL=$AUTH_URL,GUILD_SERVICE_URL=$GUILD_URL,MESSAGING_SERVICE_URL=$MESSAGING_URL,FRIENDS_SERVICE_URL=$FRIENDS_URL,VOICE_SERVICE_URL=$VOICE_URL"
GATEWAY_URL="$(get_url orbit-api-gateway)"

# 7. Frontend Client
echo "==> [7/7] Building and deploying orbit-client..."
IMAGE_TAG="gcr.io/$PROJECT_ID/orbit-client:latest"
gcloud builds submit ./client \
  --substitutions=_VITE_API_URL="$GATEWAY_URL/api",_VITE_SOCKET_URL="$MESSAGING_URL",_VITE_FRIENDS_SOCKET_URL="$FRIENDS_URL" \
  --tag "$IMAGE_TAG"

gcloud run deploy orbit-client \
  --image "$IMAGE_TAG" \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080
CLIENT_URL="$(get_url orbit-client)"

# 8. Update CORS
echo "==> Updating CORS whitelist on services..."
gcloud run services update orbit-api-gateway --update-env-vars "CLIENT_URL=$CLIENT_URL" --region "$REGION"
gcloud run services update orbit-messaging-service --update-env-vars "CLIENT_URL=$CLIENT_URL" --region "$REGION"
gcloud run services update orbit-friends-service --update-env-vars "CLIENT_URL=$CLIENT_URL" --region "$REGION"

echo "=========================================================="
echo " Orbit Deployment Complete!"
echo " Client URL:  $CLIENT_URL"
echo " Gateway URL: $GATEWAY_URL"
echo "=========================================================="
