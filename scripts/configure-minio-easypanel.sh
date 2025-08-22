#!/bin/bash

# MinIO Configuration Script for Easypanel
echo "================================================="
echo "🚀 MinIO Easypanel Configuration"
echo "================================================="
echo ""

# Configuration variables
MINIO_HOST="103.214.111.115:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
BUCKET_NAME="persona-avatars"

# Download MinIO Client if not exists
if ! command -v mc &> /dev/null; then
    echo "📥 Downloading MinIO Client..."
    curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    MC_CMD="./mc"
else
    MC_CMD="mc"
fi

echo "🔧 Configuring MinIO Client..."
$MC_CMD alias set easypanel http://$MINIO_HOST $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

echo "📦 Creating bucket '$BUCKET_NAME'..."
$MC_CMD mb easypanel/$BUCKET_NAME --ignore-existing

echo "🔓 Setting public access policy..."
$MC_CMD anonymous set download easypanel/$BUCKET_NAME

echo "✅ Configuration complete!"
echo ""
echo "Test URL: http://$MINIO_HOST/$BUCKET_NAME/"