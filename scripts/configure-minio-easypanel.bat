@echo off
echo =================================================
echo 🚀 MinIO Easypanel Configuration
echo =================================================
echo.

REM Configuration variables
set MINIO_HOST=103.214.111.115:9000
set MINIO_ACCESS_KEY=minioadmin
set MINIO_SECRET_KEY=minioadmin
set BUCKET_NAME=persona-avatars

REM Download MinIO Client for Windows
if not exist mc.exe (
    echo 📥 Downloading MinIO Client for Windows...
    curl -O https://dl.min.io/client/mc/release/windows-amd64/mc.exe
)

echo 🔧 Configuring MinIO Client...
mc.exe alias set easypanel http://%MINIO_HOST% %MINIO_ACCESS_KEY% %MINIO_SECRET_KEY%

echo 📦 Creating bucket '%BUCKET_NAME%'...
mc.exe mb easypanel/%BUCKET_NAME% --ignore-existing

echo 🔓 Setting public access policy...
mc.exe anonymous set download easypanel/%BUCKET_NAME%

echo ✅ Configuration complete!
echo.
echo Test URL: http://%MINIO_HOST%/%BUCKET_NAME%/
pause