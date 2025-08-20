@echo off
echo MinIO Setup for WorkFusion (Easypanel Deployment)
echo.

echo ℹ️  MinIO is hosted on Easypanel - no local setup required!
echo.
echo To configure your Easypanel MinIO instance:
echo.
echo 1. 🌐 Access your Easypanel dashboard
echo 2. 📦 Navigate to your MinIO service
echo 3. 🔑 Copy the access credentials
echo 4. 📝 Update your .env.local file with:
echo    - MINIO_ENDPOINT=your_easypanel_minio_domain.com
echo    - MINIO_ACCESS_KEY=your_access_key
echo    - MINIO_SECRET_KEY=your_secret_key
echo    - MINIO_PUBLIC_URL=https://your_easypanel_minio_domain.com
echo.
echo 5. 🗂️  Create a bucket named 'persona-avatars' in MinIO console
echo 6. 🔓 Set bucket policy to public read for avatar access
echo.
echo Required bucket policy for public access:
echo {
echo   "Version": "2012-10-17",
echo   "Statement": [
echo     {
echo       "Effect": "Allow",
echo       "Principal": {"AWS": "*"},
echo       "Action": "s3:GetObject",
echo       "Resource": "arn:aws:s3:::persona-avatars/*"
echo     }
echo   ]
echo }
echo.
echo 🚀 Once configured, your WorkFusion app will automatically use
echo    the Easypanel MinIO for avatar storage and file uploads!

pause