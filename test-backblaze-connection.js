// Test Backblaze B2 Connection
const AWS = require('aws-sdk')
require('dotenv').config({ path: '.env.local' })

console.log('Testing Backblaze B2 connection...\n')

// Configure AWS SDK for Backblaze B2
const s3 = new AWS.S3({
  endpoint: `https://${process.env.B2_ENDPOINT || 's3.us-west-002.backblazeb2.com'}`,
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APPLICATION_KEY,
  region: process.env.B2_REGION || 'us-west-002',
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
})

console.log('Configuration:')
console.log('- Endpoint:', process.env.B2_ENDPOINT)
console.log('- Key ID:', process.env.B2_KEY_ID?.substring(0, 8) + '...')
console.log('- Bucket Name:', process.env.B2_BUCKET_NAME)
console.log('- Region:', process.env.B2_REGION)
console.log('')

async function testConnection() {
  try {
    // Test 1: Check if bucket exists
    console.log('🧪 Test 1: Checking bucket access...')
    await s3.headBucket({ Bucket: process.env.B2_BUCKET_NAME }).promise()
    console.log('✅ Bucket access successful!\n')

    // Test 2: List objects in bucket
    console.log('🧪 Test 2: Listing objects in bucket...')
    const listResult = await s3.listObjectsV2({
      Bucket: process.env.B2_BUCKET_NAME,
      Prefix: 'avatars/',
      MaxKeys: 10
    }).promise()
    
    console.log(`✅ Found ${listResult.Contents?.length || 0} objects in avatars/ folder`)
    if (listResult.Contents && listResult.Contents.length > 0) {
      listResult.Contents.forEach(obj => {
        console.log(`   - ${obj.Key} (${(obj.Size / 1024).toFixed(1)}KB)`)
      })
    }
    console.log('')

    // Test 3: Upload a test file
    console.log('🧪 Test 3: Testing file upload...')
    const testContent = Buffer.from('WorkFusion B2 Test File - ' + new Date().toISOString())
    const testKey = `test/connection-test-${Date.now()}.txt`
    
    await s3.upload({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read'
    }).promise()
    
    console.log('✅ Test file uploaded successfully!')
    
    // Generate public URL
    const publicUrl = `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/${testKey}`
    console.log(`   Public URL: ${publicUrl}`)
    console.log('')

    // Test 4: Download the test file
    console.log('🧪 Test 4: Testing file download...')
    const downloadResult = await s3.getObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: testKey
    }).promise()
    
    console.log('✅ Test file downloaded successfully!')
    console.log(`   Content: ${downloadResult.Body.toString().substring(0, 50)}...`)
    console.log('')

    // Test 5: Delete the test file
    console.log('🧪 Test 5: Cleaning up test file...')
    await s3.deleteObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: testKey
    }).promise()
    
    console.log('✅ Test file deleted successfully!')
    console.log('')

    // Success summary
    console.log('🎉 All tests passed! Backblaze B2 is configured correctly.')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Restart your Next.js server: npm run dev')
    console.log('2. Test avatar upload at: http://localhost:3003/dashboard/admin/personas')
    console.log('3. Create a new persona and upload an avatar image')
    console.log('')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    
    if (error.code === 'CredentialsError' || error.code === 'InvalidAccessKeyId') {
      console.log('- Check your B2_KEY_ID and B2_APPLICATION_KEY in .env.local')
      console.log('- Verify the application key has read/write permissions')
    } else if (error.code === 'NoSuchBucket') {
      console.log('- Check your B2_BUCKET_NAME in .env.local')
      console.log('- Verify the bucket exists in your Backblaze account')
    } else if (error.code === 'AccessDenied') {
      console.log('- Check application key permissions')
      console.log('- Ensure bucket is set to "Public" for avatar uploads')
    } else if (error.code === 'NetworkingError' || (error.message && error.message.includes('ENOTFOUND'))) {
      console.log('- Check your internet connection')
      console.log('- Verify B2_ENDPOINT is correct for your region')
    } else {
      console.log('- Check all environment variables are set correctly')
      console.log('- Verify Backblaze B2 service is operational')
    }
    
    console.log('')
    console.log('Environment variables to check:')
    console.log('- B2_KEY_ID:', process.env.B2_KEY_ID ? '✅ Set' : '❌ Missing')
    console.log('- B2_APPLICATION_KEY:', process.env.B2_APPLICATION_KEY ? '✅ Set' : '❌ Missing')
    console.log('- B2_BUCKET_NAME:', process.env.B2_BUCKET_NAME ? '✅ Set' : '❌ Missing')
    console.log('- B2_ENDPOINT:', process.env.B2_ENDPOINT ? '✅ Set' : '❌ Missing')
    console.log('')
  }
}

// Run the test
testConnection()