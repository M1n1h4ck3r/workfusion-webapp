# Complete MinIO Self-Hosted Setup Guide

## Prerequisites
- A server with Docker installed OR MinIO binary
- Access to ports 9000 (API) and 9001 (Console)
- At least 10GB of storage space

## Step 1: Install MinIO Server

### Option A: Using Docker (Recommended)
```bash
# Create a directory for MinIO data
mkdir -p ~/minio/data

# Run MinIO with Docker
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v ~/minio/data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

### Option B: Using MinIO Binary
```bash
# Download MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio

# Create data directory
mkdir -p ~/minio/data

# Run MinIO
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin \
./minio server ~/minio/data --console-address :9001
```

### Option C: Using Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.7'

services:
  minio:
    image: quay.io/minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    restart: unless-stopped

volumes:
  minio_data:
```

Then run:
```bash
docker-compose up -d
```

## Step 2: Change Default Credentials (IMPORTANT!)

### Via MinIO Console:
1. Access MinIO Console at `http://YOUR_SERVER_IP:9001`
2. Login with default credentials:
   - Username: `minioadmin`
   - Password: `minioadmin`
3. Go to **Identity** → **Service Accounts**
4. Click **Create Service Account**
5. Save the generated Access Key and Secret Key

### Via MinIO Client (mc):
```bash
# Install MinIO Client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc

# Configure mc
./mc alias set myminio http://YOUR_SERVER_IP:9000 minioadmin minioadmin

# Create new access keys
./mc admin user add myminio YOUR_NEW_ACCESS_KEY YOUR_NEW_SECRET_KEY

# Give admin permissions
./mc admin policy set myminio readwrite user=YOUR_NEW_ACCESS_KEY
```

## Step 3: Create Bucket and Set Policies

