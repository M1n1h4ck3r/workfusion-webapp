// Test MinIO Connection
const Minio = require('minio')
require('dotenv').config({ path: '.env.local' })

console.log('Testing MinIO connection...\n')

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
})

console.log('Configuration:')
console.log('- Endpoint:', process.env.MINIO_ENDPOINT)
console.log('- Port:', process.env.MINIO_PORT)
console.log('- Access Key:', process.env.MINIO_ACCESS_KEY?.substring(0, 8) + '...')
console.log('- Public URL:', process.env.MINIO_PUBLIC_URL)
console.log('')

// Test connection
minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.error('❌ Connection FAILED:', err.message)
    console.log('\nTroubleshooting:')
    console.log('1. Check if MinIO server is running')
    console.log('2. Verify credentials are correct')
    console.log('3. Ensure network allows connection')
    console.log('4. Check firewall settings')
    process.exit(1)
  } else {
    console.log('✅ Connected successfully!')
    console.log('\nBuckets found:')
    buckets.forEach(bucket => {
      console.log('  -', bucket.name)
    })
    
    // Check for persona-avatars bucket
    const bucketName = process.env.MINIO_BUCKET_NAME || 'persona-avatars'
    const bucketExists = buckets.some(b => b.name === bucketName)
    
    if (bucketExists) {
      console.log(`\n✅ Bucket '${bucketName}' exists`)
    } else {
      console.log(`\n⚠️  Bucket '${bucketName}' not found`)
      console.log('Creating bucket...')
      
      minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1', (err) => {
        if (err) {
          console.error('Failed to create bucket:', err)
        } else {
          console.log('✅ Bucket created successfully!')
          
          // Set public policy
          const policy = {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`]
            }]
          }
          
          minioClient.setBucketPolicy(bucketName, JSON.stringify(policy), (err) => {
            if (err) {
              console.error('Failed to set bucket policy:', err)
            } else {
              console.log('✅ Public read policy set!')
            }
          })
        }
      })
    }
  }
})