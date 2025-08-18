// Server-side only MinIO service with Sharp
// This file should only be imported in API routes, not in client components

import * as Minio from 'minio'
import sharp from 'sharp'

// MinIO Configuration
export interface MinIOConfig {
  endPoint: string
  port: number
  useSSL: boolean
  accessKey: string
  secretKey: string
  bucketName: string
  region?: string
}

// Get configuration from environment variables
const getMinIOConfig = (): MinIOConfig => ({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET_NAME || 'persona-avatars',
  region: process.env.MINIO_REGION || 'us-east-1'
})

// Image upload options
export interface UploadOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  generateThumbnail?: boolean
}

// MinIO Service Class
export class MinIOService {
  private static client: Minio.Client | null = null
  private static config: MinIOConfig = getMinIOConfig()

  // Initialize MinIO client
  private static getClient(): Minio.Client {
    if (!this.client) {
      this.client = new Minio.Client({
        endPoint: this.config.endPoint,
        port: this.config.port,
        useSSL: this.config.useSSL,
        accessKey: this.config.accessKey,
        secretKey: this.config.secretKey,
        region: this.config.region
      })
    }
    return this.client
  }

  // Ensure bucket exists
  static async ensureBucket(): Promise<void> {
    const client = this.getClient()
    const bucketName = this.config.bucketName

    try {
      const exists = await client.bucketExists(bucketName)
      
      if (!exists) {
        await client.makeBucket(bucketName, this.config.region || 'us-east-1')
        console.log(`Bucket ${bucketName} created successfully`)

        // Set bucket policy to allow public read access for avatars
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`]
            }
          ]
        }

        await client.setBucketPolicy(bucketName, JSON.stringify(policy))
        console.log(`Public read policy set for bucket ${bucketName}`)
      }
    } catch (error) {
      console.error('Error ensuring bucket:', error)
      throw error
    }
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
  }

  // Upload avatar image
  static async uploadAvatar(
    personaId: string,
    file: Buffer | Uint8Array,
    filename: string,
    options: UploadOptions = {}
  ): Promise<{ url: string; thumbnailUrl?: string }> {
    try {
      await this.ensureBucket()
      
      const client = this.getClient()
      const bucketName = this.config.bucketName

      // Process image
      const processed = await this.processImage(Buffer.from(file), options)
      
      // Generate unique filenames
      const ext = options.format || 'webp'
      const timestamp = Date.now()
      const mainKey = `avatars/${personaId}/${timestamp}.${ext}`
      const thumbKey = `avatars/${personaId}/${timestamp}_thumb.${ext}`

      // Upload main image
      await client.putObject(
        bucketName,
        mainKey,
        processed.main,
        processed.main.length,
        {
          'Content-Type': `image/${ext}`,
          'Cache-Control': 'public, max-age=31536000',
          'x-amz-acl': 'public-read'
        }
      )

      // Upload thumbnail if generated
      let thumbnailUrl: string | undefined
      if (processed.thumbnail) {
        await client.putObject(
          bucketName,
          thumbKey,
          processed.thumbnail,
          processed.thumbnail.length,
          {
            'Content-Type': `image/${ext}`,
            'Cache-Control': 'public, max-age=31536000',
            'x-amz-acl': 'public-read'
          }
        )
        thumbnailUrl = this.getPublicUrl(thumbKey)
      }

      return {
        url: this.getPublicUrl(mainKey),
        thumbnailUrl
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  // Delete avatar image
  static async deleteAvatar(personaId: string, filename: string): Promise<boolean> {
    try {
      const client = this.getClient()
      const bucketName = this.config.bucketName

      // Delete main image
      await client.removeObject(bucketName, filename)

      // Try to delete thumbnail (if exists)
      const thumbFilename = filename.replace(/\.(\w+)$/, '_thumb.$1')
      try {
        await client.removeObject(bucketName, thumbFilename)
      } catch (err) {
        // Thumbnail might not exist, ignore error
      }

      return true
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return false
    }
  }

  // Get public URL for an object
  static getPublicUrl(objectName: string): string {
    const protocol = this.config.useSSL ? 'https' : 'http'
    const port = this.config.port === 80 || this.config.port === 443 ? '' : `:${this.config.port}`
    return `${protocol}://${this.config.endPoint}${port}/${this.config.bucketName}/${objectName}`
  }

  // Check if MinIO is accessible
  static async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient()
      await client.listBuckets()
      return true
    } catch (error) {
      console.error('MinIO health check failed:', error)
      return false
    }
  }
}

// Export convenience functions
export const uploadPersonaAvatar = MinIOService.uploadAvatar.bind(MinIOService)
export const deletePersonaAvatar = MinIOService.deleteAvatar.bind(MinIOService)
export const getAvatarUrl = MinIOService.getPublicUrl.bind(MinIOService)
export const ensureMinIOBucket = MinIOService.ensureBucket.bind(MinIOService)