### Via MinIO Console:
1. In MinIO Console, go to **Buckets**
2. Click **Create Bucket**
3. Name: `persona-avatars`
4. Click **Create**
5. Click on the bucket → **Access** → **Anonymous**
6. Set policy to allow public read:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::persona-avatars/*"]
    }
  ]
}
```

### Via MinIO Client:
```bash
# Create bucket
./mc mb myminio/persona-avatars

# Set public policy
./mc anonymous set download myminio/persona-avatars
```

## Step 4: Configure Your Application

### Update Environment Variables (.env.local):

```env
# MinIO Server Configuration
MINIO_ENDPOINT=YOUR_SERVER_IP        # e.g., 103.214.111.115 or localhost
MINIO_PORT=9000                      # API port
MINIO_USE_SSL=false                  # true if using HTTPS
MINIO_ACCESS_KEY=YOUR_ACCESS_KEY     # Your new access key
MINIO_SECRET_KEY=YOUR_SECRET_KEY     # Your new secret key
MINIO_BUCKET_NAME=persona-avatars    # Bucket name
MINIO_REGION=us-east-1               # Region (optional)

# MinIO Console (optional)
MINIO_CONSOLE_PORT=9001              # Console port

# Public URL Configuration
MINIO_PUBLIC_URL=http://YOUR_SERVER_IP:9000  # Full URL for serving images

# Image Processing Options
MINIO_MAX_IMAGE_SIZE=5242880         # Max size in bytes (5MB)
MINIO_IMAGE_QUALITY=85                # JPEG/WebP quality
MINIO_THUMBNAIL_SIZE=150              # Thumbnail size in pixels
```

## Step 5: Test MinIO Connection

### Create Test Script:
Create `test-minio.js`:
```javascript
const Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint: 'YOUR_SERVER_IP',
  port: 9000,
  useSSL: false,
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})

// Test connection
minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.error('Error connecting to MinIO:', err)
  } else {
    console.log('Connected successfully!')
    console.log('Buckets:', buckets)
  }
})
```

Run test:
```bash
node test-minio.js
```

## Step 6: Security Best Practices

### 1. Change Default Credentials Immediately
```bash
# Never use minioadmin/minioadmin in production!
docker exec -it minio sh
mc admin user add local NEW_ACCESS_KEY NEW_SECRET_KEY
mc admin policy set local readwrite user=NEW_ACCESS_KEY
```

### 2. Enable TLS/SSL
```bash
# Generate certificates
mkdir -p ~/.minio/certs
openssl genrsa -out ~/.minio/certs/private.key 2048
openssl req -new -x509 -days 3650 -key ~/.minio/certs/private.key \
  -out ~/.minio/certs/public.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=minio.local"

# Run MinIO with TLS
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=YOUR_ACCESS_KEY" \
  -e "MINIO_ROOT_PASSWORD=YOUR_SECRET_KEY" \
  -v ~/minio/data:/data \
  -v ~/.minio/certs:/root/.minio/certs \
  quay.io/minio/minio server /data --console-address ":9001"
```

### 3. Set Up Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
```

### 4. Use Strong Access Keys
Generate strong credentials:
```javascript
// Generate secure credentials
const crypto = require('crypto')

const accessKey = crypto.randomBytes(20).toString('hex')
const secretKey = crypto.randomBytes(40).toString('hex')

console.log('Access Key:', accessKey)
console.log('Secret Key:', secretKey)
```

## Step 7: Production Deployment

### Using Nginx Reverse Proxy:
```nginx
server {
    listen 80;
    server_name minio.yourdomain.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name storage.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Using systemd Service:
Create `/etc/systemd/system/minio.service`:
```ini
[Unit]
Description=MinIO
Documentation=https://min.io/docs/
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
Environment="MINIO_ROOT_USER=YOUR_ACCESS_KEY"
Environment="MINIO_ROOT_PASSWORD=YOUR_SECRET_KEY"
ExecStart=/usr/local/bin/minio server /data --console-address ":9001"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable minio
sudo systemctl start minio
```

## Step 8: Verify Your Setup

### Check MinIO Health:
```bash
curl http://YOUR_SERVER_IP:9000/minio/health/live
```

### Test Upload via Application:
1. Login to your application as admin
2. Go to `/dashboard/admin/personas`
3. Create a new persona
4. Upload an avatar image
5. Check if image appears and URL works

### Check Logs:
```bash
# Docker logs
docker logs minio

# Systemd logs
sudo journalctl -u minio -f
```

## Troubleshooting

### Connection Refused
- Check if MinIO is running: `docker ps` or `systemctl status minio`
- Verify ports are open: `netstat -an | grep 9000`
- Check firewall: `sudo ufw status`

### Access Denied
- Verify credentials in `.env.local` match MinIO configuration
- Check bucket policy allows public read
- Ensure access keys have correct permissions

### Images Not Loading
- Check MINIO_PUBLIC_URL is accessible from browser
- Verify bucket policy allows anonymous GetObject
- Test direct URL: `http://YOUR_SERVER_IP:9000/persona-avatars/test.jpg`

## Your Current Configuration

Based on your `.env.local`, update these values:

```env
# CHANGE THESE DEFAULT CREDENTIALS!
MINIO_ACCESS_KEY=minioadmin  # ⚠️ Change this!
MINIO_SECRET_KEY=minioadmin  # ⚠️ Change this!

# Your server details
MINIO_ENDPOINT=103.214.111.115
MINIO_PORT=9000
MINIO_PUBLIC_URL=http://103.214.111.115:9000
```

## Next Steps

1. **Change credentials immediately** - Never use default credentials
2. **Set up HTTPS** - Use SSL certificates for production
3. **Configure backups** - Set up regular data backups
4. **Monitor usage** - Track storage and bandwidth
5. **Set up alerts** - Configure monitoring for downtime

## Quick Commands Reference

```bash
# Check MinIO status
docker ps | grep minio

# View MinIO logs
docker logs -f minio

# Restart MinIO
docker restart minio

# Access MinIO shell
docker exec -it minio sh

# List buckets
mc ls myminio/

# Create bucket
mc mb myminio/bucket-name

# Set public policy
mc anonymous set download myminio/bucket-name
```