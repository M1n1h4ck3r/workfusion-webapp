# Backblaze B2 Setup Guide for WorkFusion

## Why Backblaze B2?

✅ **Much simpler than self-hosted MinIO**  
✅ **S3-compatible API** - works with existing AWS SDK  
✅ **$6/TB/month** - very cost-effective  
✅ **No server maintenance** required  
✅ **Built-in CDN** capabilities  
✅ **99.9% uptime SLA**  

## Step-by-Step Setup

### Step 1: Create Backblaze B2 Account

1. Go to [backblaze.com/b2](https://www.backblaze.com/b2/cloud-storage.html)
2. Click **"Sign Up"** 
3. Create your account
4. **Get 10GB free storage** to start

### Step 2: Create Application Key

1. Login to Backblaze B2 Console
2. Go to **"App Keys"** in the left sidebar
3. Click **"Add a New Application Key"**
4. Configure:
   - **Key Name**: `workfusion-storage`
   - **Allow access to Bucket(s)**: Select specific bucket (create first) or "All"
   - **Type of Access**: Read and Write
   - **Allow List All Bucket Names**: ✅ (recommended)
5. Click **"Create New Key"**
6. **⚠️ IMPORTANT**: Copy and save the credentials immediately:
   - **Key ID**: `004abc123def456...`
   - **Application Key**: `K004xyz789abc123...`

### Step 3: Create Storage Bucket

1. In Backblaze Console, go to **"Buckets"**
2. Click **"Create a Bucket"**
3. Configure:
   - **Bucket Name**: `workfusion-avatars` (must be globally unique)
   - **Files in Bucket are**: **Public** ✅
   - **Default Encryption**: Disabled (for public files)
   - **Object Lock**: Disabled
4. Click **"Create a Bucket"**
5. **Copy the Bucket ID** (will look like: `a1b2c3d4e5f6`)

### Step 4: Configure CORS (Optional)

If you need browser uploads:

1. Click on your bucket
2. Go to **"Bucket Settings"**
3. Add CORS rules:
```json
[
  {
    "corsRuleName": "workfusion-cors",
    "allowedOrigins": [
      "http://localhost:3003",
      "https://yourdomain.com"
    ],
    "allowedOperations": [
      "s3_get",
      "s3_put",
      "s3_head"
    ],
    "allowedHeaders": [
      "*"
    ],
    "exposeHeaders": [],
    "maxAgeSeconds": 3600
  }
]
```

### Step 5: Update Your Environment Variables

Edit your `.env.local` file:

```env
# Backblaze B2 Configuration
B2_KEY_ID=004abc123def456789         # Your Key ID
B2_APPLICATION_KEY=K004xyz789abc123  # Your Application Key  
B2_BUCKET_NAME=workfusion-avatars    # Your bucket name
B2_BUCKET_ID=a1b2c3d4e5f6           # Your bucket ID
B2_REGION=us-west-002                # Your region
B2_ENDPOINT=s3.us-west-002.backblazeb2.com

# Image Processing Options
B2_MAX_IMAGE_SIZE=5242880    # 5MB max file size
B2_IMAGE_QUALITY=85          # Image quality (1-100)
B2_THUMBNAIL_SIZE=150        # Thumbnail size in pixels
```

### Step 6: Test Your Configuration

Run the test script:

```bash
node test-backblaze-connection.js
```

## Regions and Endpoints

Choose the region closest to your users:

| Region | Endpoint |
|--------|----------|
| US West | `s3.us-west-002.backblazeb2.com` |
| US East | `s3.us-east-005.backblazeb2.com` |
| EU Central | `s3.eu-central-003.backblazeb2.com` |

## Public URL Format

Your files will be accessible at:
```
https://[bucket-name].s3.[region].backblazeb2.com/[file-path]
```

Example:
```
https://workfusion-avatars.s3.us-west-002.backblazeb2.com/avatars/persona-123/avatar.webp
```

## Cost Breakdown

**Backblaze B2 Pricing** (as of 2024):
- **Storage**: $6/TB/month
- **Downloads**: $10/TB (first 1GB/day free)
- **API Calls**: Very low cost

**Example Monthly Cost for 1000 Users**:
- 1000 avatar images × 100KB = 100MB storage = **$0.60/month**
- Download traffic (10GB/month) = **$1.00/month**  
- **Total: ~$1.60/month** 

Compare to AWS S3: ~$4-6/month for same usage.

## Security Best Practices

### 1. Use Restricted Application Keys
- Create separate keys for different environments
- Limit access to specific buckets only
- Use different keys for read vs read/write access

### 2. Enable Lifecycle Rules
```json
{
  "fileNamePrefix": "temp/",
  "daysFromHidingToDeleting": 1,
  "daysFromUploadingToHiding": null
}
```

### 3. Monitor Usage
- Set up budget alerts in Backblaze console
- Monitor API usage and costs
- Review access logs regularly

## Migration from MinIO

If you have existing MinIO data:

1. **Export from MinIO**:
   ```bash
   mc mirror minio-server/persona-avatars ./backup/
   ```

2. **Upload to Backblaze**:
   ```bash
   # Using rclone or aws cli
   aws s3 sync ./backup/ s3://workfusion-avatars/ --endpoint-url=https://s3.us-west-002.backblazeb2.com
   ```

## Troubleshooting

### Authentication Errors
- Verify Key ID and Application Key are correct
- Check the key has read/write permissions
- Ensure bucket name matches exactly

### Upload Failures
- Check file size limits (B2_MAX_IMAGE_SIZE)
- Verify supported image formats
- Test with smaller files first

### CORS Issues
- Add your domain to CORS configuration
- Include both HTTP and HTTPS origins
- Check browser developer tools for specific CORS errors

### Connection Issues
- Test endpoint connectivity: `ping s3.us-west-002.backblazeb2.com`
- Try different region endpoints
- Check firewall/proxy settings

## Support

- **Backblaze B2 Docs**: https://www.backblaze.com/b2/docs/
- **AWS S3 Compatibility**: https://www.backblaze.com/b2/docs/s3_compatible_api.html
- **Backblaze Support**: Available through their console

## Next Steps After Setup

1. **Test avatar uploads** in your application
2. **Monitor costs** in Backblaze console  
3. **Set up backup strategy** for important data
4. **Configure CDN** (Cloudflare) for better performance
5. **Implement image optimization** pipeline