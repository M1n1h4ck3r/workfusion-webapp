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
      } catch {
        // Thumbnail might not exist, ignore error
      }

      return true
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return false
    }
  }

  // List all avatars for a persona
  static async listAvatars(personaId: string): Promise<string[]> {
    try {
      const client = this.getClient()
      const bucketName = this.config.bucketName
      const prefix = `avatars/${personaId}/`
      
      const objectsList: string[] = []
      const stream = client.listObjectsV2(bucketName, prefix, true)

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name && !obj.name.includes('_thumb')) {
            objectsList.push(obj.name)
          }
        })
        stream.on('error', reject)
        stream.on('end', () => resolve(objectsList))
      })
    } catch (error) {
      console.error('Error listing avatars:', error)
      return []
    }
  }

  // Get public URL for an object
  static getPublicUrl(objectName: string): string {
    const protocol = this.config.useSSL ? 'https' : 'http'
    const port = this.config.port === 80 || this.config.port === 443 ? '' : `:${this.config.port}`
    return `${protocol}://${this.config.endPoint}${port}/${this.config.bucketName}/${objectName}`
  }

  // Get presigned URL for temporary access
  static async getPresignedUrl(
    objectName: string,
    expiry: number = 3600
  ): Promise<string> {
    try {
      const client = this.getClient()
      return await client.presignedGetObject(
        this.config.bucketName,
        objectName,
        expiry
      )
    } catch (error) {
      console.error('Error generating presigned URL:', error)
      throw error
    }
  }

  // Copy avatar from one persona to another
  static async copyAvatar(
    sourcePersonaId: string,
    targetPersonaId: string,
    filename: string
  ): Promise<string> {
    try {
      const client = this.getClient()
      const bucketName = this.config.bucketName
      
      const sourceKey = `avatars/${sourcePersonaId}/${filename}`
      const targetKey = `avatars/${targetPersonaId}/${Date.now()}_${filename}`

      await client.copyObject(
        bucketName,
        targetKey,
        `/${bucketName}/${sourceKey}`
      )

      return this.getPublicUrl(targetKey)
    } catch (error) {
      console.error('Error copying avatar:', error)
      throw error
    }
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

  // Get storage statistics
  static async getStorageStats(): Promise<{
    totalSize: number
    objectCount: number
    buckets: string[]
  }> {
    try {
      const client = this.getClient()
      
      // Get list of buckets
      const buckets = await client.listBuckets()
      const bucketNames = buckets.map(b => b.name)

      // Get stats for persona avatars bucket
      let totalSize = 0
      let objectCount = 0
      
      const stream = client.listObjectsV2(
        this.config.bucketName,
        '',
        true
      )

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          objectCount++
          totalSize += obj.size || 0
        })
        stream.on('error', reject)
        stream.on('end', () => {
          resolve({
            totalSize,
            objectCount,
            buckets: bucketNames
          })
        })
      })
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return {
        totalSize: 0,
        objectCount: 0,
        buckets: []
      }
    }
  }

  // Bulk delete avatars
  static async bulkDeleteAvatars(objectNames: string[]): Promise<boolean> {
    try {
      const client = this.getClient()
      await client.removeObjects(this.config.bucketName, objectNames)
      return true
    } catch (error) {
      console.error('Error bulk deleting avatars:', error)
      return false
    }
  }

  // Migrate from Supabase to MinIO
  static async migrateFromSupabase(
    supabaseUrl: string,
    personaId: string
  ): Promise<string | null> {
    try {
      // Fetch image from Supabase
      const response = await fetch(supabaseUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch image from Supabase')
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = supabaseUrl.split('/').pop() || 'avatar.webp'

      // Upload to MinIO
      const result = await this.uploadAvatar(
        personaId,
        buffer,
        filename,
        { format: 'webp' }
      )

      return result.url
    } catch (error) {
      console.error('Error migrating from Supabase:', error)
      return null
    }
  }
}

// Export convenience functions
export const uploadPersonaAvatar = MinIOService.uploadAvatar.bind(MinIOService)
export const deletePersonaAvatar = MinIOService.deleteAvatar.bind(MinIOService)
export const getAvatarUrl = MinIOService.getPublicUrl.bind(MinIOService)
export const ensureMinIOBucket = MinIOService.ensureBucket.bind(MinIOService)