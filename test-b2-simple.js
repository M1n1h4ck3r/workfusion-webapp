// Simple Backblaze B2 Test
const AWS = require('aws-sdk')
require('dotenv').config({ path: '.env.local' })

console.log('🔧 Testing Backblaze B2 with simple connection...\n')

// Show configuration
console.log('Configuration:')
console.log('- Key ID:', process.env.B2_KEY_ID)
console.log('- App Key:', process.env.B2_APPLICATION_KEY?.substring(0, 10) + '...')
console.log('- Bucket:', process.env.B2_BUCKET_NAME)
console.log('- Bucket ID:', process.env.B2_BUCKET_ID)
console.log('- Region:', process.env.B2_REGION)
console.log('- Endpoint:', process.env.B2_ENDPOINT)
console.log('')

// Configure S3 client
const s3 = new AWS.S3({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APPLICATION_KEY,
  region: process.env.B2_REGION,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
})

// Simple test - just list buckets
console.log('Testing connection...')
s3.listBuckets((err, data) => {
  if (err) {
    console.error('❌ Connection failed!')
    console.error('Error code:', err.code)
    console.error('Error message:', err.message)
    console.error('Full error:', JSON.stringify(err, null, 2))
    
    if (err.code === 'InvalidAccessKeyId') {
      console.log('\n💡 Fix: Check your B2_KEY_ID - it might be incomplete')
      console.log('   Your Key ID should be longer (usually 12+ characters)')
    }
    if (err.code === 'SignatureDoesNotMatch') {
      console.log('\n💡 Fix: Check your B2_APPLICATION_KEY')
    }
  } else {
    console.log('✅ Connection successful!')
    console.log('\nBuckets found:')
    data.Buckets.forEach(bucket => {
      console.log(`  - ${bucket.Name}`)
    })
    
    // Now test specific bucket
    console.log(`\n🧪 Testing access to bucket: ${process.env.B2_BUCKET_NAME}`)
    s3.headBucket({ Bucket: process.env.B2_BUCKET_NAME }, (err2, data2) => {
      if (err2) {
        console.error('❌ Cannot access bucket:', err2.message)
      } else {
        console.log('✅ Bucket access confirmed!')
        
        // Test public URL format
        const testUrl = `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/test.jpg`
        console.log('\n📸 Avatar URLs will look like:')
        console.log(`   ${testUrl}`)
      }
    })
  }
})