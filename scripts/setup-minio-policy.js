#!/usr/bin/env node

/**
 * MinIO Bucket Policy Setup Script
 * 
 * This script configures MinIO bucket permissions to allow public read access.
 * Use this when the MinIO console doesn't allow changing bucket visibility.
 * 
 * Usage:
 *   node scripts/setup-minio-policy.js
 *   
 * Or with custom endpoint:
 *   MINIO_ENDPOINT=your-server.com node scripts/setup-minio-policy.js
 */

const Minio = require('minio')
require('dotenv').config({ path: '.env.local' })

// Configuration from environment variables
const config = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET_NAME || 'persona-avatars',
  region: process.env.MINIO_REGION || 'us-east-1'
}

// Public read policy for the bucket
const publicReadPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicRead',
      Effect: 'Allow',
      Principal: '*',
      Action: [
        's3:GetObject',
        's3:GetObjectVersion'
      ],
      Resource: `arn:aws:s3:::${config.bucketName}/*`
    }
  ]
}

async function setupMinIOBucket() {
  console.log('\n🚀 MinIO Bucket Setup')
  console.log('=' * 50)
  console.log(`Endpoint: ${config.endPoint}:${config.port}`)
  console.log(`Bucket: ${config.bucketName}`)
  console.log(`SSL: ${config.useSSL}`)
  console.log('=' * 50 + '\n')

  // Create MinIO client
  const minioClient = new Minio.Client({
    endPoint: config.endPoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    region: config.region
  })

  try {
    // Step 1: Check if bucket exists
    console.log('📦 Checking bucket existence...')
    const bucketExists = await minioClient.bucketExists(config.bucketName)
    
    if (!bucketExists) {
      console.log(`✨ Creating bucket: ${config.bucketName}`)
      await minioClient.makeBucket(config.bucketName, config.region)
      console.log('✅ Bucket created successfully')
    } else {
      console.log('✅ Bucket already exists')
    }

    // Step 2: Apply public read policy
    console.log('\n🔓 Applying public read policy...')
    await minioClient.setBucketPolicy(
      config.bucketName, 
      JSON.stringify(publicReadPolicy)
    )
    console.log('✅ Public read policy applied successfully')

    // Step 3: Verify policy
    console.log('\n🔍 Verifying bucket policy...')
    const currentPolicy = await minioClient.getBucketPolicy(config.bucketName)
    const policy = JSON.parse(currentPolicy)
    
    console.log('Current policy statements:')
    policy.Statement.forEach((statement, index) => {
      console.log(`  ${index + 1}. Effect: ${statement.Effect}, Action: ${statement.Action}`)
    })

    // Step 4: Test public access URL
    const testUrl = `${config.useSSL ? 'https' : 'http'}://${config.endPoint}:${config.port}/${config.bucketName}/`
    console.log('\n🌐 Public URL format:')
    console.log(`  ${testUrl}<object-key>`)
    console.log('\nExample:')
    console.log(`  ${testUrl}avatars/persona-id/image.webp`)

    // Step 5: List current objects (if any)
    console.log('\n📋 Current objects in bucket:')
    const objectsStream = minioClient.listObjectsV2(config.bucketName, '', true)
    let objectCount = 0
    
    await new Promise((resolve, reject) => {
      objectsStream.on('data', (obj) => {
        objectCount++
        console.log(`  - ${obj.name} (${(obj.size / 1024).toFixed(2)} KB)`)
      })
      objectsStream.on('error', reject)
      objectsStream.on('end', resolve)
    })

    if (objectCount === 0) {
      console.log('  (No objects found)')
    } else {
      console.log(`\nTotal objects: ${objectCount}`)
    }

    console.log('\n✨ MinIO bucket setup complete!')
    console.log('Your bucket is now configured for public read access.')
    
    // Additional notes for EasyPanel users
    if (config.endPoint !== 'localhost') {
      console.log('\n📝 EasyPanel Notes:')
      console.log('1. Make sure port 9000 is exposed in your EasyPanel service')
      console.log('2. Update MINIO_PUBLIC_URL in .env.local to match your public URL')
      console.log('3. Consider using a reverse proxy for HTTPS in production')
    }

  } catch (error) {
    console.error('\n❌ Error setting up MinIO bucket:')
    console.error(error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Connection refused. Please check:')
      console.error('1. MinIO server is running')
      console.error('2. Endpoint and port are correct')
      console.error('3. Firewall allows connection')
    } else if (error.code === 'InvalidAccessKeyId') {
      console.error('\n🔧 Invalid credentials. Please check:')
      console.error('1. MINIO_ACCESS_KEY is correct')
      console.error('2. MINIO_SECRET_KEY is correct')
    }
    
    process.exit(1)
  }
}

// Run the setup
setupMinIOBucket().catch(console.error)