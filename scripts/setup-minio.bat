@echo off
echo Setting up MinIO for WorkFusion...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop and try again.
    echo.
    echo Alternative: Download MinIO binary from https://min.io/download
    echo Then run: minio.exe server C:\minio-data --console-address :9001
    pause
    exit /b 1
)

echo Starting MinIO container...
docker run -d ^
  -p 9000:9000 ^
  -p 9001:9001 ^
  --name workfusion-minio ^
  -e "MINIO_ROOT_USER=minioadmin" ^
  -e "MINIO_ROOT_PASSWORD=minioadmin" ^
  -v minio-data:/data ^
  quay.io/minio/minio server /data --console-address ":9001"

if %errorlevel% equ 0 (
    echo.
    echo ✅ MinIO is now running!
    echo.
    echo 📊 MinIO Console: http://localhost:9001
    echo 🔗 MinIO API: http://localhost:9000
    echo 👤 Username: minioadmin
    echo 🔑 Password: minioadmin
    echo.
    echo Next steps:
    echo 1. Open http://localhost:9001 in your browser
    echo 2. Login with the credentials above
    echo 3. Create a bucket named 'persona-avatars'
    echo 4. Set the bucket policy to public read if needed
    echo.
) else (
    echo ❌ Failed to start MinIO container
    echo Check if port 9000 or 9001 are already in use
)

pause