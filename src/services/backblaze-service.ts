// Backblaze B2 Storage Service
// Compatible with S3 API for easy integration

import AWS from 'aws-sdk'
import sharp from 'sharp'

// Backblaze B2 Configuration
export interface BackblazeConfig {
  keyId: string
  applicationKey: string
  bucketName: string
  bucketId: string
  region: string
  endpoint: string
}

// Get configuration from environment variables
const getBackblazeConfig = (): BackblazeConfig => ({
  keyId: process.env.B2_KEY_ID || '',
  applicationKey: process.env.B2_APPLICATION_KEY || '',
  bucketName: process.env.B2_BUCKET_NAME || 'workfusion-avatars',
  bucketId: process.env.B2_BUCKET_ID || '',
  region: process.env.B2_REGION || 'us-west-002',
  endpoint: process.env.B2_ENDPOINT || 's3.us-west-002.backblazeb2.com'
})

// Image upload options
export interface UploadOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  generateThumbnail?: boolean
}

// Backblaze B2 Service Class using S3-compatible API
export class BackblazeService {
  private static s3Client: AWS.S3 | null = null
  private static config: BackblazeConfig = getBackblazeConfig()

  // Initialize S3 client for Backblaze B2
  private static getS3Client(): AWS.S3 {
    if (!this.s3Client) {
      this.s3Client = new AWS.S3({
        endpoint: `https://${this.config.endpoint}`,
        accessKeyId: this.config.keyId,
        secretAccessKey: this.config.applicationKey,
        region: this.config.region,
        s3ForcePathStyle: true, // Required for Backblaze B2
        signatureVersion: 'v4'
      })
    }
    return this.s3Client
  }

  // Process image before upload
  private static async processImage(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<{ main: Buffer; thumbnail?: Buffer }> {
    const {
      maxWidth = 500,
      maxHeight = 500,
      quality = 85,
      format = 'webp',
      generateThumbnail = true
    } = options

    try {
      // Process main image
      const mainImage = await sharp(buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFormat(format, { quality })
        .toBuffer()

      // Generate thumbnail if requested
      let thumbnail: Buffer | undefined
      if (generateThumbnail) {
        thumbnail = await sharp(buffer)
          .resize(150, 150, {
            fit: 'cover',
            position: 'center'
          })
          .toFormat(format, { quality: 70 })
          .toBuffer()
      }

      return { main: mainImage, thumbnail }
    } catch (error) {
      console.error('Error processing image:', error)
      throw error
    }
  }

  // Upload avatar image to Backblaze B2
  static async uploadAvatar(
    personaId: string,
    file: Buffer | Uint8Array,
    filename: string,
    options: UploadOptions = {}
  ): Promise<{ url: string; thumbnailUrl?: string }> {
    try {
      const s3 = this.getS3Client()
      
      // Process image
      const processed = await this.processImage(Buffer.from(file), options)
      
      // Generate unique filenames
      const ext = options.format || 'webp'
      const timestamp = Date.now()
      const mainKey = `avatars/${personaId}/${timestamp}.${ext}`
      const thumbKey = `avatars/${personaId}/${timestamp}_thumb.${ext}`

      // Upload main image
      await s3.upload({
        Bucket: this.config.bucketName,
        Key: mainKey,
        Body: processed.main,
        ContentType: `image/${ext}`,
        CacheControl: 'public, max-age=31536000',
        ACL: 'public-read'
      }).promise()

      // Upload thumbnail if generated
      let thumbnailUrl: string | undefined
      if (processed.thumbnail) {
        await s3.upload({
          Bucket: this.config.bucketName,
          Key: thumbKey,
          Body: processed.thumbnail,
          ContentType: `image/${ext}`,
          CacheControl: 'public, max-age=31536000',
          ACL: 'public-read'
        }).promise()
        
        thumbnailUrl = this.getPublicUrl(thumbKey)
      }

      return {
        url: this.getPublicUrl(mainKey),
        thumbnailUrl
      }
    } catch (error) {
      console.error('Error uploading avatar to Backblaze B2:', error)
      throw error
    }
  }

  // Delete avatar image from Backblaze B2
  static async deleteAvatar(personaId: string, filename: string): Promise<boolean> {
    try {
      const s3 = this.getS3Client()

      // Delete main image
      await s3.deleteObject({
        Bucket: this.config.bucketName,
        Key: filename
      }).promise()

      // Try to delete thumbnail (if exists)
      const thumbFilename = filename.replace(/\.(\w+)$/, '_thumb.$1')
      try {
        await s3.deleteObject({
          Bucket: this.config.bucketName,
          Key: thumbFilename
        }).promise()
      } catch (err) {
        // Thumbnail might not exist, ignore error
        console.warn('Thumbnail deletion failed (might not exist):', err)
      }

      return true
    } catch (error) {
      console.error('Error deleting avatar from Backblaze B2:', error)
      return false
    }
  }

  // Get public URL for an object
  static getPublicUrl(objectKey: string): string {
    return `https://${this.config.bucketName}.${this.config.endpoint}/${objectKey}`
  }

  // Check if Backblaze B2 is accessible
  static async healthCheck(): Promise<boolean> {
    try {
      const s3 = this.getS3Client()
      await s3.headBucket({ Bucket: this.config.bucketName }).promise()
      return true
    } catch (error) {
      console.error('Backblaze B2 health check failed:', error)
      return false
    }
  }

  // List objects in bucket (for debugging)
  static async listObjects(prefix?: string): Promise<AWS.S3.Object[]> {
    try {
      const s3 = this.getS3Client()
      const result = await s3.listObjectsV2({
        Bucket: this.config.bucketName,
        Prefix: prefix || 'avatars/',
        MaxKeys: 100
      }).promise()
      
      return result.Contents || []
    } catch (error) {
      console.error('Error listing objects:', error)
      return []
    }
  }

  // Get signed URL for temporary access (if needed)
  static getSignedUrl(objectKey: string, expiresIn: number = 3600): string {
    const s3 = this.getS3Client()
    return s3.getSignedUrl('getObject', {
      Bucket: this.config.bucketName,
      Key: objectKey,
      Expires: expiresIn
    })
  }

  // Migrate from MinIO to Backblaze B2 (helper function)
  static async migrateFromMinIO(minioUrl: string): Promise<void> {
    console.log('Migration from MinIO should be performed via separate script')
    // This would be implemented as a separate migration script
  }

  // Get bucket info
  static async getBucketInfo(): Promise<AWS.S3.GetBucketLocationOutput> {
    try {
      const s3 = this.getS3Client()
      const result = await s3.getBucketLocation({ Bucket: this.config.bucketName }).promise()
      return result
    } catch (error) {
      console.error('Error getting bucket info:', error)
      throw error
    }
  }
}

// Export convenience functions
export const uploadPersonaAvatar = BackblazeService.uploadAvatar.bind(BackblazeService)
export const deletePersonaAvatar = BackblazeService.deleteAvatar.bind(BackblazeService)
export const getAvatarUrl = BackblazeService.getPublicUrl.bind(BackblazeService)
export const checkBackblazeHealth = BackblazeService.healthCheck.bind(BackblazeService)